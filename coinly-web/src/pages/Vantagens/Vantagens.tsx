import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { coinlyApi } from '../../lib/coinly'
import './Vantagens.css'

type Vantagem = {
  id: number
  nome: string
  descricao: string
  fotoUrl?: string
  custoMoedas: number
  empresaNome: string
}

function Vantagens() {
  const navigate = useNavigate()

  const [vantagens, setVantagens] = useState<Vantagem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchVantagens = async () => {
      try {
        const response = await coinlyApi.listarVantagens()

        const lista = Array.isArray(response)
          ? response
          : (response as any)?.data || []

        setVantagens(lista)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchVantagens()
  }, [])

  if (loading) {
    return (
      <div className="loading-screen">
        Carregando vantagens...
      </div>
    )
  }

  return (
    <div className="vantagens-wrapper">
      <div className="vantagens-page">
        <div className="page-header">
          <div>
            <button
              className="btn-back"
              onClick={() => navigate('/')}
            >
              ← Voltar para Home
            </button>

            <h1>Todas as Vantagens Disponíveis</h1>
          </div>
        </div>

        <div className="vantagens-grid">
          {vantagens.map((v) => (
            <div key={v.id} className="vantagem-card">
              {v.fotoUrl && (
                <img
                  src={v.fotoUrl}
                  alt={v.nome}
                  className="vantagem-img"
                />
              )}

              <div className="vantagem-card-content">
                <h3>{v.nome}</h3>

                <p className="empresa">
                  {v.empresaNome}
                </p>

                <p className="descricao">
                  {v.descricao}
                </p>

                <p className="custo">
                  {v.custoMoedas} Coinlys
                </p>

                <button className="btn-resgatar">
                  Resgatar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Vantagens