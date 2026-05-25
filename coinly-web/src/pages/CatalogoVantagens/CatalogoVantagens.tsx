import { useEffect, useState } from 'react'
import { coinlyApi, type VantagemResponse } from '../../lib/coinly'

function CatalogoVantagens() {
  const [vantagens, setVantagens] = useState<VantagemResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(false)
    setError('Funcionalidade de vantagens em desenvolvimento')
  }, [])

  const handleResgate = async (id: number) => {
    if (!confirm('Deseja realmente resgatar esta vantagem?')) return

    try {
      const cupom = await coinlyApi.resgatarVantagem(id)
      alert(`Resgate realizado com sucesso!\n\nCupom: ${cupom}\n\nVerifique seu e-mail.`)
    } catch (err: any) {
      alert(err.payload?.message || 'Erro ao resgatar vantagem. Verifique seu saldo.')
    }
  }

  if (loading) return <div className="loading-screen">Carregando vantagens...</div>
  if (error) return <div className="page-container"><h3>{error}</h3></div>

  return (
    <div className="page-container">
      <header className="page-header">
        <h2>Catálogo de Vantagens</h2>
      </header>

      <div className="home-cards">
        <div className="home-card">
          <h3>Em breve</h3>
          <p>As vantagens das empresas parceiras aparecerão aqui.</p>
        </div>
      </div>
    </div>
  )
}

export default CatalogoVantagens