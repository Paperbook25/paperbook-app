import { useAuthStore } from '@/stores/useAuthStore'

/**
 * Gets auth headers based on the current user context.
 * These headers are used by MSW handlers to scope data access.
 */
function getAuthHeaders(): HeadersInit {
  const { user } = useAuthStore.getState()
  if (!user) return {}

  const headers: HeadersInit = {
    'X-User-Role': user.role,
  }

  if (user.studentId) {
    headers['X-Student-Id'] = user.studentId
  }

  if (user.childIds && user.childIds.length > 0) {
    headers['X-Child-Ids'] = user.childIds.join(',')
  }

  return headers
}

/**
 * Performs a GET request with auth headers.
 */
export async function apiGet<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      ...getAuthHeaders(),
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }))
    throw new Error(error.error || `Failed to fetch ${url}`)
  }

  return response.json()
}

/**
 * Performs a POST request with auth headers.
 */
export async function apiPost<T>(url: string, data?: unknown): Promise<T> {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: data ? JSON.stringify(data) : undefined,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }))
    throw new Error(error.error || `Failed to post to ${url}`)
  }

  return response.json()
}

/**
 * Performs a PUT request with auth headers.
 */
export async function apiPut<T>(url: string, data: unknown): Promise<T> {
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }))
    throw new Error(error.error || `Failed to update ${url}`)
  }

  return response.json()
}

/**
 * Performs a PATCH request with auth headers.
 */
export async function apiPatch<T>(url: string, data?: unknown): Promise<T> {
  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: data ? JSON.stringify(data) : undefined,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }))
    throw new Error(error.error || `Failed to patch ${url}`)
  }

  return response.json()
}

/**
 * Performs a DELETE request with auth headers.
 */
export async function apiDelete<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      ...getAuthHeaders(),
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }))
    throw new Error(error.error || `Failed to delete ${url}`)
  }

  return response.json()
}
