import { useEffect } from 'react'

const BASE_URL = (import.meta.env.VITE_API_URL ?? '') as string

/**
 * Abre uma conexão SSE com /api/saldo/stream e chama `onSaldo` sempre que o
 * backend empurra um novo saldo (após envio/resgate processado).
 * O EventSource não envia o header Authorization, então o token vai como
 * query param (?access_token=...), aceito pelo BearerTokenResolver no backend.
 */
export function useSaldoStream(onSaldo: (saldo: number) => void) {
  useEffect(() => {
    const token =
      localStorage.getItem('token') || sessionStorage.getItem('token')
    if (!token) return

    const url = `${BASE_URL}/api/saldo/stream?access_token=${encodeURIComponent(token)}`
    const es = new EventSource(url)

    es.addEventListener('saldo', (e) => {
      const valor = Number((e as MessageEvent).data)
      if (!Number.isNaN(valor)) onSaldo(valor)
    })

    es.onerror = () => {
      // EventSource tenta reconectar sozinho; nada a fazer aqui.
    }

    return () => es.close()
  }, [onSaldo])
}
