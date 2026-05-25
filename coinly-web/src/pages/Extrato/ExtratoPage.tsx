import { useEffect, useState } from 'react'
import { coinlyApi, type TransacaoResponse } from '../../lib/coinly'

function ExtratoPage() {
  const [transacoes, setTransacoes] = useState<TransacaoResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(false)
    setError('Extrato completo em desenvolvimento')
  }, [])

  if (loading) return <div className="loading-screen">Carregando extrato...</div>
  if (error) {
    return (
      <div className="page-container">
        <h3>{error}</h3>
        <p>Esta funcionalidade será liberada em breve.</p>
      </div>
    )
  }

  return (
    <div className="page-container">
      <header className="page-header">
        <h2>Meu Extrato</h2>
      </header>

      <div className="home-card">
        <p>Histórico completo de transações será exibido aqui.</p>
      </div>
    </div>
  )
}

export default ExtratoPage