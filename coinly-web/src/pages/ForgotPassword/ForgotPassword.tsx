import { useState, type FormEvent } from 'react'
import AuthBrandPanel from '../../components/AuthBrandPanel/AuthBrandPanel'
import '../../components/AuthBrandPanel/AuthLayout.css'
import './ForgotPassword.css'

type ForgotPasswordProps = {
  onBackToLogin?: () => void
}

type Status = 'idle' | 'sent'

function ForgotPassword({ onBackToLogin }: ForgotPasswordProps) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | undefined>()
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<Status>('idle')
  const [resendCooldown, setResendCooldown] = useState(0)

  const validate = (value: string): string | undefined => {
    if (!value.trim()) return 'Informe seu e-mail'
    if (!/^\S+@\S+\.\S+$/.test(value)) return 'E-mail inválido'
    return undefined
  }

  const startCooldown = () => {
    setResendCooldown(30)
    const tick = () => {
      setResendCooldown((s) => {
        if (s <= 1) return 0
        setTimeout(tick, 1000)
        return s - 1
      })
    }
    setTimeout(tick, 1000)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const validation = validate(email)
    setError(validation)
    if (validation) return

    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 900))
    setLoading(false)
    setStatus('sent')
    startCooldown()
  }

  const handleResend = async () => {
    if (resendCooldown > 0 || loading) return
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 700))
    setLoading(false)
    startCooldown()
  }

  return (
    <div className="auth-shell">
      <AuthBrandPanel />

      <main className="auth-main">
        <div className="auth-card">
          <button
            type="button"
            className="forgot-back"
            onClick={() => onBackToLogin?.()}
            aria-label="Voltar ao login"
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M15 6l-6 6 6 6"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Voltar ao login
          </button>

          {status === 'idle' ? (
            <>
              <div className="auth-card__header">
                <span className="auth-card__badge">Recuperar acesso</span>
                <h2 className="auth-card__title">Esqueceu sua senha?</h2>
                <p className="auth-card__subtitle">
                  Sem problemas. Informe o e-mail da sua conta Coinly e
                  enviaremos um link seguro para você criar uma nova senha.
                </p>
              </div>

              <form className="auth-form" onSubmit={handleSubmit} noValidate>
                <div className={`auth-field ${error ? 'is-invalid' : ''}`}>
                  <label htmlFor="forgot-email">E-mail cadastrado</label>
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
                      id="forgot-email"
                      type="email"
                      autoComplete="email"
                      placeholder="voce@email.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        if (error) setError(undefined)
                      }}
                      disabled={loading}
                      autoFocus
                    />
                  </div>
                  {error && <span className="auth-field__error">{error}</span>}
                </div>

                <button
                  type="submit"
                  className="auth-submit"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="auth-submit__spinner" aria-hidden="true" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      Enviar link de recuperação
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

                <div className="forgot-tips">
                  <span className="forgot-tips__icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
                        fill="currentColor"
                      />
                    </svg>
                  </span>
                  <p>
                    Por segurança, o link expira em <strong>15 minutos</strong>.
                    Verifique também a pasta de spam caso não encontre o e-mail.
                  </p>
                </div>

                <p className="forgot-help">
                  Lembrou sua senha?{' '}
                  <button
                    type="button"
                    className="auth-link auth-link--bold"
                    onClick={() => onBackToLogin?.()}
                  >
                    Fazer login
                  </button>
                </p>
              </form>
            </>
          ) : (
            <div className="forgot-sent">
              <div className="forgot-sent__icon" aria-hidden="true">
                <svg viewBox="0 0 64 64" fill="none">
                  <rect
                    x="8"
                    y="14"
                    width="48"
                    height="36"
                    rx="6"
                    fill="url(#envBody)"
                  />
                  <path
                    d="M8 18l24 16 24-16"
                    stroke="#ffffff"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                  <circle cx="50" cy="18" r="9" fill="#22c55e" />
                  <path
                    d="M46 18.5l3 3 5-6"
                    stroke="#ffffff"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                  <defs>
                    <linearGradient id="envBody" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#8a6dff" />
                      <stop offset="100%" stopColor="#5a3ee6" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              <h2 className="forgot-sent__title">E-mail enviado!</h2>
              <p className="forgot-sent__text">
                Enviamos um link de recuperação para
                <br />
                <strong>{email}</strong>
              </p>

              <p className="forgot-sent__hint">
                Abra seu e-mail e clique no link para criar uma nova senha. Não
                esqueça de checar a pasta de spam.
              </p>

              <div className="forgot-sent__actions">
                <button
                  type="button"
                  className="auth-submit"
                  onClick={() => onBackToLogin?.()}
                >
                  Voltar ao login
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M5 12h14M13 6l6 6-6 6"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                <button
                  type="button"
                  className="forgot-resend"
                  onClick={handleResend}
                  disabled={resendCooldown > 0 || loading}
                >
                  {loading
                    ? 'Reenviando...'
                    : resendCooldown > 0
                      ? `Reenviar em ${resendCooldown}s`
                      : 'Não recebi — reenviar e-mail'}
                </button>
              </div>
            </div>
          )}
        </div>

        <p className="auth-foot">
          © {new Date().getFullYear()} Coinly · Moeda Estudantil
        </p>
      </main>
    </div>
  )
}

export default ForgotPassword
