import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import {
  coinlyApi,
  type VantagemResponse,
  type VantagemRequest
} from '../../lib/coinly'
import './EmpresaVantagens.css'

function EmpresaVantagens() {
  const { isEmpresa } = useAuth()
  const navigate = useNavigate()

  const [vantagens, setVantagens] = useState<VantagemResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  const [formData, setFormData] = useState<VantagemRequest>({
    nome: '',
    descricao: '',
    fotoUrl: '',
    custoMoedas: 0
  })

  useEffect(() => {
    if (isEmpresa) {
      carregarMinhasVantagens()
    }
  }, [isEmpresa])

  const carregarMinhasVantagens = async () => {
  try {
    const res = await coinlyApi.listarMinhasVantagens()
    setVantagens(res)
  } catch (err) {
    console.error(err)
  } finally {
    setLoading(false)
  }
}

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await coinlyApi.criarVantagem(formData)

      setShowForm(false)

      setFormData({
        nome: '',
        descricao: '',
        fotoUrl: '',
        custoMoedas: 0
      })

      carregarMinhasVantagens()

      alert('Vantagem criada com sucesso!')
    } catch (err) {
      alert('Erro ao criar vantagem')
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Deseja realmente excluir esta vantagem?')) return

    try {
      await coinlyApi.deletarVantagem(id)
      carregarMinhasVantagens()
    } catch (err) {
      alert('Erro ao excluir vantagem')
    }
  }

  if (!isEmpresa) {
    return <p>Acesso restrito apenas para empresas parceiras.</p>
  }

  if (loading) {
    return <div className="loading-screen">Carregando...</div>
  }

  return (
    <div className="empresa-vantagens-wrapper">
      <div className="empresa-vantagens">
        <div className="page-header">
          <div>
            <button
              className="btn-back"
              onClick={() => navigate('/')}
            >
              ← Voltar para Home
            </button>

            <h1>Minhas Vantagens</h1>
          </div>

          <button
            className="btn-primary"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Fechar Formulário' : '+ Nova Vantagem'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="vantagem-form">
            <input
              type="text"
              placeholder="Nome da Vantagem"
              value={formData.nome}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  nome: e.target.value
                })
              }
              required
            />

            <textarea
              placeholder="Descrição da vantagem"
              value={formData.descricao}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  descricao: e.target.value
                })
              }
              required
            />

            <input
              type="text"
              placeholder="URL da Foto"
              value={formData.fotoUrl}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  fotoUrl: e.target.value
                })
              }
            />

            <input
              type="number"
              placeholder="Custo em Coinlys"
              value={formData.custoMoedas}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  custoMoedas: Number(e.target.value)
                })
              }
              required
            />

            <button type="submit" className="btn-success">
              Criar Vantagem
            </button>
          </form>
        )}

        <div className="vantagens-grid">
          {vantagens.length === 0 && (
            <p>Você ainda não cadastrou nenhuma vantagem.</p>
          )}

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

                <p className="descricao">
                  {v.descricao}
                </p>

                <p className="custo">
                  {v.custoMoedas} Coinlys
                </p>

                <button
                  className="btn-delete"
                  onClick={() => handleDelete(v.id)}
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default EmpresaVantagens