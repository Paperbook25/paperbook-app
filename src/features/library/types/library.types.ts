// ==================== BOOK TYPES ====================

export type BookCategory =
  | 'Fiction'
  | 'Non-Fiction'
  | 'Science'
  | 'Mathematics'
  | 'History'
  | 'Literature'
  | 'Reference'
  | 'Biography'
  | 'Technology'
  | 'Arts'

export interface Book {
  id: string
  isbn: string
  title: string
  author: string
  category: BookCategory
  publisher: string
  publicationYear: number
  totalCopies: number
  availableCopies: number
  description: string
  coverUrl: string
  location: string // shelf location
  addedAt: string
}

export interface CreateBookRequest {
  isbn: string
  title: string
  author: string
  category: BookCategory
  publisher: string
  publicationYear: number
  totalCopies: number
  description?: string
  coverUrl?: string
  location: string
}

export interface UpdateBookRequest extends Partial<CreateBookRequest> {}

export interface BookFilters {
  search?: string
  category?: BookCategory | 'all'
  availability?: 'all' | 'available' | 'unavailable'
  page?: number
  limit?: number
}

// ==================== ISSUED BOOK TYPES ====================

export type IssuedBookStatus = 'issued' | 'returned' | 'overdue'

export interface IssuedBook {
  id: string
  bookId: string
  bookTitle: string
  bookIsbn: string
  studentId: string
  studentName: string
  studentClass: string
  studentSection: string
  issueDate: string
  dueDate: string
  returnDate?: string
  status: IssuedBookStatus
}

export interface IssueBookRequest {
  bookId: string
  studentId: string
  dueDate: string
}

export interface ReturnBookRequest {
  issuedBookId: string
}

export interface IssuedBookFilters {
  search?: string
  status?: IssuedBookStatus | 'all'
  page?: number
  limit?: number
}

// ==================== FINE TYPES ====================

export type FineStatus = 'pending' | 'paid' | 'waived'

export interface Fine {
  id: string
  issuedBookId: string
  bookId: string
  bookTitle: string
  studentId: string
  studentName: string
  studentClass: string
  studentSection: string
  overdueDays: number
  amount: number // Rs 5 per day
  status: FineStatus
  createdAt: string
  paidAt?: string
  waivedAt?: string
  waivedReason?: string
}

export interface UpdateFineRequest {
  status: 'paid' | 'waived'
  waivedReason?: string
}

export interface FineFilters {
  search?: string
  status?: FineStatus | 'all'
  page?: number
  limit?: number
}

// ==================== LIBRARY STATS ====================

export interface LibraryStats {
  totalBooks: number
  availableBooks: number
  issuedBooks: number
  overdueBooks: number
  totalFines: number
  pendingFinesAmount: number
  totalStudentsWithBooks: number
}

// ==================== STUDENT FOR DROPDOWN ====================

export interface StudentForLibrary {
  id: string
  name: string
  className: string
  section: string
  rollNumber: string
  admissionNumber: string
}

// ==================== RESERVATION TYPES ====================

export type ReservationStatus = 'active' | 'fulfilled' | 'cancelled' | 'expired'

export interface BookReservation {
  id: string
  bookId: string
  bookTitle: string
  bookIsbn: string
  studentId: string
  studentName: string
  studentClass: string
  studentSection: string
  reservedAt: string
  expiresAt: string
  status: ReservationStatus
  queuePosition: number
  fulfilledAt?: string
  cancelledAt?: string
}

export interface CreateReservationRequest {
  bookId: string
  studentId: string
}

export const RESERVATION_STATUS_LABELS: Record<ReservationStatus, string> = {
  active: 'Active',
  fulfilled: 'Fulfilled',
  cancelled: 'Cancelled',
  expired: 'Expired',
}

// ==================== READING HISTORY TYPES ====================

export interface ReadingRecord {
  id: string
  studentId: string
  studentName: string
  studentClass: string
  studentSection: string
  bookId: string
  bookTitle: string
  bookAuthor: string
  bookCategory: BookCategory
  issueDate: string
  returnDate: string
  daysToRead: number
  rating?: number // 1-5 star rating by student
}

export interface StudentReadingReport {
  studentId: string
  studentName: string
  studentClass: string
  studentSection: string
  totalBooksRead: number
  averageDaysToRead: number
  averageRating: number
  favoriteCategory: BookCategory
  categoryBreakdown: { category: BookCategory; count: number }[]
  monthlyBreakdown: { month: string; count: number }[]
  recentBooks: ReadingRecord[]
}

export interface BookRecommendation {
  bookId: string
  bookTitle: string
  bookAuthor: string
  bookCategory: BookCategory
  coverUrl: string
  reason: string
  matchScore: number // 0-100
}

// ==================== DIGITAL LIBRARY TYPES ====================

export type DigitalFormat = 'pdf' | 'epub' | 'audiobook'

export interface DigitalBook {
  id: string
  bookId?: string // linked physical book, if any
  title: string
  author: string
  category: BookCategory
  format: DigitalFormat
  fileSize: string
  coverUrl: string
  description: string
  totalAccesses: number
  addedAt: string
  downloadUrl: string
}

export interface DigitalBookFilters {
  search?: string
  category?: BookCategory | 'all'
  format?: DigitalFormat | 'all'
  page?: number
  limit?: number
}

export const DIGITAL_FORMAT_LABELS: Record<DigitalFormat, string> = {
  pdf: 'PDF',
  epub: 'ePub',
  audiobook: 'Audiobook',
}

// ==================== OVERDUE NOTIFICATION TYPES ====================

export type NotificationChannel = 'sms' | 'email' | 'whatsapp' | 'in_app'
export type NotificationStatus = 'sent' | 'delivered' | 'failed' | 'pending'

export interface OverdueNotification {
  id: string
  studentId: string
  studentName: string
  studentClass: string
  parentName: string
  parentPhone: string
  parentEmail: string
  bookTitle: string
  dueDate: string
  overdueDays: number
  fineAmount: number
  channel: NotificationChannel
  status: NotificationStatus
  sentAt: string
  message: string
}

export interface NotificationConfig {
  autoSendEnabled: boolean
  channels: NotificationChannel[]
  sendAfterDays: number
  repeatEveryDays: number
  maxReminders: number
  messageTemplate: string
}

export const NOTIFICATION_CHANNEL_LABELS: Record<NotificationChannel, string> = {
  sms: 'SMS',
  email: 'Email',
  whatsapp: 'WhatsApp',
  in_app: 'In-App',
}

export const NOTIFICATION_STATUS_LABELS: Record<NotificationStatus, string> = {
  sent: 'Sent',
  delivered: 'Delivered',
  failed: 'Failed',
  pending: 'Pending',
}

// ==================== BARCODE/QR TYPES ====================

export interface BarcodeScanResult {
  isbn: string
  book: Book | null
  found: boolean
}

// ==================== CONSTANTS ====================

export const BOOK_CATEGORIES: BookCategory[] = [
  'Fiction',
  'Non-Fiction',
  'Science',
  'Mathematics',
  'History',
  'Literature',
  'Reference',
  'Biography',
  'Technology',
  'Arts',
]

export const FINE_RATE_PER_DAY = 5 // Rs 5 per day

export const DEFAULT_LOAN_DAYS = 14

export const BOOKS_PER_PAGE = 12

export const ISSUED_BOOKS_PER_PAGE = 10

export const FINES_PER_PAGE = 10
