import { useState, type FormEvent } from 'react'
import AuthBrandPanel from '../../components/AuthBrandPanel/AuthBrandPanel'
import '../../components/AuthBrandPanel/AuthLayout.css'
import './Login.css'

type FormErrors = {
  email?: string
  password?: string
}

type LoginProps = {
  onForgotPassword?: () => void
  onSignUp?: () => void
}

function Login({ onForgotPassword, onSignUp }: LoginProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(true)
  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

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
    setSubmitted(false)
    await new Promise((resolve) => setTimeout(resolve, 900))
    setLoading(false)
    setSubmitted(true)
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
              {loading ? (
                <>
                  <span className="auth-submit__spinner" aria-hidden="true" />
                  Entrando...
                </>
              ) : (
                <>
                  Entrar
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M5 12h14M13 6l6 6-6 6"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </>
              )}
            </button>

            {submitted && !loading && (
              <div className="auth-success" role="status">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M5 12.5l4 4L19 7"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Login validado! Em breve você será redirecionado.
              </div>
            )}

            <div className="login-divider">
              <span>ou continue com</span>
            </div>

            <div className="login-socials">
              <button type="button" className="login-social" aria-label="Entrar com Google">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="#EA4335"
                    d="M12 10.2v3.9h5.45c-.24 1.4-1.66 4.1-5.45 4.1-3.28 0-5.96-2.72-5.96-6.06s2.68-6.06 5.96-6.06c1.87 0 3.12.79 3.84 1.47l2.62-2.52C16.86 3.42 14.66 2.5 12 2.5 6.95 2.5 2.86 6.6 2.86 11.65S6.95 20.8 12 20.8c6.92 0 9.5-4.86 9.5-7.31 0-.49-.05-.86-.12-1.29H12z"
                  />
                </svg>
                Google
              </button>
              <button type="button" className="login-social" aria-label="Entrar com Microsoft">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="3" y="3" width="8.5" height="8.5" fill="#F25022" />
                  <rect x="12.5" y="3" width="8.5" height="8.5" fill="#7FBA00" />
                  <rect x="3" y="12.5" width="8.5" height="8.5" fill="#00A4EF" />
                  <rect x="12.5" y="12.5" width="8.5" height="8.5" fill="#FFB900" />
                </svg>
                Microsoft
              </button>
            </div>

            <p className="login-signup">
              Ainda não tem conta?{' '}
              <button
                type="button"
                className="auth-link auth-link--bold"
                onClick={() => onSignUp?.()}
              >
                Cadastre-se
              </button>
            </p>
          </form>
        </div>

        <p className="auth-foot">
          © {new Date().getFullYear()} Coinly · Moeda Estudantil
        </p>
      </main>
    </div>
  )
}

export default Login
