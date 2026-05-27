import "./ExtratoPage.css";
import { useEffect, useState } from "react";
import { coinlyApi, type TransacaoResponse } from "../../lib/coinly";

export default function ExtratoPage() {
  const [transacoes, setTransacoes] = useState<TransacaoResponse[]>([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    carregarExtrato();
  }, []);

  function formatarData(data: string) {
    return new Date(data).toLocaleString("pt-BR");
  }

  return (
    <div className="extrato-container">
      <div className="extrato-header">
        <h1>Extrato Coinly</h1>
        <p>Histórico completo de movimentações</p>
      </div>

      <div className="extrato-card">
        <div className="extrato-table-header">
          <span>Tipo</span>
          <span>Valor</span>
          <span>Descrição</span>
          <span>Movimentação</span>
          <span>Data</span>
        </div>

        {loading ? (
          <div className="extrato-loading">
            Carregando extrato...
          </div>
        ) : transacoes.length === 0 ? (
          <div className="extrato-empty">
            Nenhuma transação encontrada.
          </div>
        ) : (
          transacoes.map((transacao) => (
            <div className="extrato-row" key={transacao.id}>
              <div>
                <span
                  className={
                    transacao.entrada
                      ? "badge envio"
                      : "badge resgate"
                  }
                >
                  {transacao.tipo === "RESGATE"
                    ? "RESGATE"
                    : transacao.entrada
                    ? "RECEBIDO"
                    : "ENVIADO"}
                </span>
              </div>

              <div className="quantidade">
                {transacao.entrada ? "+" : "-"}
                {transacao.valor}
              </div>

              <div className="mensagem">
                {transacao.descricao || "-"}
              </div>

              <div>
                {transacao.origem} → {transacao.destino}
              </div>

              <div className="data">
                {formatarData(transacao.data)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}