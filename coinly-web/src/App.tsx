import { useState } from 'react'
import Login from './pages/Login/Login'
import ForgotPassword from './pages/ForgotPassword/ForgotPassword'
import Cadastro from './pages/Cadastro/Cadastro'
import HomePage from './pages/HomePage/HomePage'

type Route = 'login' | 'forgot' | 'cadastro' | 'home'

function App() {
  const [route, setRoute] = useState<Route>('login')

  if (route === 'forgot') {
    return <ForgotPassword onBackToLogin={() => setRoute('login')} />
  }

  if (route === 'cadastro') {
    return <Cadastro onBackToLogin={() => setRoute('login')} />
  }

  if (route === 'home') {
    return <HomePage />
  }

  return (
    <Login
      onForgotPassword={() => setRoute('forgot')}
      onSignUp={() => setRoute('cadastro')}
      onSuccess={() => setRoute('home')}
    />
  )
}

export default App