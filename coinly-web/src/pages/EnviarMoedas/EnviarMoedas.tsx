import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { coinlyApi, type AlunoResponse } from '../../lib/coinly'
import { useAuth } from '../../hooks/useAuth'
import './EnviarMoedas.css'

function EnviarMoedas() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [alunos, setAlunos] = useState<AlunoResponse[]>([])
  const [form, setForm] = useState({ alunoId: '', quantidade: '', mensagem: '' })
  const [sending, setSending] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [sucesso, setSucesso] = useState(false)
  const [saldo, setSaldo] = useState<number | null>(null)

  useEffect(() => {
    coinlyApi.listarAlunos().then(setAlunos).catch(console.error)
  }, [])

  useEffect(() => {
    async function carregarSaldo() {
      if (!user || user.tipo !== 'PROFESSOR') return
      try {
        const res = await coinlyApi.meuProfessor()
        setSaldo(res?.saldoMoedas ?? null)
      } catch (e) {
        console.error(e)
      }
    }
    carregarSaldo()
  }, [user])

  const quantidadeNum = Number(form.quantidade)
  const alunoSelecionado = alunos.find((a) => String(a.id) === form.alunoId)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro(null)

    if (!form.alunoId) return setErro('Selecione um aluno.')
    if (!quantidadeNum || quantidadeNum <= 0) return setErro('Informe uma quantidade maior que zero.')
    if (saldo !== null && quantidadeNum > saldo)
      return setErro(`Saldo insuficiente. Você tem ${saldo} Coinlys para distribuir.`)
    if (!form.mensagem.trim()) return setErro('Escreva um motivo para o envio.')

    setSending(true)
    try {
      await coinlyApi.enviarMoedas(Number(form.alunoId), quantidadeNum, form.mensagem)
      setSucesso(true)
      if (saldo !== null) setSaldo(saldo - quantidadeNum)
      setForm({ alunoId: '', quantidade: '', mensagem: '' })
    } catch (err: any) {
      setErro(err?.payload?.message || 'Erro ao enviar moedas.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="enviar-wrapper">
      <div className="enviar-container">
        <button className="btn-back" onClick={() => navigate('/')}>
          ← Voltar para Home
        </button>

        <div className="enviar-grid">
          {/* Coluna info */}
          <aside className="enviar-aside">
            <h1>Distribuir Moedas</h1>
            <p className="enviar-sub">
              Reconheça o mérito dos seus alunos enviando Coinlys. O processamento e o
              e-mail de aviso acontecem em segundo plano.
            </p>

            <div className="saldo-pill">
              <span className="saldo-pill-label">Disponível para distribuir</span>
              <span className="saldo-pill-value">
                {saldo === null ? '—' : saldo.toLocaleString('pt-BR')}
                <span className="saldo-pill-unit">Coinlys</span>
              </span>
            </div>
          </aside>

          {/* Coluna form */}
          <form onSubmit={handleSubmit} className="enviar-card">
            <div className="field">
              <label>Selecionar aluno</label>
              <select
                value={form.alunoId}
                onChange={(e) => setForm({ ...form, alunoId: e.target.value })}
              >
                <option value="">Selecione um aluno...</option>
                {alunos.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.nome} ({a.instituicaoNome})
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label>Quantidade de moedas</label>
              <input
                type="number"
                value={form.quantidade}
                onChange={(e) => setForm({ ...form, quantidade: e.target.value })}
                min="1"
                placeholder="0"
              />
              {saldo !== null && quantidadeNum > saldo && (
                <span className="field-hint field-hint-error">
                  Acima do seu saldo ({saldo})
                </span>
              )}
            </div>

            <div className="field">
              <label>Motivo / mensagem</label>
              <textarea
                value={form.mensagem}
                onChange={(e) => setForm({ ...form, mensagem: e.target.value })}
                placeholder="Ex: Ótima participação no seminário..."
                rows={3}
              />
            </div>

            {erro && <div className="form-erro">{erro}</div>}

            <button type="submit" className="btn-enviar" disabled={sending}>
              {sending ? 'Enviando...' : 'Confirmar envio'}
            </button>
          </form>
        </div>
      </div>

      {/* Modal de sucesso */}
      {sucesso && (
        <div className="modal-overlay" onClick={() => setSucesso(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon-success">
              <svg viewBox="0 0 24 24" width="34" height="34" fill="none">
                <path
                  d="M20 6 9 17l-5-5"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h2 className="modal-title">Envio recebido!</h2>
            <p className="modal-text">
              O envio foi enviado para processamento. O aluno receberá as moedas e um
              e-mail de aviso em instantes.
            </p>
            <button className="btn-enviar btn-enviar-modal" onClick={() => setSucesso(false)}>
              Entendi
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default EnviarMoedas
