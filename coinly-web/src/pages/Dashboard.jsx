import { useEffect, useState } from 'react'
import { Users, Building2, CheckCircle, Clock } from 'lucide-react'
import { listarAlunos } from '../api/alunos'
import { listarEmpresas } from '../api/empresas'

export default function Dashboard() {
  const [alunos, setAlunos] = useState([])
  const [empresas, setEmpresas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([listarAlunos(), listarEmpresas()])
      .then(([a, e]) => { setAlunos(a); setEmpresas(e) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const aprovadas = empresas.filter(e => e.status === 'APROVADA').length
  const pendentes = empresas.filter(e => e.status === 'PENDENTE').length

  const stats = [
    { label: 'Total de Alunos', value: alunos.length, icon: Users, color: '#6C4DFF', bg: '#6C4DFF15' },
    { label: 'Empresas Parceiras', value: empresas.length, icon: Building2, color: '#A78BFA', bg: '#A78BFA15' },
    { label: 'Empresas Aprovadas', value: aprovadas, icon: CheckCircle, color: '#22C55E', bg: '#22C55E15' },
    { label: 'Aguardando Aprovação', value: pendentes, icon: Clock, color: '#FFC633', bg: '#FFC63315' },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1E1B2E]">Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">Visão geral do sistema Coinly</p>
      </div>

      {loading ? (
        <p className="text-gray-400 text-sm">Carregando...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {stats.map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: bg }}>
                <Icon size={22} style={{ color }} />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#1E1B2E]">{value}</p>
                <p className="text-gray-400 text-xs mt-0.5">{label}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
