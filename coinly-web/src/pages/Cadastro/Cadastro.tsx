import { useEffect, useState, type FormEvent } from 'react'
import AuthBrandPanel from '../../components/AuthBrandPanel/AuthBrandPanel'
import '../../components/AuthBrandPanel/AuthLayout.css'
import { HttpError } from '../../lib/api'
import { coinlyApi, type Instituicao } from '../../lib/coinly'
import './Cadastro.css'

type CadastroProps = {
  onBackToLogin?: () => void
}

type Form = {
  nome: string
  email: string
  cpf: string
  rg: string
  endereco: string
  curso: string
  instituicaoId: string
}

type Errors = Partial<Record<keyof Form, string>>

const INITIAL: Form = {
  nome: '',
  email: '',
  cpf: '',
  rg: '',
  endereco: '',
  curso: '',
  instituicaoId: '',
}

function maskCpf(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  return digits
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
}

function isValidCpf(cpf: string): boolean {
  const digits = cpf.replace(/\D/g, '')
  if (digits.length !== 11) return false
  if (/^(\d)\1{10}$/.test(digits)) return false

  const calc = (slice: string, factor: number) => {
    let sum = 0
    for (const ch of slice) {
      sum += parseInt(ch, 10) * factor--
    }
    const rest = (sum * 10) % 11
    return rest === 10 ? 0 : rest
  }

  const d1 = calc(digits.slice(0, 9), 10)
  if (d1 !== parseInt(digits[9], 10)) return false
  const d2 = calc(digits.slice(0, 10), 11)
  return d2 === parseInt(digits[10], 10)
}

function Cadastro({ onBackToLogin }: CadastroProps) {
  const [form, setForm] = useState<Form>(INITIAL)
  const [errors, setErrors] = useState<Errors>({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [serverError, setServerError] = useState<string | null>(null)

  const [instituicoes, setInstituicoes] = useState<Instituicao[]>([])
  const [loadingInstituicoes, setLoadingInstituicoes] = useState(true)
  const [instituicoesError, setInstituicoesError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    coinlyApi
      .listInstituicoes()
      .then((data) => {
        if (!active) return
        setInstituicoes(data.filter((i) => i.ativo))
        setInstituicoesError(null)
      })
      .catch((err: unknown) => {
        if (!active) return
        const message =
          err instanceof HttpError
            ? err.payload.message
            : 'Não foi possível carregar a lista de instituições.'
        setInstituicoesError(message)
      })
      .finally(() => {
        if (active) setLoadingInstituicoes(false)
      })
    return () => {
      active = false
    }
  }, [])

  const update = <K extends keyof Form>(key: K, value: Form[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }))
    if (serverError) setServerError(null)
  }

  const validate = (): Errors => {
    const next: Errors = {}
    if (!form.nome.trim()) next.nome = 'Informe seu nome'
    else if (form.nome.trim().length < 3) next.nome = 'Nome muito curto'

    if (!form.email.trim()) next.email = 'Informe seu e-mail'
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'E-mail inválido'

    if (!form.cpf.trim()) next.cpf = 'Informe seu CPF'
    else if (!isValidCpf(form.cpf)) next.cpf = 'CPF inválido'

    if (!form.rg.trim()) next.rg = 'Informe seu RG'

    if (!form.endereco.trim()) next.endereco = 'Informe seu endereço'

    if (!form.curso.trim()) next.curso = 'Informe seu curso'

    if (!form.instituicaoId) next.instituicaoId = 'Selecione sua instituição'

    return next
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setServerError(null)
    setSuccess(null)

    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setLoading(true)
    try {
      await coinlyApi.createAluno({
        nome: form.nome.trim(),
        email: form.email.trim().toLowerCase(),
        cpf: form.cpf.replace(/\D/g, ''),
        rg: form.rg.trim(),
        endereco: form.endereco.trim(),
        curso: form.curso.trim(),
        instituicaoId: Number(form.instituicaoId),
      })
      setSuccess(form.email.trim().toLowerCase())
    } catch (err) {
      if (err instanceof HttpError) {
        const msg = err.payload.message ?? 'Erro ao realizar cadastro.'
        if (/email/i.test(msg)) setErrors((p) => ({ ...p, email: msg }))
        else if (/cpf/i.test(msg)) setErrors((p) => ({ ...p, cpf: msg }))
        else setServerError(msg)
        if (err.payload.details?.length) {
          const fieldErrors: Errors = {}
          for (const detail of err.payload.details) {
            const [rawField, ...rest] = detail.split(':')
            const field = rawField?.trim() as keyof Form | undefined
            const message = rest.join(':').trim() || detail
            if (field && field in INITIAL) fieldErrors[field] = message
          }
          if (Object.keys(fieldErrors).length) {
            setErrors((p) => ({ ...p, ...fieldErrors }))
          }
        }
      } else {
        setServerError('Não foi possível conectar ao servidor. Tente novamente.')
      }
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="auth-shell">
        <AuthBrandPanel />
        <main className="auth-main">
          <div className="auth-card">
            <div className="cadastro-success">
              <div className="cadastro-success__icon" aria-hidden="true">
                <svg viewBox="0 0 64 64" fill="none">
                  <circle cx="32" cy="32" r="28" fill="url(#cadOk)" />
                  <path
                    d="M20 33l8 8 16-18"
                    stroke="#ffffff"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                  <defs>
                    <linearGradient id="cadOk" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#22c55e" />
                      <stop offset="100%" stopColor="#16a34a" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <h2 className="cadastro-success__title">Cadastro realizado!</h2>
              <p className="cadastro-success__text">
                Enviamos suas credenciais de acesso para
                <br />
                <strong>{success}</strong>
              </p>
              <p className="cadastro-success__hint">
                Verifique sua caixa de entrada (e a pasta de spam). A senha
                provisória chega em instantes — recomendamos trocá-la no
                primeiro acesso.
              </p>
              <button
                type="button"
                className="auth-submit"
                onClick={() => onBackToLogin?.()}
              >
                Ir para o login
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
            </div>
          </div>
          <p className="auth-foot">
            © {new Date().getFullYear()} Coinly · Moeda Estudantil
          </p>
        </main>
      </div>
    )
  }

  return (
    <div className="auth-shell">
      <AuthBrandPanel />

      <main className="auth-main">
        <div className="auth-card auth-card--wide">
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

          <div className="auth-card__header">
            <span className="auth-card__badge">Criar conta</span>
            <h2 className="auth-card__title">Cadastro de aluno</h2>
            <p className="auth-card__subtitle">
              Preencha seus dados para começar a acumular Coinlys. Você
              receberá uma senha provisória no e-mail cadastrado.
            </p>
          </div>

          <form className="auth-form cadastro-form" onSubmit={handleSubmit} noValidate>
            <fieldset className="cadastro-section">
              <legend>Dados pessoais</legend>

              <div className={`auth-field ${errors.nome ? 'is-invalid' : ''}`}>
                <label htmlFor="nome">Nome completo</label>
                <div className="auth-input">
                  <span className="auth-input__icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm0 2c-3.31 0-8 1.66-8 5v1a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-1c0-3.34-4.69-5-8-5z"
                        fill="currentColor"
                      />
                    </svg>
                  </span>
                  <input
                    id="nome"
                    type="text"
                    placeholder="Maria da Silva"
                    autoComplete="name"
                    value={form.nome}
                    onChange={(e) => update('nome', e.target.value)}
                    disabled={loading}
                    maxLength={120}
                  />
                </div>
                {errors.nome && <span className="auth-field__error">{errors.nome}</span>}
              </div>

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
                    type="email"
                    autoComplete="email"
                    placeholder="voce@email.com"
                    value={form.email}
                    onChange={(e) => update('email', e.target.value)}
                    disabled={loading}
                    maxLength={160}
                  />
                </div>
                {errors.email && <span className="auth-field__error">{errors.email}</span>}
              </div>

              <div className="cadastro-grid">
                <div className={`auth-field ${errors.cpf ? 'is-invalid' : ''}`}>
                  <label htmlFor="cpf">CPF</label>
                  <div className="auth-input">
                    <span className="auth-input__icon" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none">
                        <path
                          d="M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2zm5 4a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-3.5 8h7c0-1.93-1.57-3.5-3.5-3.5S5.5 15.07 5.5 17zM14 9h6v2h-6V9zm0 4h6v2h-6v-2z"
                          fill="currentColor"
                        />
                      </svg>
                    </span>
                    <input
                      id="cpf"
                      type="text"
                      inputMode="numeric"
                      placeholder="000.000.000-00"
                      value={form.cpf}
                      onChange={(e) => update('cpf', maskCpf(e.target.value))}
                      disabled={loading}
                      maxLength={14}
                    />
                  </div>
                  {errors.cpf && <span className="auth-field__error">{errors.cpf}</span>}
                </div>

                <div className={`auth-field ${errors.rg ? 'is-invalid' : ''}`}>
                  <label htmlFor="rg">RG</label>
                  <div className="auth-input">
                    <span className="auth-input__icon" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none">
                        <path
                          d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm5 5a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-3 8h6c0-1.66-1.34-3-3-3s-3 1.34-3 3zm8-8h6v2h-6V9zm0 4h4v2h-4v-2z"
                          fill="currentColor"
                        />
                      </svg>
                    </span>
                    <input
                      id="rg"
                      type="text"
                      placeholder="00.000.000-0"
                      value={form.rg}
                      onChange={(e) => update('rg', e.target.value)}
                      disabled={loading}
                      maxLength={20}
                    />
                  </div>
                  {errors.rg && <span className="auth-field__error">{errors.rg}</span>}
                </div>
              </div>

              <div className={`auth-field ${errors.endereco ? 'is-invalid' : ''}`}>
                <label htmlFor="endereco">Endereço</label>
                <div className="auth-input">
                  <span className="auth-input__icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 2a8 8 0 0 0-8 8c0 5.5 8 12 8 12s8-6.5 8-12a8 8 0 0 0-8-8zm0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"
                        fill="currentColor"
                      />
                    </svg>
                  </span>
                  <input
                    id="endereco"
                    type="text"
                    placeholder="Rua, número, bairro, cidade — UF"
                    autoComplete="street-address"
                    value={form.endereco}
                    onChange={(e) => update('endereco', e.target.value)}
                    disabled={loading}
                    maxLength={255}
                  />
                </div>
                {errors.endereco && (
                  <span className="auth-field__error">{errors.endereco}</span>
                )}
              </div>
            </fieldset>

            <fieldset className="cadastro-section">
              <legend>Acadêmico</legend>

              <div className={`auth-field ${errors.instituicaoId ? 'is-invalid' : ''}`}>
                <label htmlFor="instituicaoId">Instituição</label>
                <div className="auth-input">
                  <span className="auth-input__icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 3 1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4l7 3.82 7-3.82v-4l-7 3.82-7-3.82z"
                        fill="currentColor"
                      />
                    </svg>
                  </span>
                  <select
                    id="instituicaoId"
                    className="cadastro-select"
                    value={form.instituicaoId}
                    onChange={(e) => update('instituicaoId', e.target.value)}
                    disabled={loading || loadingInstituicoes || !!instituicoesError}
                  >
                    <option value="">
                      {loadingInstituicoes
                        ? 'Carregando instituições...'
                        : instituicoesError
                          ? 'Não foi possível carregar'
                          : 'Selecione sua instituição'}
                    </option>
                    {instituicoes.map((i) => (
                      <option key={i.id} value={i.id}>
                        {i.nome}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.instituicaoId && (
                  <span className="auth-field__error">{errors.instituicaoId}</span>
                )}
                {instituicoesError && (
                  <span className="auth-field__error">{instituicoesError}</span>
                )}
              </div>

              <div className={`auth-field ${errors.curso ? 'is-invalid' : ''}`}>
                <label htmlFor="curso">Curso</label>
                <div className="auth-input">
                  <span className="auth-input__icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none">
                      <path
                        d="M21 5l-9-4-9 4v2l9 4 7.27-3.23L21 9.23V13h2V5h-2zM5 13.18v4L12 21l7-3.82v-4l-7 3.82-7-3.82z"
                        fill="currentColor"
                      />
                    </svg>
                  </span>
                  <input
                    id="curso"
                    type="text"
                    placeholder="Engenharia de Software"
                    value={form.curso}
                    onChange={(e) => update('curso', e.target.value)}
                    disabled={loading}
                    maxLength={120}
                  />
                </div>
                {errors.curso && <span className="auth-field__error">{errors.curso}</span>}
              </div>
            </fieldset>

            <div className="cadastro-info">
              <span className="cadastro-info__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
                    fill="currentColor"
                  />
                </svg>
              </span>
              <p>
                Após o cadastro, enviaremos uma <strong>senha provisória</strong> para
                o e-mail informado. Use-a no primeiro acesso e troque assim que entrar.
              </p>
            </div>

            {serverError && (
              <div className="cadastro-error" role="alert">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
                    fill="currentColor"
                  />
                </svg>
                {serverError}
              </div>
            )}

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? (
                <>
                  <span className="auth-submit__spinner" aria-hidden="true" />
                  Criando conta...
                </>
              ) : (
                <>
                  Criar minha conta
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

            <p className="cadastro-login">
              Já tem conta?{' '}
              <button
                type="button"
                className="auth-link auth-link--bold"
                onClick={() => onBackToLogin?.()}
              >
                Fazer login
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

export default Cadastro
