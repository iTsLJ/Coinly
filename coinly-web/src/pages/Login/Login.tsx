import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthBrandPanel from '../../components/AuthBrandPanel/AuthBrandPanel'
import '../../components/AuthBrandPanel/AuthLayout.css'
import './Login.css'
import { coinlyApi } from '../../lib/coinly'
import { useAuth } from '../../hooks/useAuth'

type FormErrors = {
  email?: string
  password?: string
}

type LoginProps = {
  onForgotPassword?: () => void
  onSignUp?: () => void
  onSuccess?: () => void
}

function Login({ 
  
  onForgotPassword, 
  onSignUp, 
  onSuccess 
}: LoginProps) {
const navigate = useNavigate()
const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(true)
  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)

  const validate = (): FormErrors => {
    const next: FormErrors = {}
    if (!email.trim()) next.email = 'Informe seu e-mail'
    else if (!/^\S+@\S+\.\S+$/.test(email)) next.email = 'E-mail inválido'
    if (!password) next.password = 'Informe sua senha'
    else if (password.length < 6) next.password = 'Mínimo de 6 caracteres'
    return next
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setLoading(true)

    try {
    await login({ email, senha: password })

    navigate('/', { replace: true })

  } catch (error: any) {
    const message = error.payload?.message || 'Credenciais inválidas'
    setErrors({ email: ' ', password: message })
  } finally {
    setLoading(false)
  }
}

  return (
    <div className="auth-shell">
      <AuthBrandPanel />

      <main className="auth-main">
        <div className="auth-card">
          <div className="auth-card__header">
            <span className="auth-card__badge">Bem-vindo de volta</span>
            <h2 className="auth-card__title">Entrar na sua conta</h2>
            <p className="auth-card__subtitle">
              Acesse sua carteira Coinly e continue sua jornada.
            </p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <div className={`auth-field ${errors.email ? 'is-invalid' : ''}`}>
              <label htmlFor="email">E-mail</label>
              <div className="auth-input">
                <span className="auth-input__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path
                      d="M4 6h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2zm0 2v.4l8 5 8-5V8H4zm16 2.6-7.45 4.66a1 1 0 0 1-1.1 0L4 10.6V16h16v-5.4z"
                      fill="currentColor"
                    />
                  </svg>
                </span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="voce@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
              {errors.email && (
                <span className="auth-field__error">{errors.email}</span>
              )}
            </div>

            <div className={`auth-field ${errors.password ? 'is-invalid' : ''}`}>
              <label htmlFor="password">Senha</label>
              <div className="auth-input">
                <span className="auth-input__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 2a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V7a5 5 0 0 0-5-5zm-3 8V7a3 3 0 0 1 6 0v3H9z"
                      fill="currentColor"
                    />
                  </svg>
                </span>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="auth-input__toggle"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Esconder senha' : 'Mostrar senha'}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" fill="none">
                      <path
                        d="M2 12s3.5-7 10-7c2.06 0 3.84.62 5.32 1.5l-2.07 2.07A6.84 6.84 0 0 0 12 8a4 4 0 0 0-4 4c0 .82.25 1.59.68 2.23L5.06 17.85A12.7 12.7 0 0 1 2 12zm17.94-5.94 1.41 1.41L4.41 21.41 3 20l3.33-3.33A12.86 12.86 0 0 1 2 12s3.5-7 10-7c1.5 0 2.86.34 4.06.88l3.88-3.82zM12 16a4 4 0 0 0 4-4c0-.41-.06-.81-.18-1.18l-4.99 4.99c.37.12.77.19 1.17.19z"
                        fill="currentColor"
                      />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 5C5.5 5 2 12 2 12s3.5 7 10 7 10-7 10-7-3.5-7-10-7zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm0-2a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"
                        fill="currentColor"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <span className="auth-field__error">{errors.password}</span>
              )}
            </div>

            <div className="auth-row">
              <label className="auth-check">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                <span className="auth-check__box" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path
                      d="M5 12.5l4 4L19 7"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span>Lembrar de mim</span>
              </label>

              <button
                type="button"
                className="auth-link"
                onClick={() => onForgotPassword?.()}
              >
                Esqueceu a senha?
              </button>
            </div>

            <button
              type="submit"
              className={`auth-submit ${loading ? 'is-loading' : ''}`}
              disabled={loading}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>

            <p className="login-signup">
              Ainda não tem conta?{' '}
              <button
                type="button"
                className="auth-link auth-link--bold"
                onClick={() => navigate('/cadastro')}
              >
                Cadastre-se
              </button>
            </p>
          </form>
        </div>
      </main>
    </div>
  )
}

export default Login