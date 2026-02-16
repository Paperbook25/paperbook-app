import { useAuthStore } from '@/stores/useAuthStore'
import { ApiError } from './api-error'

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
 * Parses error response and throws structured ApiError
 */
async function handleErrorResponse(response: Response, operation: string): Promise<never> {
  let errorData: { error?: string; message?: string; code?: string; fields?: Record<string, string[]> } = {}

  try {
    errorData = await response.json()
  } catch {
    // Response body is not JSON
  }

  const message = errorData.error || errorData.message || getDefaultErrorMessage(response.status, operation)

  throw new ApiError(message, response.status, {
    code: errorData.code,
    fields: errorData.fields,
  })
}

/**
 * Get default error message based on HTTP status
 */
function getDefaultErrorMessage(status: number, operation: string): string {
  switch (status) {
    case 400:
      return 'Invalid request. Please check your input.'
    case 401:
      return 'Your session has expired. Please log in again.'
    case 403:
      return 'You do not have permission to perform this action.'
    case 404:
      return 'The requested resource was not found.'
    case 409:
      return 'This operation conflicts with existing data.'
    case 422:
      return 'Validation failed. Please check your input.'
    case 429:
      return 'Too many requests. Please wait and try again.'
    case 500:
    case 502:
    case 503:
    case 504:
      return 'Server error. Please try again later.'
    default:
      return `Failed to ${operation}`
  }
}

/**
 * Performs a GET request with auth headers.
 */
export async function apiGet<T>(url: string): Promise<T> {
  let response: Response

  try {
    response = await fetch(url, {
      method: 'GET',
      headers: {
        ...getAuthHeaders(),
      },
    })
  } catch {
    throw new ApiError('Unable to connect to the server. Please check your internet connection.', 0)
  }

  if (!response.ok) {
    await handleErrorResponse(response, 'fetch data')
  }

  return response.json()
}

/**
 * Performs a POST request with auth headers.
 */
export async function apiPost<T>(url: string, data?: unknown): Promise<T> {
  let response: Response

  try {
    response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: data ? JSON.stringify(data) : undefined,
    })
  } catch {
    throw new ApiError('Unable to connect to the server. Please check your internet connection.', 0)
  }

  if (!response.ok) {
    await handleErrorResponse(response, 'save data')
  }

  return response.json()
}

/**
 * Performs a PUT request with auth headers.
 */
export async function apiPut<T>(url: string, data: unknown): Promise<T> {
  let response: Response

  try {
    response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(data),
    })
  } catch {
    throw new ApiError('Unable to connect to the server. Please check your internet connection.', 0)
  }

  if (!response.ok) {
    await handleErrorResponse(response, 'update data')
  }

  return response.json()
}

/**
 * Performs a PATCH request with auth headers.
 */
export async function apiPatch<T>(url: string, data?: unknown): Promise<T> {
  let response: Response

  try {
    response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: data ? JSON.stringify(data) : undefined,
    })
  } catch {
    throw new ApiError('Unable to connect to the server. Please check your internet connection.', 0)
  }

  if (!response.ok) {
    await handleErrorResponse(response, 'update data')
  }

  return response.json()
}

/**
 * Performs a DELETE request with auth headers.
 */
export async function apiDelete<T>(url: string): Promise<T> {
  let response: Response

  try {
    response = await fetch(url, {
      method: 'DELETE',
      headers: {
        ...getAuthHeaders(),
      },
    })
  } catch {
    throw new ApiError('Unable to connect to the server. Please check your internet connection.', 0)
  }

  if (!response.ok) {
    await handleErrorResponse(response, 'delete data')
  }

  return response.json()
}
