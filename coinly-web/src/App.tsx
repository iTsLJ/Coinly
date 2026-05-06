import { useState } from 'react'
import Login from './pages/Login/Login'
import ForgotPassword from './pages/ForgotPassword/ForgotPassword'

type Route = 'login' | 'forgot'

function App() {
  const [route, setRoute] = useState<Route>('login')

  if (route === 'forgot') {
    return <ForgotPassword onBackToLogin={() => setRoute('login')} />
  }

  return <Login onForgotPassword={() => setRoute('forgot')} />
}

export default App
