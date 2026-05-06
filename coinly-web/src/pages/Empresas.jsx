import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Check, X as XIcon, Search } from 'lucide-react'
import Modal from '../components/Modal'
import {
  listarEmpresas, criarEmpresa, atualizarEmpresa,
  aprovarEmpresa, rejeitarEmpresa, removerEmpresa,
} from '../api/empresas'

const EMPTY = { nomeFantasia: '', cnpj: '', email: '' }

const STATUS_BADGE = {
  PENDENTE: 'bg-yellow-100 text-yellow-700',
  APROVADA: 'bg-green-100 text-green-700',
  REJEITADA: 'bg-red-100 text-red-600',
}

export default function Empresas() {
  const [empresas, setEmpresas] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(null)
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function load() {
    setLoading(true)
    try {
      setEmpresas(await listarEmpresas())
    } catch {
      setError('Erro ao carregar empresas.')
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

  function openEdit(empresa) {
    setSelected(empresa)
    setForm({ nomeFantasia: empresa.nomeFantasia, cnpj: empresa.cnpj, email: empresa.email })
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
      if (modal === 'create') await criarEmpresa(form)
      else await atualizarEmpresa(selected.id, form)
      closeModal()
      load()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleAprovar(empresa) {
    try { await aprovarEmpresa(empresa.id); load() }
    catch { alert('Erro ao aprovar empresa.') }
  }

  async function handleRejeitar(empresa) {
    try { await rejeitarEmpresa(empresa.id); load() }
    catch { alert('Erro ao rejeitar empresa.') }
  }

  async function handleDelete(empresa) {
    if (!confirm(`Remover a empresa "${empresa.nomeFantasia}"?`)) return
    try { await removerEmpresa(empresa.id); load() }
    catch { alert('Erro ao remover empresa.') }
  }

  const filtered = empresas.filter(e =>
    e.nomeFantasia.toLowerCase().includes(search.toLowerCase()) ||
    e.email.toLowerCase().includes(search.toLowerCase()) ||
    e.cnpj.includes(search)
  )

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1E1B2E]">Empresas Parceiras</h1>
          <p className="text-gray-400 text-sm mt-1">{empresas.length} empresa(s) cadastrada(s)</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-[#6C4DFF] hover:bg-[#5a3de8] text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors"
        >
          <Plus size={18} />
          Nova empresa
        </button>
      </div>

      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2.5 mb-5 w-full max-w-sm shadow-sm">
        <Search size={16} className="text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar por nome, e-mail ou CNPJ..."
          className="flex-1 text-sm outline-none bg-transparent text-[#1E1B2E] placeholder-gray-400"
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <p className="text-gray-400 text-sm p-6">Carregando...</p>
        ) : filtered.length === 0 ? (
          <p className="text-gray-400 text-sm p-6">Nenhuma empresa encontrada.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['Nome Fantasia', 'CNPJ', 'E-mail', 'Status', ''].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((e, i) => (
                  <tr key={e.id} className={`border-b border-gray-50 ${i % 2 === 1 ? 'bg-gray-50/50' : ''}`}>
                    <td className="px-5 py-3.5 font-medium text-[#1E1B2E]">{e.nomeFantasia}</td>
                    <td className="px-5 py-3.5 text-gray-500 font-mono">{e.cnpj}</td>
                    <td className="px-5 py-3.5 text-gray-500">{e.email}</td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_BADGE[e.status] ?? 'bg-gray-100 text-gray-500'}`}>
                        {e.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1 justify-end">
                        {e.status === 'PENDENTE' && (
                          <>
                            <button onClick={() => handleAprovar(e)} title="Aprovar" className="p-1.5 text-gray-400 hover:text-green-600 transition-colors rounded-lg hover:bg-green-50">
                              <Check size={15} />
                            </button>
                            <button onClick={() => handleRejeitar(e)} title="Rejeitar" className="p-1.5 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50">
                              <XIcon size={15} />
                            </button>
                          </>
                        )}
                        <button onClick={() => openEdit(e)} className="p-1.5 text-gray-400 hover:text-[#6C4DFF] transition-colors rounded-lg hover:bg-[#6C4DFF]/10">
                          <Pencil size={15} />
                        </button>
                        <button onClick={() => handleDelete(e)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50">
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

      {modal && (
        <Modal title={modal === 'create' ? 'Nova Empresa Parceira' : 'Editar Empresa'} onClose={closeModal}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {[
              { name: 'nomeFantasia', label: 'Nome Fantasia', type: 'text', placeholder: 'Ex: Livraria Cultura' },
              { name: 'cnpj', label: 'CNPJ', type: 'text', placeholder: '00.000.000/0000-00' },
              { name: 'email', label: 'E-mail', type: 'email', placeholder: 'contato@empresa.com' },
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
