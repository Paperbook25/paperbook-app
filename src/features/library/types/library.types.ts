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
