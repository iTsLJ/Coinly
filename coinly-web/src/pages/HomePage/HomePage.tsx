import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useSaldoStream } from '../../hooks/useSaldoStream'
import { coinlyApi } from '../../lib/coinly'
import './HomePage.css'

function HomePage() {
  const { 
    user, 
    isAuthenticated, 
    loading, 
    isAluno, 
    isProfessor, 
    isEmpresa, 
    logout 
  } = useAuth()

  const navigate = useNavigate()
  const [fullUser, setFullUser] = useState<any>(null)
  const [profileLoading, setProfileLoading] = useState(false)
  const [showSaldo, setShowSaldo] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user || profileLoading) return
      setProfileLoading(true)

      try {
        let data = { ...user }

        if (user.tipo === 'ALUNO' && user.alunoId) {
          const res = await coinlyApi.getAlunoById(user.alunoId)
          data = { ...data, ...res }
        } else if (user.tipo === 'PROFESSOR') {
          const res = await coinlyApi.meuProfessor()
          data = { ...data, ...res }
        } else if (user.tipo === 'EMPRESA' && user.empresaId) {
          const res = await coinlyApi.getEmpresaById(user.empresaId)
          data = { ...data, ...res }
        }

        setFullUser(data)
      } catch (error) {
        console.error(error)
        setFullUser(user)
      } finally {
        setProfileLoading(false)
      }
    }

    if (user) loadProfile()
  }, [user])

  useSaldoStream(
    useCallback((novoSaldo: number) => {
      setFullUser((prev: any) => ({ ...(prev ?? {}), saldoMoedas: novoSaldo }))
    }, [])
  )

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login', { replace: true })
    }
  }, [isAuthenticated, loading, navigate])

  if (loading || profileLoading) {
    return <div className="loading-screen">Carregando...</div>
  }

  if (!user) return null

  const displayUser = fullUser || user
  const saldo = displayUser.saldoMoedas ?? 0

  return (
    <div className="home">
      <header className="home-header">
        <div className="home-logo">
          <svg width="46" height="46" viewBox="-4 -4 48 48" fill="none">
            <path d="M34 9C30 5 24 3 18 4C9 5.5 3 12.5 3 21C3 29.5 9.5 36.5 18 37.5C24 38.5 30 36 34 32"
              stroke="url(#cGrad)" strokeWidth="6" strokeLinecap="round"/>
            <circle cx="20" cy="20.5" r="8.5" fill="url(#coinGrad)"/>
            <path d="M20 14.5l1.8 5.5h5.5l-4.5 3.2 1.8 5.5L20 25.5l-4.6 3.2 1.8-5.5-4.5-3.2h5.5z" fill="white"/>
            <defs>
              <linearGradient id="cGrad" x1="3" y1="4" x2="34" y2="37" gradientUnits="userSpaceOnUse">
                <stop stopColor="#a78bfa"/>
                <stop offset="1" stopColor="#6c4dff"/>
              </linearGradient>
              <linearGradient id="coinGrad" x1="12" y1="13" x2="28" y2="28" gradientUnits="userSpaceOnUse">
                <stop stopColor="#ffd94d"/>
                <stop offset="1" stopColor="#e6a800"/>
              </linearGradient>
            </defs>
          </svg>
          <div className="home-logo-text">
            <span className="home-logo-wordmark">Coinly</span>
            <span className="home-logo-tagline">Moeda Estudantil</span>
          </div>
        </div>
        <div className="home-user">
          <span>Olá, {displayUser.nome?.split(' ')[0]}</span>
          <button onClick={logout}>Sair</button>
        </div>
      </header>

     <main className="home-content">
  <div className="home-welcome">
    <h1>Bem-vindo ao Coinly</h1>
    <p>Sua moeda estudantil</p>
  </div>

  {(isAluno || isProfessor) && (
  <div className="balance-card">
    <div className="balance-header">
      <div className="balance-header-left">
        <div className="balance-coin-icon">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
            <path d="M12 2l2.09 6.43H21l-5.47 3.97 2.09 6.43L12 14.87l-5.62 3.96 2.09-6.43L2.97 8.43H9.9L12 2z"/>
          </svg>
        </div>
        <span>{isProfessor ? 'Saldo para distribuir' : 'Saldo disponível'}</span>
      </div>
      <button
        type="button"
        className="toggle-saldo-btn"
        onClick={() => setShowSaldo(!showSaldo)}
        aria-label={showSaldo ? 'Esconder saldo' : 'Mostrar saldo'}
      >
        {showSaldo ? (
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
            <line x1="1" y1="1" x2="23" y2="23"/>
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
        )}
      </button>
    </div>

    <div className="balance-amount-container">
      <div className="balance-amount">
        {showSaldo 
          ? saldo.toLocaleString('pt-BR') 
          : '••••••'
        }
        <span className="balance-currency">
          {showSaldo ? 'Coinlys' : ''}
        </span>
      </div>

    </div>

    <div className="balance-footer">
      <button 
        className="btn-extrato"
        onClick={() => navigate('/extrato')}
      >
        Mostrar Extrato Completo
      </button>
    </div>
  </div>
)}

        <div className="home-cards">
          {isProfessor && (
            <>
              <div className="home-card" onClick={() => navigate('/enviar-moedas')}>
                <div className="home-card-icon home-card-icon--purple">
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
                  </svg>
                </div>
                <h3>Enviar Moedas</h3>
                <p>Reconheça o mérito dos seus alunos distribuindo Coinlys.</p>
                <span className="home-card-cta">Distribuir agora →</span>
              </div>

              <div className="home-card" onClick={() => navigate('/extrato')}>
                <div className="home-card-icon home-card-icon--yellow">
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
                  </svg>
                </div>
                <h3>Extrato</h3>
                <p>Acompanhe seu saldo e o histórico de movimentações.</p>
                <span className="home-card-cta">Ver extrato →</span>
              </div>
            </>
          )}

          {isAluno && (
            <>
              <div className="home-card" onClick={() => navigate('/vantagens')}>
                <div className="home-card-icon home-card-icon--purple">
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 12V22H4V12"/><path d="M22 7H2v5h20V7z"/><path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
                  </svg>
                </div>
                <h3>Resgatar Vantagens</h3>
                <p>Troque seus Coinlys por produtos e descontos exclusivos.</p>
                <span className="home-card-cta">Ver vantagens →</span>
              </div>

              <div className="home-card" onClick={() => navigate('/extrato')}>
                <div className="home-card-icon home-card-icon--yellow">
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
                  </svg>
                </div>
                <h3>Meu Extrato</h3>
                <p>Visualize todas as suas movimentações de Coinlys.</p>
                <span className="home-card-cta">Ver extrato →</span>
              </div>
            </>
          )}

          {isEmpresa && (
            <>
              <div className="home-card" onClick={() => navigate('/minhas-vantagens')}>
                <div className="home-card-icon home-card-icon--purple">
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
                  </svg>
                </div>
                <h3>Minhas Vantagens</h3>
                <p>Gerencie as vantagens oferecidas aos estudantes.</p>
                <span className="home-card-cta">Gerenciar →</span>
              </div>

              <div className="home-card" onClick={() => navigate('/vantagens')}>
                <div className="home-card-icon home-card-icon--green">
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                </div>
                <h3>Explorar Vantagens</h3>
                <p>Veja todas as vantagens disponíveis na plataforma.</p>
                <span className="home-card-cta">Explorar →</span>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}

export default HomePage