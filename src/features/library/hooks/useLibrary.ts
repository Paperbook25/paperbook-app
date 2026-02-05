import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchMyIssuedBooks,
  fetchMyChildrenBooks,
  fetchMyLibraryFines,
  fetchBooks,
  fetchBook,
  createBook,
  updateBook,
  deleteBook,
  fetchIssuedBooks,
  issueBook,
  returnBook,
  fetchFines,
  updateFine,
  fetchLibraryStats,
  fetchAvailableStudents,
} from '../api/library.api'
import type {
  BookFilters,
  CreateBookRequest,
  UpdateBookRequest,
  IssuedBookFilters,
  IssueBookRequest,
  FineFilters,
  UpdateFineRequest,
} from '../types/library.types'

// ==================== QUERY KEYS ====================

export const libraryKeys = {
  all: ['library'] as const,
  // User-scoped
  myBooks: () => [...libraryKeys.all, 'my-books'] as const,
  myChildrenBooks: () => [...libraryKeys.all, 'my-children-books'] as const,
  myFines: () => [...libraryKeys.all, 'my-fines'] as const,
  // Books
  books: () => [...libraryKeys.all, 'books'] as const,
  bookList: (filters: BookFilters) => [...libraryKeys.books(), 'list', filters] as const,
  bookDetail: (id: string) => [...libraryKeys.books(), 'detail', id] as const,
  issued: () => [...libraryKeys.all, 'issued'] as const,
  issuedList: (filters: IssuedBookFilters) => [...libraryKeys.issued(), 'list', filters] as const,
  fines: () => [...libraryKeys.all, 'fines'] as const,
  fineList: (filters: FineFilters) => [...libraryKeys.fines(), 'list', filters] as const,
  stats: () => [...libraryKeys.all, 'stats'] as const,
  students: (search?: string) => [...libraryKeys.all, 'students', search] as const,
}

// ==================== USER-SCOPED HOOKS ====================

export function useMyIssuedBooks() {
  return useQuery({
    queryKey: libraryKeys.myBooks(),
    queryFn: fetchMyIssuedBooks,
  })
}

export function useMyChildrenBooks() {
  return useQuery({
    queryKey: libraryKeys.myChildrenBooks(),
    queryFn: fetchMyChildrenBooks,
  })
}

export function useMyLibraryFines() {
  return useQuery({
    queryKey: libraryKeys.myFines(),
    queryFn: fetchMyLibraryFines,
  })
}

// ==================== BOOKS HOOKS ====================

export function useBooks(filters: BookFilters = {}) {
  return useQuery({
    queryKey: libraryKeys.bookList(filters),
    queryFn: () => fetchBooks(filters),
  })
}

export function useBook(id: string) {
  return useQuery({
    queryKey: libraryKeys.bookDetail(id),
    queryFn: () => fetchBook(id),
    enabled: !!id,
  })
}

export function useCreateBook() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateBookRequest) => createBook(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: libraryKeys.books() })
      queryClient.invalidateQueries({ queryKey: libraryKeys.stats() })
    },
  })
}

export function useUpdateBook() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBookRequest }) => updateBook(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: libraryKeys.bookDetail(variables.id) })
      queryClient.invalidateQueries({ queryKey: libraryKeys.books() })
      queryClient.invalidateQueries({ queryKey: libraryKeys.stats() })
    },
  })
}

export function useDeleteBook() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteBook(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: libraryKeys.books() })
      queryClient.invalidateQueries({ queryKey: libraryKeys.stats() })
    },
  })
}

// ==================== ISSUED BOOKS HOOKS ====================

export function useIssuedBooks(filters: IssuedBookFilters = {}) {
  return useQuery({
    queryKey: libraryKeys.issuedList(filters),
    queryFn: () => fetchIssuedBooks(filters),
  })
}

export function useIssueBook() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: IssueBookRequest) => issueBook(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: libraryKeys.books() })
      queryClient.invalidateQueries({ queryKey: libraryKeys.issued() })
      queryClient.invalidateQueries({ queryKey: libraryKeys.stats() })
    },
  })
}

export function useReturnBook() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (issuedBookId: string) => returnBook(issuedBookId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: libraryKeys.books() })
      queryClient.invalidateQueries({ queryKey: libraryKeys.issued() })
      queryClient.invalidateQueries({ queryKey: libraryKeys.fines() })
      queryClient.invalidateQueries({ queryKey: libraryKeys.stats() })
    },
  })
}

// ==================== FINES HOOKS ====================

export function useFines(filters: FineFilters = {}) {
  return useQuery({
    queryKey: libraryKeys.fineList(filters),
    queryFn: () => fetchFines(filters),
  })
}

export function useUpdateFine() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateFineRequest }) => updateFine(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: libraryKeys.fines() })
      queryClient.invalidateQueries({ queryKey: libraryKeys.stats() })
    },
  })
}

// ==================== STATS & UTILITY HOOKS ====================

export function useLibraryStats() {
  return useQuery({
    queryKey: libraryKeys.stats(),
    queryFn: fetchLibraryStats,
  })
}

export function useAvailableStudents(search?: string) {
  return useQuery({
    queryKey: libraryKeys.students(search),
    queryFn: () => fetchAvailableStudents(search),
  })
}
