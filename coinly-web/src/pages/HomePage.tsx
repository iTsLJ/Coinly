import { Link } from 'react-router-dom'

export function HomePage() {
  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Bem-vindo ao Coinly</h1>
          <p className="page-subtitle">
            Sistema de Moeda Estudantil — gerencie alunos e empresas parceiras
          </p>
        </div>
      </div>
      <div className="home-cards">
        <Link to="/alunos" className="home-card">
          <div className="home-card-icon">🎓</div>
          <div className="home-card-title">Alunos</div>
          <div className="home-card-desc">
            Cadastrar, consultar, editar e remover alunos vinculados às
            instituições parceiras.
          </div>
        </Link>
        <Link to="/empresas" className="home-card">
          <div className="home-card-icon">🏢</div>
          <div className="home-card-title">Empresas Parceiras</div>
          <div className="home-card-desc">
            Cadastrar empresas, aprovar/rejeitar parcerias e gerenciar
            cadastros existentes.
          </div>
        </Link>
      </div>
    </>
  )
}
