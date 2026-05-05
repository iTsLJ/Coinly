import { useEffect, useMemo, useState } from 'react'
import { Alert } from '../../components/Alert'
import { Modal } from '../../components/Modal'
import { StatusBadge } from '../../components/StatusBadge'
import { empresaService } from '../../services/empresaService'
import { HttpError } from '../../services/http'
import type {
  EmpresaCreateRequest,
  EmpresaParceira,
  EmpresaUpdateRequest,
  StatusEmpresa,
} from '../../types/api'
import { formatCnpj } from '../../utils/format'
import { EmpresaForm } from './EmpresaForm'

type StatusFilter = '' | StatusEmpresa

export function EmpresasPage() {
  const [empresas, setEmpresas] = useState<EmpresaParceira[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<EmpresaParceira | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const data = await empresaService.listar(
        statusFilter === '' ? undefined : statusFilter,
      )
      setEmpresas(data)
    } catch (e) {
      setError(extractError(e))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return empresas
    return empresas.filter(
      (e) =>
        e.nomeFantasia.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q) ||
        e.cnpj.includes(q),
    )
  }, [empresas, search])

  function openCreate() {
    setEditing(null)
    setModalOpen(true)
  }

  function openEdit(empresa: EmpresaParceira) {
    setEditing(empresa)
    setModalOpen(true)
  }

  function closeModal() {
    if (submitting) return
    setModalOpen(false)
    setEditing(null)
  }

  async function handleSubmit(
    data: EmpresaCreateRequest | EmpresaUpdateRequest,
  ) {
    setSubmitting(true)
    setError(null)
    try {
      if (editing) {
        await empresaService.atualizar(
          editing.id,
          data as EmpresaUpdateRequest,
        )
        setSuccess('Empresa atualizada com sucesso.')
      } else {
        await empresaService.criar(data as EmpresaCreateRequest)
        setSuccess(
          'Empresa cadastrada com sucesso. O cadastro está pendente de aprovação.',
        )
      }
      setModalOpen(false)
      setEditing(null)
      await load()
    } catch (e) {
      setError(extractError(e))
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(empresa: EmpresaParceira) {
    const ok = window.confirm(
      `Tem certeza que deseja remover a empresa "${empresa.nomeFantasia}"?`,
    )
    if (!ok) return
    setError(null)
    try {
      await empresaService.remover(empresa.id)
      setSuccess('Empresa removida com sucesso.')
      await load()
    } catch (e) {
      setError(extractError(e))
    }
  }

  async function handleAprovar(empresa: EmpresaParceira) {
    setError(null)
    try {
      await empresaService.aprovar(empresa.id)
      setSuccess(`Empresa "${empresa.nomeFantasia}" aprovada.`)
      await load()
    } catch (e) {
      setError(extractError(e))
    }
  }

  async function handleRejeitar(empresa: EmpresaParceira) {
    const ok = window.confirm(
      `Tem certeza que deseja rejeitar a empresa "${empresa.nomeFantasia}"?`,
    )
    if (!ok) return
    setError(null)
    try {
      await empresaService.rejeitar(empresa.id)
      setSuccess(`Empresa "${empresa.nomeFantasia}" rejeitada.`)
      await load()
    } catch (e) {
      setError(extractError(e))
    }
  }

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Empresas Parceiras</h1>
          <p className="page-subtitle">
            {empresas.length}{' '}
            {empresas.length === 1
              ? 'empresa cadastrada'
              : 'empresas cadastradas'}
            {statusFilter && ` (filtro: ${statusFilter.toLowerCase()})`}
          </p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          + Nova empresa
        </button>
      </div>

      {error && (
        <Alert
          type="error"
          message={error}
          onClose={() => setError(null)}
        />
      )}
      {success && (
        <Alert
          type="success"
          message={success}
          onClose={() => setSuccess(null)}
        />
      )}

      <div className="card">
        <div className="toolbar">
          <input
            type="search"
            className="form-input search"
            placeholder="Buscar por nome, e-mail ou CNPJ…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as StatusFilter)
            }
          >
            <option value="">Todos os status</option>
            <option value="PENDENTE">Pendente</option>
            <option value="APROVADA">Aprovada</option>
            <option value="REJEITADA">Rejeitada</option>
          </select>
        </div>

        {loading ? (
          <div className="loading-state">Carregando empresas…</div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🏢</div>
            <p>
              {empresas.length === 0
                ? 'Nenhuma empresa cadastrada ainda.'
                : 'Nenhuma empresa encontrada para os filtros aplicados.'}
            </p>
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Nome Fantasia</th>
                <th>CNPJ</th>
                <th>E-mail</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((empresa) => (
                <tr key={empresa.id}>
                  <td>{empresa.nomeFantasia}</td>
                  <td>{formatCnpj(empresa.cnpj)}</td>
                  <td>{empresa.email}</td>
                  <td>
                    <StatusBadge status={empresa.status} />
                  </td>
                  <td>
                    <div className="table-actions">
                      {empresa.status === 'PENDENTE' && (
                        <>
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => handleAprovar(empresa)}
                            title="Aprovar parceria"
                          >
                            Aprovar
                          </button>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => handleRejeitar(empresa)}
                            title="Rejeitar parceria"
                          >
                            Rejeitar
                          </button>
                        </>
                      )}
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => openEdit(empresa)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(empresa)}
                      >
                        Remover
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal
        open={modalOpen}
        title={editing ? 'Editar empresa' : 'Cadastrar empresa'}
        onClose={closeModal}
      >
        <EmpresaForm
          empresa={editing}
          onSubmit={handleSubmit}
          onCancel={closeModal}
          submitting={submitting}
        />
      </Modal>
    </>
  )
}

function extractError(e: unknown): string {
  if (e instanceof HttpError) {
    if (e.details.length > 0) {
      return `${e.message} — ${e.details.join('; ')}`
    }
    return e.message
  }
  if (e instanceof Error) return e.message
  return 'Erro inesperado.'
}
