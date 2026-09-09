const tokenStorageKey = 'gaavkaam.auth.token'

export const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, '') ||
  'http://localhost:4000/api'

export function getAuthToken(): string | null {
  return window.localStorage.getItem(tokenStorageKey)
}

export function setAuthToken(token: string): void {
  window.localStorage.setItem(tokenStorageKey, token)
}

export function removeAuthToken(): void {
  window.localStorage.removeItem(tokenStorageKey)
}

export class ApiError extends Error {
  statusCode: number
  errorCode?: string

  constructor(message: string, statusCode: number, errorCode?: string) {
    super(message)
    this.name = 'ApiError'
    this.statusCode = statusCode
    this.errorCode = errorCode
  }
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getAuthToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    })

    const responseText = await response.text()
    let payload: any = {}
    try {
      payload = responseText ? JSON.parse(responseText) : {}
    } catch {
      payload = { message: responseText }
    }

    if (!response.ok || payload.success === false) {
      const message = payload.message || `Request failed with status ${response.status}`
      const errorCode = payload.errorCode || (response.status === 401 ? 'UNAUTHORIZED' : 'API_ERROR')
      
      if (response.status === 401) {
        removeAuthToken()
      }

      throw new ApiError(message, response.status, errorCode)
    }

    return (payload.data !== undefined ? payload.data : payload) as T
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      error instanceof Error ? error.message : 'Network request failed',
      0,
      'NETWORK_ERROR',
    )
  }
}
