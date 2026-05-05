import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import type {
  EmpresaCreateRequest,
  EmpresaParceira,
  EmpresaUpdateRequest,
} from '../../types/api'
import {
  isValidCnpj,
  isValidEmail,
  maskCnpj,
  onlyDigits,
} from '../../utils/format'

interface EmpresaFormProps {
  empresa: EmpresaParceira | null
  onSubmit: (
    data: EmpresaCreateRequest | EmpresaUpdateRequest,
  ) => Promise<void>
  onCancel: () => void
  submitting: boolean
}

interface FormState {
  nomeFantasia: string
  cnpj: string
  email: string
}

const empty: FormState = { nomeFantasia: '', cnpj: '', email: '' }

export function EmpresaForm({
  empresa,
  onSubmit,
  onCancel,
  submitting,
}: EmpresaFormProps) {
  const isEdit = empresa !== null
  const [form, setForm] = useState<FormState>(empty)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (empresa) {
      setForm({
        nomeFantasia: empresa.nomeFantasia,
        cnpj: empresa.cnpj,
        email: empresa.email,
      })
    } else {
      setForm(empty)
    }
    setErrors({})
  }, [empresa])

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
    if (!form.nomeFantasia.trim())
      next.nomeFantasia = 'Informe o nome fantasia'
    if (!form.email.trim()) next.email = 'Informe o e-mail'
    else if (!isValidEmail(form.email)) next.email = 'E-mail inválido'
    if (!isEdit) {
      if (!form.cnpj.trim()) next.cnpj = 'Informe o CNPJ'
      else if (!isValidCnpj(form.cnpj)) next.cnpj = 'CNPJ inválido'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!validate()) return

    if (isEdit) {
      const payload: EmpresaUpdateRequest = {
        nomeFantasia: form.nomeFantasia.trim(),
        email: form.email.trim(),
      }
      await onSubmit(payload)
    } else {
      const payload: EmpresaCreateRequest = {
        nomeFantasia: form.nomeFantasia.trim(),
        cnpj: onlyDigits(form.cnpj),
        email: form.email.trim(),
      }
      await onSubmit(payload)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="form-grid">
        <div className="form-group full">
          <label className="form-label">
            Nome fantasia <span className="required">*</span>
          </label>
          <input
            className="form-input"
            value={form.nomeFantasia}
            onChange={(e) => setField('nomeFantasia', e.target.value)}
            maxLength={160}
          />
          {errors.nomeFantasia && (
            <span className="form-error">{errors.nomeFantasia}</span>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">
            CNPJ {!isEdit && <span className="required">*</span>}
          </label>
          <input
            className="form-input"
            value={maskCnpj(form.cnpj)}
            onChange={(e) => setField('cnpj', e.target.value)}
            disabled={isEdit}
            placeholder="00.000.000/0000-00"
          />
          {isEdit && (
            <span
              className="form-error"
              style={{ color: 'var(--color-text-muted)' }}
            >
              CNPJ não pode ser alterado.
            </span>
          )}
          {errors.cnpj && <span className="form-error">{errors.cnpj}</span>}
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
          {submitting
            ? 'Salvando…'
            : isEdit
            ? 'Salvar alterações'
            : 'Cadastrar empresa'}
        </button>
      </div>
    </form>
  )
}
