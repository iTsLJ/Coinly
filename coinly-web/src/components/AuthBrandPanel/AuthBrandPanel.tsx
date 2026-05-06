import './AuthBrandPanel.css'

function AuthBrandPanel() {
  return (
    <aside className="brand-panel">
      <div className="brand-panel__inner">
        <div className="brand-panel__logo">
          <svg
            viewBox="0 0 120 120"
            role="img"
            aria-label="Coinly"
            className="brand-panel__logo-svg"
          >
            <defs>
              <linearGradient id="coinlyC" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#8a6dff" />
                <stop offset="100%" stopColor="#5a3ee6" />
              </linearGradient>
            </defs>
            <path
              d="M60 12a48 48 0 1 0 0 96 48 48 0 0 0 34-14l-14-14a28 28 0 1 1 0-40l14-14A48 48 0 0 0 60 12z"
              fill="url(#coinlyC)"
            />
            <circle cx="60" cy="60" r="20" fill="#ffc633" />
            <path
              d="M60 47l3.7 7.5 8.3 1.2-6 5.8 1.4 8.3L60 65.9 52.6 69.8l1.4-8.3-6-5.8 8.3-1.2L60 47z"
              fill="#ffffff"
            />
          </svg>
          <span className="brand-panel__wordmark">
            Coin<span className="brand-panel__wordmark-accent">ly</span>
          </span>
        </div>

        <div className="brand-panel__copy">
          <h1 className="brand-panel__title">
            Recompensando <span>seu esforço.</span>
          </h1>
          <p className="brand-panel__subtitle">
            Reconheça conquistas, acumule moedas e troque por benefícios
            exclusivos. Aprender, evoluir e ser recompensado nunca foi tão
            fácil.
          </p>
        </div>

        <ul className="brand-panel__features">
          <li>
            <span className="brand-panel__feature-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2l2.39 4.84 5.34.78-3.86 3.77.91 5.32L12 14.27 7.22 16.7l.91-5.32L4.27 7.62l5.34-.78L12 2z"
                  fill="currentColor"
                />
              </svg>
            </span>
            <div>
              <strong>Reconhecimento</strong>
              <span>Mérito traduzido em moedas digitais.</span>
            </div>
          </li>
          <li>
            <span className="brand-panel__feature-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M20 8h-3V6a3 3 0 0 0-6 0v2H8a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2zm-7-2a1 1 0 0 1 2 0v2h-2V6z"
                  fill="currentColor"
                />
              </svg>
            </span>
            <div>
              <strong>Benefícios</strong>
              <span>Troque suas Coinlys por recompensas reais.</span>
            </div>
          </li>
          <li>
            <span className="brand-panel__feature-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M3 17l6-6 4 4 8-8 0 6h-2V9.83l-6 6-4-4L4.41 18.41 3 17z"
                  fill="currentColor"
                />
              </svg>
            </span>
            <div>
              <strong>Evolução</strong>
              <span>Acompanhe seu progresso e suas conquistas.</span>
            </div>
          </li>
        </ul>

        <p className="brand-panel__footer">
          Mais que uma moeda. Um incentivo para <span>ir além.</span>
        </p>
      </div>

      <div className="brand-panel__shape brand-panel__shape--1" aria-hidden="true" />
      <div className="brand-panel__shape brand-panel__shape--2" aria-hidden="true" />
    </aside>
  )
}

export default AuthBrandPanel
