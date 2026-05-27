import "./ExtratoPage.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { coinlyApi, type TransacaoResponse } from "../../lib/coinly";
import { useAuth } from "../../hooks/useAuth";

export default function ExtratoPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [transacoes, setTransacoes] = useState<TransacaoResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [saldo, setSaldo] = useState<number | null>(null);

  useEffect(() => {
    async function carregarExtrato() {
      try {
        const response = await coinlyApi.getExtrato();
        setTransacoes(response);
      } catch (error) {
        console.error("Erro ao carregar extrato:", error);
      } finally {
        setLoading(false);
      }
    }
    carregarExtrato();
  }, []);

  useEffect(() => {
    async function carregarSaldo() {
      if (!user) return;
      try {
        if (user.tipo === "ALUNO" && user.alunoId) {
          const res = await coinlyApi.getAlunoById(user.alunoId);
          setSaldo(res?.saldoMoedas ?? null);
        } else if (user.tipo === "PROFESSOR" && user.professorId) {
          const res = await coinlyApi.getProfessorById(user.professorId);
          setSaldo(res?.saldoMoedas ?? null);
        }
      } catch (error) {
        console.error("Erro ao carregar saldo:", error);
      }
    }
    carregarSaldo();
  }, [user]);

  function formatarData(data: string) {
    return new Date(data).toLocaleString("pt-BR");
  }

  function rotuloTipo(t: TransacaoResponse) {
    if (t.tipo === "RESGATE") return "RESGATE";
    return t.entrada ? "RECEBIDO" : "ENVIADO";
  }

  const totalEntradas = transacoes
    .filter((t) => t.entrada)
    .reduce((acc, t) => acc + t.valor, 0);
  const totalSaidas = transacoes
    .filter((t) => !t.entrada)
    .reduce((acc, t) => acc + t.valor, 0);

  return (
    <div className="extrato-wrapper">
      <div className="extrato-container">
        <div className="extrato-topbar">
          <button className="btn-back" onClick={() => navigate("/")}>
            ← Voltar para Home
          </button>
        </div>

        <div className="extrato-header">
          <h1>Extrato Coinly</h1>
          <p>Histórico completo de movimentações</p>
        </div>

        {/* Resumo / saldo */}
        <div className="extrato-summary">
          {saldo !== null && (
            <div className="summary-card summary-saldo">
              <span className="summary-label">Saldo atual</span>
              <span className="summary-value">
                {saldo.toLocaleString("pt-BR")}
                <span className="summary-unit">Coinlys</span>
              </span>
            </div>
          )}
          <div className="summary-card">
            <span className="summary-label">Entradas</span>
            <span className="summary-value summary-in">
              +{totalEntradas.toLocaleString("pt-BR")}
            </span>
          </div>
          <div className="summary-card">
            <span className="summary-label">Saídas</span>
            <span className="summary-value summary-out">
              -{totalSaidas.toLocaleString("pt-BR")}
            </span>
          </div>
        </div>

        {/* Lista de transações */}
        <div className="extrato-card">
          {loading ? (
            <div className="extrato-loading">Carregando extrato...</div>
          ) : transacoes.length === 0 ? (
            <div className="extrato-empty">Nenhuma transação encontrada.</div>
          ) : (
            <ul className="extrato-list">
              {transacoes.map((t) => (
                <li className="extrato-row" key={t.id}>
                  <div className="row-main">
                    <span
                      className={`badge ${t.entrada ? "badge-in" : "badge-out"}`}
                    >
                      {rotuloTipo(t)}
                    </span>
                    <div className="row-info">
                      <span className="row-desc">{t.descricao || "Movimentação"}</span>
                      <span className="row-mov">
                        {t.origem} → {t.destino}
                      </span>
                    </div>
                  </div>

                  <div className="row-side">
                    <span className={`row-valor ${t.entrada ? "valor-in" : "valor-out"}`}>
                      {t.entrada ? "+" : "-"}
                      {t.valor}
                    </span>
                    <span className="row-data">{formatarData(t.data)}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
