interface AlertProps {
  type?: 'error' | 'success'
  message: string
  onClose?: () => void
}

export function Alert({ type = 'error', message, onClose }: AlertProps) {
  return (
    <div className={`alert alert-${type}`}>
      <span>{message}</span>
      {onClose && (
        <button type="button" onClick={onClose} aria-label="Fechar alerta">
          ×
        </button>
      )}
    </div>
  )
}
