import { useEffect, useState } from 'react'
import { coinlyApi, logout } from '../../lib/coinly'
import './HomePage.css'

type User = {
  username: string
  roles: string[]
}

function HomePage() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const data = await coinlyApi.me()
        setUser({
          username: data.username,
          roles: data.roles,
        })
      } catch {
        window.location.href = '/'
      }
    }
    load()
  }, [])

  const handleLogout = () => {
    logout()
    window.location.href = '/'
  }

  return (
    <div className="home">
      <header className="home-header">
        <div className="home-logo">
          <img src="/coinly.png" alt="Coinly" />
        </div>

        <div className="home-user">
          <span>Olá, {user?.username}</span>
          <button onClick={handleLogout}>Sair</button>
        </div>
      </header>

      <main className="home-content">
        <div className="home-welcome">
          <h1>Bem-vindo ao Coinly</h1>
          <p>Sistema de Moeda Estudantil</p>
        </div>

        <div className="home-cards">
          <div className="home-card">
            <h3>👨‍🎓 Alunos</h3>
            <p>Gerencie alunos cadastrados, visualize saldos e histórico de moedas.</p>
          </div>

          <div className="home-card">
            <h3>🏛️ Instituições</h3>
            <p>Visualize instituições parceiras e gerencie parcerias.</p>
          </div>

          <div className="home-card">
            <h3>💰 Minhas Moedas</h3>
            <p>Acompanhe seu saldo atual e extrato de transações.</p>
          </div>

          <div className="home-card">
            <h3>🏪 Vantagens</h3>
            <p>Explore e resgate recompensas disponíveis.</p>
          </div>

          <div className="home-card">
            <h3>👨‍🏫 Professores</h3>
            <p>Distribuição de moedas por mérito acadêmico.</p>
          </div>

          <div className="home-card">
            <h3>📊 Relatórios</h3>
            <p>Acompanhe estatísticas e movimentações do sistema.</p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default HomePage