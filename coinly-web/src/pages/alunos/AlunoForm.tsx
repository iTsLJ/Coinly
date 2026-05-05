import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import type {
  Aluno,
  AlunoCreateRequest,
  AlunoUpdateRequest,
  Instituicao,
} from '../../types/api'
import {
  isValidCpf,
  isValidEmail,
  maskCpf,
  onlyDigits,
} from '../../utils/format'

interface AlunoFormProps {
  aluno: Aluno | null
  instituicoes: Instituicao[]
  onSubmit: (data: AlunoCreateRequest | AlunoUpdateRequest) => Promise<void>
  onCancel: () => void
  submitting: boolean
}

interface FormState {
  nome: string
  email: string
  cpf: string
  rg: string
  endereco: string
  curso: string
  instituicaoId: string
}

const empty: FormState = {
  nome: '',
  email: '',
  cpf: '',
  rg: '',
  endereco: '',
  curso: '',
  instituicaoId: '',
}

export function AlunoForm({
  aluno,
  instituicoes,
  onSubmit,
  onCancel,
  submitting,
}: AlunoFormProps) {
  const isEdit = aluno !== null
  const [form, setForm] = useState<FormState>(empty)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (aluno) {
      setForm({
        nome: aluno.nome,
        email: aluno.email,
        cpf: aluno.cpf,
        rg: aluno.rg,
        endereco: aluno.endereco,
        curso: aluno.curso,
        instituicaoId: String(aluno.instituicaoId),
      })
    } else {
      setForm(empty)
    }
    setErrors({})
  }, [aluno])

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[key]
        return next
      })
    }
  }

  function validate(): boolean {
    const next: Record<string, string> = {}
    if (!form.nome.trim()) next.nome = 'Informe o nome'
    if (!form.email.trim()) next.email = 'Informe o e-mail'
    else if (!isValidEmail(form.email)) next.email = 'E-mail inválido'
    if (!isEdit) {
      if (!form.cpf.trim()) next.cpf = 'Informe o CPF'
      else if (!isValidCpf(form.cpf)) next.cpf = 'CPF inválido'
    }
    if (!form.rg.trim()) next.rg = 'Informe o RG'
    if (!form.endereco.trim()) next.endereco = 'Informe o endereço'
    if (!form.curso.trim()) next.curso = 'Informe o curso'
    if (!form.instituicaoId) next.instituicaoId = 'Selecione a instituição'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!validate()) return

    if (isEdit) {
      const payload: AlunoUpdateRequest = {
        nome: form.nome.trim(),
        email: form.email.trim(),
        rg: form.rg.trim(),
        endereco: form.endereco.trim(),
        curso: form.curso.trim(),
        instituicaoId: Number(form.instituicaoId),
      }
      await onSubmit(payload)
    } else {
      const payload: AlunoCreateRequest = {
        nome: form.nome.trim(),
        email: form.email.trim(),
        cpf: onlyDigits(form.cpf),
        rg: form.rg.trim(),
        endereco: form.endereco.trim(),
        curso: form.curso.trim(),
        instituicaoId: Number(form.instituicaoId),
      }
      await onSubmit(payload)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="form-grid">
        <div className="form-group full">
          <label className="form-label">
            Nome <span className="required">*</span>
          </label>
          <input
            className="form-input"
            value={form.nome}
            onChange={(e) => setField('nome', e.target.value)}
            maxLength={120}
          />
          {errors.nome && <span className="form-error">{errors.nome}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">
            E-mail <span className="required">*</span>
          </label>
          <input
            type="email"
            className="form-input"
            value={form.email}
            onChange={(e) => setField('email', e.target.value)}
            maxLength={160}
          />
          {errors.email && <span className="form-error">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">
            CPF {!isEdit && <span className="required">*</span>}
          </label>
          <input
            className="form-input"
            value={isEdit ? maskCpf(form.cpf) : maskCpf(form.cpf)}
            onChange={(e) => setField('cpf', e.target.value)}
            disabled={isEdit}
            placeholder="000.000.000-00"
          />
          {isEdit && (
            <span className="form-error" style={{ color: 'var(--color-text-muted)' }}>
              CPF não pode ser alterado.
            </span>
          )}
          {errors.cpf && <span className="form-error">{errors.cpf}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">
            RG <span className="required">*</span>
          </label>
          <input
            className="form-input"
            value={form.rg}
            onChange={(e) => setField('rg', e.target.value)}
            maxLength={20}
          />
          {errors.rg && <span className="form-error">{errors.rg}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">
            Curso <span className="required">*</span>
          </label>
          <input
            className="form-input"
            value={form.curso}
            onChange={(e) => setField('curso', e.target.value)}
            maxLength={120}
          />
          {errors.curso && <span className="form-error">{errors.curso}</span>}
        </div>

        <div className="form-group full">
          <label className="form-label">
            Endereço <span className="required">*</span>
          </label>
          <input
            className="form-input"
            value={form.endereco}
            onChange={(e) => setField('endereco', e.target.value)}
            maxLength={255}
          />
          {errors.endereco && (
            <span className="form-error">{errors.endereco}</span>
          )}
        </div>

        <div className="form-group full">
          <label className="form-label">
            Instituição de Ensino <span className="required">*</span>
          </label>
          <select
            className="form-select"
            value={form.instituicaoId}
            onChange={(e) => setField('instituicaoId', e.target.value)}
          >
            <option value="">— Selecione uma instituição —</option>
            {instituicoes.map((inst) => (
              <option key={inst.id} value={inst.id}>
                {inst.nome}
              </option>
            ))}
          </select>
          {errors.instituicaoId && (
            <span className="form-error">{errors.instituicaoId}</span>
          )}
          {instituicoes.length === 0 && (
            <span className="form-error" style={{ color: 'var(--color-warning)' }}>
              Nenhuma instituição cadastrada. Cadastre uma instituição antes
              de criar um aluno.
            </span>
          )}
        </div>
      </div>

      <div className="form-actions">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onCancel}
          disabled={submitting}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={submitting}
        >
          {submitting ? 'Salvando…' : isEdit ? 'Salvar alterações' : 'Cadastrar aluno'}
        </button>
      </div>
    </form>
  )
}
