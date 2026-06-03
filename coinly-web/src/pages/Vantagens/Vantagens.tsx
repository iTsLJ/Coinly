import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
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

  // Fluxo de resgate
  const [confirmacao, setConfirmacao] = useState<Vantagem | null>(null)
  const [resgatando, setResgatando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [sucesso, setSucesso] = useState<{ cupom: string; vantagem: Vantagem } | null>(null)
  const [copiado, setCopiado] = useState(false)

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

  const abrirConfirmacao = (vantagem: Vantagem) => {
    setErro(null)
    setConfirmacao(vantagem)
  }

  const fecharConfirmacao = () => {
    if (resgatando) return
    setConfirmacao(null)
    setErro(null)
  }

  const confirmarResgate = async () => {
    if (!confirmacao) return
    setResgatando(true)
    setErro(null)
    try {
      const { cupom } = await coinlyApi.resgatarVantagem(confirmacao.id)
      setSucesso({ cupom, vantagem: confirmacao })
      setConfirmacao(null)
    } catch (err: any) {
      setErro(err?.payload?.message || 'Não foi possível resgatar esta vantagem.')
    } finally {
      setResgatando(false)
    }
  }

  const copiarCupom = async () => {
    if (!sucesso) return
    try {
      await navigator.clipboard.writeText(sucesso.cupom)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2000)
    } catch {
      /* clipboard indisponível — ignora */
    }
  }

  const fecharSucesso = () => {
    setSucesso(null)
    setCopiado(false)
  }

  if (loading) {
    return <div className="loading-screen">Carregando vantagens...</div>
  }

  return (
    <div className="vantagens-wrapper">
      <div className="vantagens-page">
        <div className="page-header">
          <button className="btn-back" onClick={() => navigate('/')}>
            ← Voltar para Home
          </button>
          <h1>Todas as Vantagens Disponíveis</h1>
          <p className="page-subtitle">Troque seus Coinlys por produtos e descontos exclusivos.</p>
        </div>

        {vantagens.length === 0 ? (
          <div className="vantagens-empty">Nenhuma vantagem disponível no momento.</div>
        ) : (
          <div className="vantagens-grid">
            {vantagens.map((v) => (
              <div key={v.id} className="vantagem-card">
                {v.fotoUrl && (
                  <img src={v.fotoUrl} alt={v.nome} className="vantagem-img" />
                )}

                <div className="vantagem-card-content">
                  <h3>{v.nome}</h3>
                  <p className="empresa">{v.empresaNome}</p>
                  <p className="descricao">{v.descricao}</p>

                  <div className="vantagem-card-footer">
                    <span className="custo">
                      <span className="custo-valor">{v.custoMoedas}</span> Coinlys
                    </span>
                    <button className="btn-resgatar" onClick={() => abrirConfirmacao(v)}>
                      Resgatar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de confirmação */}
      {confirmacao && (
        <div className="modal-overlay" onClick={fecharConfirmacao}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon modal-icon-confirm">🎟️</div>
            <h2 className="modal-title">Confirmar resgate</h2>
            <p className="modal-text">
              Você está prestes a resgatar <strong>{confirmacao.nome}</strong> por{' '}
              <strong>{confirmacao.custoMoedas} Coinlys</strong>.
            </p>

            {erro && <div className="modal-erro">{erro}</div>}

            <div className="modal-actions">
              <button
                className="modal-btn modal-btn-ghost"
                onClick={fecharConfirmacao}
                disabled={resgatando}
              >
                Cancelar
              </button>
              <button
                className="modal-btn modal-btn-primary"
                onClick={confirmarResgate}
                disabled={resgatando}
              >
                {resgatando ? 'Resgatando...' : 'Confirmar resgate'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de sucesso com o cupom */}
      {sucesso && (
        <div className="modal-overlay" onClick={fecharSucesso}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon modal-icon-success">
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
            <h2 className="modal-title">Resgate concluído!</h2>
            <p className="modal-text">
              Enviamos um e-mail com o cupom de <strong>{sucesso.vantagem.nome}</strong>.
              Use o código abaixo para aproveitar sua vantagem.
            </p>

            <div className="cupom-box">
              <div className="cupom-qr">
                <QRCodeSVG
                  value={sucesso.cupom}
                  size={140}
                  bgColor="transparent"
                  fgColor="#ffffff"
                  level="M"
                />
              </div>
              <div className="cupom-divider" />
              <span className="cupom-label">Código do cupom</span>
              <span className="cupom-codigo">{sucesso.cupom}</span>
              <button className="cupom-copy" onClick={copiarCupom}>
                {copiado ? 'Copiado ✓' : 'Copiar'}
              </button>
            </div>

            <div className="modal-actions">
              <button className="modal-btn modal-btn-primary modal-btn-full" onClick={fecharSucesso}>
                Concluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Vantagens
