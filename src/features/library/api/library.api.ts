import { apiGet } from '@/lib/api-client'
import type {
  Book,
  BookFilters,
  CreateBookRequest,
  UpdateBookRequest,
  IssuedBook,
  IssuedBookFilters,
  IssueBookRequest,
  Fine,
  FineFilters,
  UpdateFineRequest,
  LibraryStats,
  StudentForLibrary,
} from '../types/library.types'

const API_BASE = '/api/library'

// ==================== USER-SCOPED TYPES ====================

export interface ChildBooksData {
  studentId: string
  studentName: string
  studentClass: string
  studentSection: string
  books: IssuedBook[]
}

export interface FinesSummary {
  totalFines: number
  pendingFines: number
  paidFines: number
}

export interface MyFinesResponse {
  fines: Fine[]
  summary: FinesSummary
}

// ==================== PAGINATION RESPONSE ====================

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// ==================== USER-SCOPED ENDPOINTS ====================

export async function fetchMyIssuedBooks(): Promise<{ data: IssuedBook[] }> {
  return apiGet(`${API_BASE}/my-books`)
}

export async function fetchMyChildrenBooks(): Promise<{ data: ChildBooksData[] }> {
  return apiGet(`${API_BASE}/my-children-books`)
}

export async function fetchMyLibraryFines(): Promise<{ data: MyFinesResponse }> {
  return apiGet(`${API_BASE}/my-fines`)
}

// ==================== BOOKS CRUD ====================

export async function fetchBooks(filters: BookFilters = {}): Promise<PaginatedResponse<Book>> {
  const params = new URLSearchParams()

  if (filters.page) params.set('page', String(filters.page))
  if (filters.limit) params.set('limit', String(filters.limit))
  if (filters.search) params.set('search', filters.search)
  if (filters.category && filters.category !== 'all') params.set('category', filters.category)
  if (filters.availability && filters.availability !== 'all') {
    params.set('availability', filters.availability)
  }

  const response = await fetch(`${API_BASE}/books?${params.toString()}`)
  if (!response.ok) {
    throw new Error('Failed to fetch books')
  }
  return response.json()
}

export async function fetchBook(id: string): Promise<{ data: Book }> {
  const response = await fetch(`${API_BASE}/books/${id}`)
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Book not found')
    }
    throw new Error('Failed to fetch book')
  }
  return response.json()
}

export async function createBook(data: CreateBookRequest): Promise<{ data: Book }> {
  const response = await fetch(`${API_BASE}/books`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error('Failed to create book')
  }
  return response.json()
}

export async function updateBook(id: string, data: UpdateBookRequest): Promise<{ data: Book }> {
  const response = await fetch(`${API_BASE}/books/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error('Failed to update book')
  }
  return response.json()
}

export async function deleteBook(id: string): Promise<{ success: boolean }> {
  const response = await fetch(`${API_BASE}/books/${id}`, {
    method: 'DELETE',
  })
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || 'Failed to delete book')
  }
  return response.json()
}

// ==================== ISSUED BOOKS ====================

export async function fetchIssuedBooks(
  filters: IssuedBookFilters = {}
): Promise<PaginatedResponse<IssuedBook>> {
  const params = new URLSearchParams()

  if (filters.page) params.set('page', String(filters.page))
  if (filters.limit) params.set('limit', String(filters.limit))
  if (filters.search) params.set('search', filters.search)
  if (filters.status && filters.status !== 'all') params.set('status', filters.status)

  const response = await fetch(`${API_BASE}/issued?${params.toString()}`)
  if (!response.ok) {
    throw new Error('Failed to fetch issued books')
  }
  return response.json()
}

export async function issueBook(data: IssueBookRequest): Promise<{ data: IssuedBook }> {
  const response = await fetch(`${API_BASE}/issue`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || 'Failed to issue book')
  }
  return response.json()
}

export async function returnBook(
  issuedBookId: string
): Promise<{ data: IssuedBook; fine: Fine | null }> {
  const response = await fetch(`${API_BASE}/return/${issuedBookId}`, {
    method: 'POST',
  })
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || 'Failed to return book')
  }
  return response.json()
}

// ==================== FINES ====================

export async function fetchFines(filters: FineFilters = {}): Promise<PaginatedResponse<Fine>> {
  const params = new URLSearchParams()

  if (filters.page) params.set('page', String(filters.page))
  if (filters.limit) params.set('limit', String(filters.limit))
  if (filters.search) params.set('search', filters.search)
  if (filters.status && filters.status !== 'all') params.set('status', filters.status)

  const response = await fetch(`${API_BASE}/fines?${params.toString()}`)
  if (!response.ok) {
    throw new Error('Failed to fetch fines')
  }
  return response.json()
}

export async function updateFine(id: string, data: UpdateFineRequest): Promise<{ data: Fine }> {
  const response = await fetch(`${API_BASE}/fines/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || 'Failed to update fine')
  }
  return response.json()
}

// ==================== STATS & UTILITY ====================

export async function fetchLibraryStats(): Promise<{ data: LibraryStats }> {
  const response = await fetch(`${API_BASE}/stats`)
  if (!response.ok) {
    throw new Error('Failed to fetch library statistics')
  }
  return response.json()
}

export async function fetchAvailableStudents(
  search?: string
): Promise<{ data: StudentForLibrary[] }> {
  const params = search ? `?search=${encodeURIComponent(search)}` : ''
  const response = await fetch(`${API_BASE}/students${params}`)
  if (!response.ok) {
    throw new Error('Failed to fetch students')
  }
  return response.json()
}
