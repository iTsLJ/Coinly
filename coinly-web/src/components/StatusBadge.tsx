import type { StatusEmpresa } from '../types/api'

interface StatusBadgeProps {
  status: StatusEmpresa
}

const labelByStatus: Record<StatusEmpresa, string> = {
  PENDENTE: 'Pendente',
  APROVADA: 'Aprovada',
  REJEITADA: 'Rejeitada',
}

const classByStatus: Record<StatusEmpresa, string> = {
  PENDENTE: 'badge-pending',
  APROVADA: 'badge-approved',
  REJEITADA: 'badge-rejected',
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`badge ${classByStatus[status]}`}>
      {labelByStatus[status]}
    </span>
  )
}
