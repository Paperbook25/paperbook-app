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
  BookReservation,
  CreateReservationRequest,
  ReadingRecord,
  StudentReadingReport,
  BookRecommendation,
  DigitalBook,
  DigitalBookFilters,
  OverdueNotification,
  NotificationConfig,
  BarcodeScanResult,
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

// ==================== RESERVATIONS ====================

export async function fetchReservations(
  filters: { search?: string; status?: string; page?: number; limit?: number } = {}
): Promise<PaginatedResponse<BookReservation>> {
  const params = new URLSearchParams()
  if (filters.page) params.set('page', String(filters.page))
  if (filters.limit) params.set('limit', String(filters.limit))
  if (filters.search) params.set('search', filters.search)
  if (filters.status && filters.status !== 'all') params.set('status', filters.status)

  const response = await fetch(`${API_BASE}/reservations?${params.toString()}`)
  if (!response.ok) throw new Error('Failed to fetch reservations')
  return response.json()
}

export async function createReservation(data: CreateReservationRequest): Promise<{ data: BookReservation }> {
  const response = await fetch(`${API_BASE}/reservations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err.error || 'Failed to create reservation')
  }
  return response.json()
}

export async function cancelReservation(id: string): Promise<{ data: BookReservation }> {
  const response = await fetch(`${API_BASE}/reservations/${id}/cancel`, { method: 'PATCH' })
  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err.error || 'Failed to cancel reservation')
  }
  return response.json()
}

// ==================== READING HISTORY & RECOMMENDATIONS ====================

export async function fetchReadingHistory(
  filters: { studentId?: string; category?: string; page?: number; limit?: number } = {}
): Promise<PaginatedResponse<ReadingRecord>> {
  const params = new URLSearchParams()
  if (filters.page) params.set('page', String(filters.page))
  if (filters.limit) params.set('limit', String(filters.limit))
  if (filters.studentId) params.set('studentId', filters.studentId)
  if (filters.category && filters.category !== 'all') params.set('category', filters.category)

  const response = await fetch(`${API_BASE}/reading-history?${params.toString()}`)
  if (!response.ok) throw new Error('Failed to fetch reading history')
  return response.json()
}

export async function fetchStudentReadingReport(studentId: string): Promise<{ data: StudentReadingReport }> {
  const response = await fetch(`${API_BASE}/reading-report/${studentId}`)
  if (!response.ok) {
    if (response.status === 404) throw new Error('No reading history found')
    throw new Error('Failed to fetch reading report')
  }
  return response.json()
}

export async function fetchBookRecommendations(studentId: string): Promise<{ data: BookRecommendation[] }> {
  const response = await fetch(`${API_BASE}/recommendations/${studentId}`)
  if (!response.ok) throw new Error('Failed to fetch recommendations')
  return response.json()
}

// ==================== DIGITAL LIBRARY ====================

export async function fetchDigitalBooks(
  filters: DigitalBookFilters = {}
): Promise<PaginatedResponse<DigitalBook>> {
  const params = new URLSearchParams()
  if (filters.page) params.set('page', String(filters.page))
  if (filters.limit) params.set('limit', String(filters.limit))
  if (filters.search) params.set('search', filters.search)
  if (filters.category && filters.category !== 'all') params.set('category', filters.category)
  if (filters.format && filters.format !== 'all') params.set('format', filters.format)

  const response = await fetch(`${API_BASE}/digital?${params.toString()}`)
  if (!response.ok) throw new Error('Failed to fetch digital books')
  return response.json()
}

export async function recordDigitalAccess(id: string): Promise<{ data: DigitalBook }> {
  const response = await fetch(`${API_BASE}/digital/${id}/access`, { method: 'POST' })
  if (!response.ok) throw new Error('Failed to record access')
  return response.json()
}

// ==================== OVERDUE NOTIFICATIONS ====================

export async function fetchOverdueNotifications(
  filters: { channel?: string; status?: string; page?: number; limit?: number } = {}
): Promise<PaginatedResponse<OverdueNotification>> {
  const params = new URLSearchParams()
  if (filters.page) params.set('page', String(filters.page))
  if (filters.limit) params.set('limit', String(filters.limit))
  if (filters.channel && filters.channel !== 'all') params.set('channel', filters.channel)
  if (filters.status && filters.status !== 'all') params.set('status', filters.status)

  const response = await fetch(`${API_BASE}/notifications?${params.toString()}`)
  if (!response.ok) throw new Error('Failed to fetch notifications')
  return response.json()
}

export async function fetchNotificationConfig(): Promise<{ data: NotificationConfig }> {
  const response = await fetch(`${API_BASE}/notifications/config`)
  if (!response.ok) throw new Error('Failed to fetch notification config')
  return response.json()
}

export async function updateNotificationConfig(data: Partial<NotificationConfig>): Promise<{ data: NotificationConfig }> {
  const response = await fetch(`${API_BASE}/notifications/config`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error('Failed to update notification config')
  return response.json()
}

export async function sendOverdueNotification(
  issuedBookId: string,
  channel: string
): Promise<{ data: OverdueNotification }> {
  const response = await fetch(`${API_BASE}/notifications/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ issuedBookId, channel }),
  })
  if (!response.ok) throw new Error('Failed to send notification')
  return response.json()
}

// ==================== BARCODE SCANNING ====================

export async function scanBarcode(isbn: string): Promise<{ data: BarcodeScanResult }> {
  const response = await fetch(`${API_BASE}/scan/${encodeURIComponent(isbn)}`)
  if (!response.ok) throw new Error('Failed to scan barcode')
  return response.json()
}
