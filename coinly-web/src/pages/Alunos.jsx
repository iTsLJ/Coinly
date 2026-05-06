import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Search } from 'lucide-react'
import Modal from '../components/Modal'
import { listarAlunos, criarAluno, atualizarAluno, removerAluno } from '../api/alunos'
import { listarInstituicoes } from '../api/instituicoes'

const EMPTY = { nome: '', email: '', cpf: '', rg: '', endereco: '', curso: '', instituicaoId: '' }

export default function Alunos() {
  const [alunos, setAlunos] = useState([])
  const [instituicoes, setInstituicoes] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(null) // null | 'create' | 'edit'
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function load() {
    setLoading(true)
    try {
      const [a, i] = await Promise.all([listarAlunos(), listarInstituicoes()])
      setAlunos(a)
      setInstituicoes(i)
    } catch {
      setError('Erro ao carregar dados.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  function openCreate() {
    setForm(EMPTY)
    setError('')
    setModal('create')
  }

  function openEdit(aluno) {
    setSelected(aluno)
    setForm({
      nome: aluno.nome,
      email: aluno.email,
      cpf: aluno.cpf,
      rg: aluno.rg,
      endereco: aluno.endereco,
      curso: aluno.curso,
      instituicaoId: String(aluno.instituicaoId),
    })
    setError('')
    setModal('edit')
  }

  function closeModal() {
    setModal(null)
    setSelected(null)
    setError('')
  }

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const payload = { ...form, instituicaoId: Number(form.instituicaoId) }
      if (modal === 'create') {
        await criarAluno(payload)
      } else {
        await atualizarAluno(selected.id, payload)
      }
      closeModal()
      load()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(aluno) {
    if (!confirm(`Remover o aluno "${aluno.nome}"?`)) return
    try {
      await removerAluno(aluno.id)
      load()
    } catch {
      alert('Erro ao remover aluno.')
    }
  }

  const filtered = alunos.filter(a =>
    a.nome.toLowerCase().includes(search.toLowerCase()) ||
    a.email.toLowerCase().includes(search.toLowerCase()) ||
    a.curso.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1E1B2E]">Alunos</h1>
          <p className="text-gray-400 text-sm mt-1">{alunos.length} aluno(s) cadastrado(s)</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-[#6C4DFF] hover:bg-[#5a3de8] text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors"
        >
          <Plus size={18} />
          Novo aluno
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2.5 mb-5 w-full max-w-sm shadow-sm">
        <Search size={16} className="text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar por nome, e-mail ou curso..."
          className="flex-1 text-sm outline-none bg-transparent text-[#1E1B2E] placeholder-gray-400"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <p className="text-gray-400 text-sm p-6">Carregando...</p>
        ) : filtered.length === 0 ? (
          <p className="text-gray-400 text-sm p-6">Nenhum aluno encontrado.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['Nome', 'E-mail', 'CPF', 'Curso', 'Instituição', 'Saldo', ''].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((a, i) => (
                  <tr key={a.id} className={`border-b border-gray-50 ${i % 2 === 1 ? 'bg-gray-50/50' : ''}`}>
                    <td className="px-5 py-3.5 font-medium text-[#1E1B2E]">{a.nome}</td>
                    <td className="px-5 py-3.5 text-gray-500">{a.email}</td>
                    <td className="px-5 py-3.5 text-gray-500 font-mono">{a.cpf}</td>
                    <td className="px-5 py-3.5 text-gray-500">{a.curso}</td>
                    <td className="px-5 py-3.5 text-gray-500">{a.instituicaoNome}</td>
                    <td className="px-5 py-3.5">
                      <span className="text-[#FFC633] font-bold">★ {a.saldoMoedas}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2 justify-end">
                        <button onClick={() => openEdit(a)} className="p-1.5 text-gray-400 hover:text-[#6C4DFF] transition-colors rounded-lg hover:bg-[#6C4DFF]/10">
                          <Pencil size={15} />
                        </button>
                        <button onClick={() => handleDelete(a)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <Modal title={modal === 'create' ? 'Novo Aluno' : 'Editar Aluno'} onClose={closeModal}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {[
              { name: 'nome', label: 'Nome completo', type: 'text', placeholder: 'Ex: Ana Clara' },
              { name: 'email', label: 'E-mail', type: 'email', placeholder: 'ana@email.com' },
              { name: 'cpf', label: 'CPF', type: 'text', placeholder: '000.000.000-00' },
              { name: 'rg', label: 'RG', type: 'text', placeholder: '00.000.000-0' },
              { name: 'endereco', label: 'Endereço', type: 'text', placeholder: 'Rua, número, bairro...' },
              { name: 'curso', label: 'Curso', type: 'text', placeholder: 'Ex: Análise e Desenvolvimento de Sistemas' },
            ].map(({ name, label, type, placeholder }) => (
              <div key={name}>
                <label className="block text-sm font-medium text-[#1E1B2E] mb-1.5">{label}</label>
                <input
                  type={type}
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#6C4DFF] focus:ring-2 focus:ring-[#6C4DFF]/20 transition"
                />
              </div>
            ))}

            <div>
              <label className="block text-sm font-medium text-[#1E1B2E] mb-1.5">Instituição</label>
              <select
                name="instituicaoId"
                value={form.instituicaoId}
                onChange={handleChange}
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#6C4DFF] focus:ring-2 focus:ring-[#6C4DFF]/20 transition bg-white"
              >
                <option value="">Selecione uma instituição</option>
                {instituicoes.map(i => (
                  <option key={i.id} value={i.id}>{i.nome}</option>
                ))}
              </select>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="flex gap-3 pt-1">
              <button type="button" onClick={closeModal} className="flex-1 border border-gray-200 text-gray-600 font-semibold py-2.5 rounded-xl text-sm hover:bg-gray-50 transition-colors">
                Cancelar
              </button>
              <button type="submit" disabled={saving} className="flex-1 bg-[#6C4DFF] hover:bg-[#5a3de8] text-white font-semibold py-2.5 rounded-xl text-sm transition-colors disabled:opacity-60">
                {saving ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
