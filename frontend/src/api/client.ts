function normalizeBase(): string {
  const raw = import.meta.env.VITE_API_BASE_URL || '/api'
  return raw.replace(/\/+$/, '')
}

export class ApiError extends Error {
  status: number
  body?: unknown

  constructor(status: number, message: string, body?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.body = body
  }
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const base = normalizeBase()
  const url = `${base}${path.startsWith('/') ? path : `/${path}`}`

  const headers = new Headers(options.headers)

  const isFormData = options.body instanceof FormData
  if (!isFormData && options.body !== undefined && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  const res = await fetch(url, {
    ...options,
    credentials: 'include',
    headers,
  })

  const text = await res.text()
  const data = text ? (JSON.parse(text) as Record<string, unknown>) : ({} as Record<string, unknown>)

  if (!res.ok) {
    const msg =
      typeof data.message === 'string'
        ? data.message
        : `Request failed (${res.status})`
    throw new ApiError(res.status, msg, data)
  }

  return data as T
}
