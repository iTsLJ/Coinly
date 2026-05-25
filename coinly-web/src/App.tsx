import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'

import Login from './pages/Login/Login'
import Cadastro from './pages/Cadastro/Cadastro'

import HomePage from './pages/HomePage/HomePage'
import EnviarMoedas from './pages/EnviarMoedas/EnviarMoedas'
import CatalogoVantagens from './pages/CatalogoVantagens/CatalogoVantagens'
import ExtratoPage from './pages/Extrato/ExtratoPage'

import { useAuth } from './hooks/useAuth'

function ProtectedRoute({
  children,
}: {
  children: React.ReactNode
}) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        Carregando...
      </div>
    )
  }

  return isAuthenticated ? (
    <>{children}</>
  ) : (
    <Navigate to="/login" replace />
  )
}

function AppRoutes() {
  const navigate = useNavigate()

  return (
    <Routes>
      <Route
        path="/login"
        element={
          <Login
            onSignUp={() => navigate('/cadastro')}
            onSuccess={() => navigate('/')}
          />
        }
      />

      <Route
        path="/cadastro"
        element={
          <Cadastro
            onBackToLogin={() => navigate('/login')}
          />
        }
      />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/enviar-moedas"
        element={
          <ProtectedRoute>
            <EnviarMoedas />
          </ProtectedRoute>
        }
      />

      <Route
        path="/vantagens"
        element={
          <ProtectedRoute>
            <CatalogoVantagens />
          </ProtectedRoute>
        }
      />

      <Route
        path="/extrato"
        element={
          <ProtectedRoute>
            <ExtratoPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="*"
        element={<Navigate to="/login" replace />}
      />
    </Routes>
  )
}

export default AppRoutes