import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
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
        } else if (user.tipo === 'PROFESSOR' && user.professorId) {
          const res = await coinlyApi.getProfessorById(user.professorId)
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
          <img src="/coinly.png" alt="Coinly" />
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

  {isAluno && (
  <div className="balance-card">
    <div className="balance-header">
      <span>Saldo disponível</span>
      
    </div>
      <button
        type="button"
        className="toggle-saldo-btn"
        onClick={() => setShowSaldo(!showSaldo)}
        aria-label={showSaldo ? 'Esconder saldo' : 'Mostrar saldo'}
      >
        {showSaldo ? (
          <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
            <path
              d="M2 12s3.5-7 10-7c2.06 0 3.84.62 5.32 1.5l-2.07 2.07A6.84 6.84 0 0 0 12 8a4 4 0 0 0-4 4c0 .82.25 1.59.68 2.23L5.06 17.85A12.7 12.7 0 0 1 2 12zm17.94-5.94 1.41 1.41L4.41 21.41 3 20l3.33-3.33A12.86 12.86 0 0 1 2 12s3.5-7 10-7c1.5 0 2.86.34 4.06.88l3.88-3.82zM12 16a4 4 0 0 0 4-4c0-.41-.06-.81-.18-1.18l-4.99 4.99c.37.12.77.19 1.17.19z"
              fill="currentColor"
            />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
            <path
              d="M12 5C5.5 5 2 12 2 12s3.5 7 10 7 10-7 10-7-3.5-7-10-7zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm0-2a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"
              fill="currentColor"
            />
          </svg>
        )}
      </button>

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
            <div className="home-card" onClick={() => navigate('/enviar-moedas')}>
              <h3>👨‍🏫 Enviar Moedas</h3>
              <p>Reconheça o mérito dos seus alunos distribuindo Coinlys.</p>
            </div>
          )}

          {isAluno && (
            <>
              <div className="home-card" onClick={() => navigate('/vantagens')}>
                <h3>🏪 Resgatar Vantagens</h3>
                <p>Troque seus Coinlys por produtos e descontos.</p>
              </div>

              <div className="home-card">
                <h3>💸 Ações Rápidas</h3>
                <p>Gerencie seu saldo e histórico.</p>
                <button 
                  className="btn-secondary"
                  onClick={() => navigate('/extrato')}
                >
                  Ver Extrato Completo
                </button>
              </div>
            </>
          )}

          {isEmpresa && (
            <>
              <div className="home-card" onClick={() => navigate('/minhas-vantagens')}>
                <h3>🏢 Minhas Vantagens</h3>
                <p>Gerencie as vantagens oferecidas aos alunos.</p>
              </div>

              <div className="home-card" onClick={() => navigate('/vantagens')}>
                <h3>🌐 Ver Todas as Vantagens</h3>
                <p>Visualize todas as vantagens disponíveis no sistema.</p>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}

export default HomePage