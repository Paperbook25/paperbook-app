import { apiGet, apiPost, apiPut, apiPatch, apiDelete } from '@/lib/api-client'
import type { PaginatedResponse } from '@/types/common.types'
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

  return apiGet<PaginatedResponse<Book>>(`${API_BASE}/books?${params.toString()}`)
}

export async function fetchBook(id: string): Promise<{ data: Book }> {
  return apiGet<{ data: Book }>(`${API_BASE}/books/${id}`)
}

export async function createBook(data: CreateBookRequest): Promise<{ data: Book }> {
  return apiPost<{ data: Book }>(`${API_BASE}/books`, data)
}

export async function updateBook(id: string, data: UpdateBookRequest): Promise<{ data: Book }> {
  return apiPut<{ data: Book }>(`${API_BASE}/books/${id}`, data)
}

export async function deleteBook(id: string): Promise<{ success: boolean }> {
  return apiDelete<{ success: boolean }>(`${API_BASE}/books/${id}`)
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

  return apiGet<PaginatedResponse<IssuedBook>>(`${API_BASE}/issued?${params.toString()}`)
}

export async function issueBook(data: IssueBookRequest): Promise<{ data: IssuedBook }> {
  return apiPost<{ data: IssuedBook }>(`${API_BASE}/issue`, data)
}

export async function returnBook(
  issuedBookId: string
): Promise<{ data: IssuedBook; fine: Fine | null }> {
  return apiPost<{ data: IssuedBook; fine: Fine | null }>(`${API_BASE}/return/${issuedBookId}`)
}

// ==================== FINES ====================

export async function fetchFines(filters: FineFilters = {}): Promise<PaginatedResponse<Fine>> {
  const params = new URLSearchParams()

  if (filters.page) params.set('page', String(filters.page))
  if (filters.limit) params.set('limit', String(filters.limit))
  if (filters.search) params.set('search', filters.search)
  if (filters.status && filters.status !== 'all') params.set('status', filters.status)

  return apiGet<PaginatedResponse<Fine>>(`${API_BASE}/fines?${params.toString()}`)
}

export async function updateFine(id: string, data: UpdateFineRequest): Promise<{ data: Fine }> {
  return apiPatch<{ data: Fine }>(`${API_BASE}/fines/${id}`, data)
}

// ==================== STATS & UTILITY ====================

export async function fetchLibraryStats(): Promise<{ data: LibraryStats }> {
  return apiGet<{ data: LibraryStats }>(`${API_BASE}/stats`)
}

export async function fetchAvailableStudents(
  search?: string
): Promise<{ data: StudentForLibrary[] }> {
  const params = search ? `?search=${encodeURIComponent(search)}` : ''
  return apiGet<{ data: StudentForLibrary[] }>(`${API_BASE}/students${params}`)
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

  return apiGet<PaginatedResponse<BookReservation>>(`${API_BASE}/reservations?${params.toString()}`)
}

export async function createReservation(data: CreateReservationRequest): Promise<{ data: BookReservation }> {
  return apiPost<{ data: BookReservation }>(`${API_BASE}/reservations`, data)
}

export async function cancelReservation(id: string): Promise<{ data: BookReservation }> {
  return apiPatch<{ data: BookReservation }>(`${API_BASE}/reservations/${id}/cancel`)
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

  return apiGet<PaginatedResponse<ReadingRecord>>(`${API_BASE}/reading-history?${params.toString()}`)
}

export async function fetchStudentReadingReport(studentId: string): Promise<{ data: StudentReadingReport }> {
  return apiGet<{ data: StudentReadingReport }>(`${API_BASE}/reading-report/${studentId}`)
}

export async function fetchBookRecommendations(studentId: string): Promise<{ data: BookRecommendation[] }> {
  return apiGet<{ data: BookRecommendation[] }>(`${API_BASE}/recommendations/${studentId}`)
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

  return apiGet<PaginatedResponse<DigitalBook>>(`${API_BASE}/digital?${params.toString()}`)
}

export async function recordDigitalAccess(id: string): Promise<{ data: DigitalBook }> {
  return apiPost<{ data: DigitalBook }>(`${API_BASE}/digital/${id}/access`)
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

  return apiGet<PaginatedResponse<OverdueNotification>>(`${API_BASE}/notifications?${params.toString()}`)
}

export async function fetchNotificationConfig(): Promise<{ data: NotificationConfig }> {
  return apiGet<{ data: NotificationConfig }>(`${API_BASE}/notifications/config`)
}

export async function updateNotificationConfig(data: Partial<NotificationConfig>): Promise<{ data: NotificationConfig }> {
  return apiPut<{ data: NotificationConfig }>(`${API_BASE}/notifications/config`, data)
}

export async function sendOverdueNotification(
  issuedBookId: string,
  channel: string
): Promise<{ data: OverdueNotification }> {
  return apiPost<{ data: OverdueNotification }>(`${API_BASE}/notifications/send`, { issuedBookId, channel })
}

// ==================== BARCODE SCANNING ====================

export async function scanBarcode(isbn: string): Promise<{ data: BarcodeScanResult }> {
  return apiGet<{ data: BarcodeScanResult }>(`${API_BASE}/scan/${encodeURIComponent(isbn)}`)
}
