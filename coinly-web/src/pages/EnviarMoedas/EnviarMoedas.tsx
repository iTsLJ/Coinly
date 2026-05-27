import { useState, useEffect } from 'react'
import { coinlyApi, type AlunoResponse } from '../../lib/coinly'

function EnviarMoedas() {
  const [alunos, setAlunos] = useState<AlunoResponse[]>([])
  const [form, setForm] = useState({ alunoId: '', quantidade: 0, mensagem: '' })
  const [sending, setSending] = useState(false)

  useEffect(() => {
    coinlyApi.listarAlunos().then(setAlunos).catch(console.error)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.alunoId || form.quantidade <= 0 || !form.mensagem.trim()) return

    setSending(true)
    try {
      await coinlyApi.enviarMoedas(
        Number(form.alunoId),
        form.quantidade,
        form.mensagem
      )
      alert('Envio recebido! O processamento e o e-mail acontecem em segundo plano.')
      setForm({ alunoId: '', quantidade: 0, mensagem: '' })
    } catch (err: any) {
      alert(err.payload?.message || 'Erro ao enviar moedas')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="page-container">
      <div className="auth-card">
        <h3>Distribuir Moedas</h3>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <label>Selecionar Aluno</label>
            <select 
              value={form.alunoId} 
              onChange={e => setForm({ ...form, alunoId: e.target.value })}
              required
            >
              <option value="">Selecione um aluno...</option>
              {alunos.map(a => (
                <option key={a.id} value={a.id}>
                  {a.nome} ({a.instituicaoNome})
                </option>
              ))}
            </select>
          </div>

          <div className="auth-field">
            <label>Quantidade de Moedas</label>
            <input 
              type="number" 
              value={form.quantidade} 
              onChange={e => setForm({ ...form, quantidade: Number(e.target.value) })}
              min="1"
              required
            />
          </div>

          <div className="auth-field">
            <label>Motivo / Mensagem</label>
            <textarea 
              value={form.mensagem} 
              onChange={e => setForm({ ...form, mensagem: e.target.value })}
              placeholder="Ex: Ótima participação no seminário..."
              required
            />
          </div>

          <button type="submit" className="auth-submit" disabled={sending}>
            {sending ? 'Enviando...' : 'Confirmar Envio'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default EnviarMoedas