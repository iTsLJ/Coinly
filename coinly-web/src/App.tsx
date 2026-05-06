import { useState } from 'react'
import Login from './pages/Login/Login'
import ForgotPassword from './pages/ForgotPassword/ForgotPassword'
import Cadastro from './pages/Cadastro/Cadastro'

type Route = 'login' | 'forgot' | 'cadastro'

function App() {
  const [route, setRoute] = useState<Route>('login')

  if (route === 'forgot') {
    return <ForgotPassword onBackToLogin={() => setRoute('login')} />
  }

  if (route === 'cadastro') {
    return <Cadastro onBackToLogin={() => setRoute('login')} />
  }

  return (
    <Login
      onForgotPassword={() => setRoute('forgot')}
      onSignUp={() => setRoute('cadastro')}
    />
  )
}

export default App
