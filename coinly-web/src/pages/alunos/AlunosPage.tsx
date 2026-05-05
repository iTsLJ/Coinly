import { useEffect, useMemo, useState } from 'react'
import { Alert } from '../../components/Alert'
import { Modal } from '../../components/Modal'
import { alunoService } from '../../services/alunoService'
import { instituicaoService } from '../../services/instituicaoService'
import { HttpError } from '../../services/http'
import type {
  Aluno,
  AlunoCreateRequest,
  AlunoUpdateRequest,
  Instituicao,
} from '../../types/api'
import { formatCpf } from '../../utils/format'
import { AlunoForm } from './AlunoForm'

export function AlunosPage() {
  const [alunos, setAlunos] = useState<Aluno[]>([])
  const [instituicoes, setInstituicoes] = useState<Instituicao[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Aluno | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function loadAll() {
    setLoading(true)
    setError(null)
    try {
      const [a, i] = await Promise.all([
        alunoService.listar(),
        instituicaoService.listar(),
      ])
      setAlunos(a)
      setInstituicoes(i)
    } catch (e) {
      setError(extractError(e))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAll()
  }, [])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return alunos
    return alunos.filter(
      (a) =>
        a.nome.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q) ||
        a.cpf.includes(q) ||
        a.curso.toLowerCase().includes(q),
    )
  }, [alunos, search])

  function openCreate() {
    setEditing(null)
    setModalOpen(true)
  }

  function openEdit(aluno: Aluno) {
    setEditing(aluno)
    setModalOpen(true)
  }

  function closeModal() {
    if (submitting) return
    setModalOpen(false)
    setEditing(null)
  }

  async function handleSubmit(
    data: AlunoCreateRequest | AlunoUpdateRequest,
  ) {
    setSubmitting(true)
    setError(null)
    try {
      if (editing) {
        await alunoService.atualizar(editing.id, data as AlunoUpdateRequest)
        setSuccess('Aluno atualizado com sucesso.')
      } else {
        await alunoService.criar(data as AlunoCreateRequest)
        setSuccess('Aluno cadastrado com sucesso.')
      }
      setModalOpen(false)
      setEditing(null)
      await loadAll()
    } catch (e) {
      setError(extractError(e))
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(aluno: Aluno) {
    const ok = window.confirm(
      `Tem certeza que deseja remover o aluno "${aluno.nome}"?`,
    )
    if (!ok) return
    setError(null)
    try {
      await alunoService.remover(aluno.id)
      setSuccess('Aluno removido com sucesso.')
      await loadAll()
    } catch (e) {
      setError(extractError(e))
    }
  }

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Alunos</h1>
          <p className="page-subtitle">
            {alunos.length}{' '}
            {alunos.length === 1 ? 'aluno cadastrado' : 'alunos cadastrados'}
          </p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          + Novo aluno
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
            placeholder="Buscar por nome, e-mail, CPF ou curso…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="loading-state">Carregando alunos…</div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🎓</div>
            <p>
              {alunos.length === 0
                ? 'Nenhum aluno cadastrado ainda.'
                : 'Nenhum aluno encontrado para a busca.'}
            </p>
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>E-mail</th>
                <th>CPF</th>
                <th>Curso</th>
                <th>Instituição</th>
                <th>Saldo</th>
                <th style={{ textAlign: 'right' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((aluno) => (
                <tr key={aluno.id}>
                  <td>{aluno.nome}</td>
                  <td>{aluno.email}</td>
                  <td>{formatCpf(aluno.cpf)}</td>
                  <td>{aluno.curso}</td>
                  <td>{aluno.instituicaoNome}</td>
                  <td>
                    <span className="coin-chip">
                      🪙 {aluno.saldoMoedas}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => openEdit(aluno)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(aluno)}
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
        title={editing ? 'Editar aluno' : 'Cadastrar aluno'}
        onClose={closeModal}
      >
        <AlunoForm
          aluno={editing}
          instituicoes={instituicoes}
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
