import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import './HomePage.css'

function HomePage() {
  const { user, isAuthenticated,loading, isAluno, isProfessor, isEmpresa, logout } = useAuth()
  const navigate = useNavigate()

useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login', { replace: true })
    }
  }, [isAuthenticated, loading, navigate])

  if (loading) {
    return <div className="loading-screen">Carregando...</div>
  }
  if (!user) return null

  return (
    <div className="home">
      <header className="home-header">
        <div className="home-logo">
          <img src="/coinly.png" alt="Coinly" />
          <span>Coinly</span>
        </div>

        <div className="home-user">
          <span>Olá, {user.username}</span>
          <button onClick={logout}>Sair</button>
        </div>
      </header>

      <main className="home-content">
        <div className="home-welcome">
          <h1>Bem-vindo ao Coinly</h1>
          <p>Sistema de Moeda Estudantil</p>
        </div>

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
              <div className="home-card" onClick={() => navigate('/extrato')}>
                <h3>💰 Meu Extrato</h3>
                <p>Acompanhe seu saldo e histórico de transações.</p>
              </div>
            </>
          )}

          {isEmpresa && (
            <div className="home-card">
              <h3>🏢 Minhas Vantagens</h3>
              <p>Gerencie as vantagens oferecidas aos alunos.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default HomePage