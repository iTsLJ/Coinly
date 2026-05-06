import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', senha: '' })
  const [error, setError] = useState('')

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.email || !form.senha) {
      setError('Preencha todos os campos.')
      return
    }
    localStorage.setItem('coinly_user', JSON.stringify({ email: form.email }))
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex w-1/2 bg-[#1E1B2E] flex-col items-center justify-center p-12">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-16 h-16 rounded-2xl bg-[#6C4DFF] flex items-center justify-center shadow-lg">
            <span className="text-[#FFC633] text-4xl font-black">C</span>
          </div>
          <div>
            <p className="text-white font-bold text-3xl leading-none">Coinly</p>
            <p className="text-[#A78BFA] text-sm">Moeda Estudantil</p>
          </div>
        </div>
        <h2 className="text-white text-2xl font-bold text-center leading-snug max-w-xs">
          Reconhecendo hoje,{' '}
          <span className="text-[#A78BFA]">recompensando seu amanhã.</span>
        </h2>
        <p className="text-white/40 text-sm text-center mt-4 max-w-xs">
          Plataforma de gestão de moedas estudantis para instituições de ensino.
        </p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-[#f5f5f7]">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl bg-[#6C4DFF] flex items-center justify-center">
              <span className="text-[#FFC633] text-xl font-black">C</span>
            </div>
            <p className="text-[#1E1B2E] font-bold text-xl">Coinly</p>
          </div>

          <h1 className="text-[#1E1B2E] text-2xl font-bold mb-1">Entrar</h1>
          <p className="text-gray-400 text-sm mb-8">Acesse o painel de gerenciamento.</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-[#1E1B2E] mb-1.5">E-mail</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="seu@email.com"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#6C4DFF] focus:ring-2 focus:ring-[#6C4DFF]/20 bg-white transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1E1B2E] mb-1.5">Senha</label>
              <input
                type="password"
                name="senha"
                value={form.senha}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#6C4DFF] focus:ring-2 focus:ring-[#6C4DFF]/20 bg-white transition"
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              className="w-full bg-[#6C4DFF] hover:bg-[#5a3de8] text-white font-bold py-3 rounded-xl transition-colors mt-2"
            >
              Entrar
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
