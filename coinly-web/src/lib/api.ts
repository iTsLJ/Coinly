export type ApiError = {
  timestamp?: string
  status: number
  error: string
  message: string
  details?: string[]
}

export class HttpError extends Error {
  status: number
  payload: ApiError

  constructor(payload: ApiError) {
    super(payload.message)
    this.status = payload.status
    this.payload = payload
  }
}

const BASE_URL = (import.meta.env.VITE_API_URL ?? '') as string

async function request<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(init.headers ?? {}),
    },
  })

  if (response.status === 204) {
    return undefined as T
  }

  const text = await response.text()
  const data = text ? JSON.parse(text) : undefined

  if (!response.ok) {
    const error: ApiError = data ?? {
      status: response.status,
      error: response.statusText,
      message: 'Erro inesperado ao se comunicar com o servidor.',
    }
    throw new HttpError(error)
  }

  return data as T
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  put: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'PUT', body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
}
