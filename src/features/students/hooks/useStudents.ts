import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchStudents,
  fetchStudent,
  createStudent,
  updateStudent,
  deleteStudent,
  fetchStudentTimeline,
  fetchStudentDocuments,
  uploadStudentDocument,
  deleteStudentDocument,
  verifyStudentDocument,
  promoteStudents,
  fetchStudentSiblings,
  linkSibling,
  unlinkSibling,
  fetchStudentHealth,
  updateStudentHealth,
  fetchIDCardData,
  bulkImportStudents,
  exportStudents,
} from '../api/students.api'
import type {
  StudentFilters,
  CreateStudentRequest,
  UpdateStudentRequest,
  PromotionRequest,
  StudentHealthRecord,
} from '../types/student.types'

// ==================== QUERY KEYS ====================

export const studentKeys = {
  all: ['students'] as const,
  lists: () => [...studentKeys.all, 'list'] as const,
  list: (filters: StudentFilters) => [...studentKeys.lists(), filters] as const,
  details: () => [...studentKeys.all, 'detail'] as const,
  detail: (id: string) => [...studentKeys.details(), id] as const,
  timeline: (id: string) => [...studentKeys.all, 'timeline', id] as const,
  documents: (id: string) => [...studentKeys.all, 'documents', id] as const,
  siblings: (id: string) => [...studentKeys.all, 'siblings', id] as const,
  health: (id: string) => [...studentKeys.all, 'health', id] as const,
  idCard: (id: string) => [...studentKeys.all, 'id-card', id] as const,
}

// ==================== QUERY HOOKS ====================

export function useStudents(filters: StudentFilters = {}) {
  return useQuery({
    queryKey: studentKeys.list(filters),
    queryFn: () => fetchStudents(filters),
  })
}

export function useStudent(id: string) {
  return useQuery({
    queryKey: studentKeys.detail(id),
    queryFn: () => fetchStudent(id),
    enabled: !!id,
  })
}

export function useStudentTimeline(id: string) {
  return useQuery({
    queryKey: studentKeys.timeline(id),
    queryFn: () => fetchStudentTimeline(id),
    enabled: !!id,
  })
}

export function useStudentDocuments(id: string) {
  return useQuery({
    queryKey: studentKeys.documents(id),
    queryFn: () => fetchStudentDocuments(id),
    enabled: !!id,
  })
}

export function useStudentSiblings(id: string) {
  return useQuery({
    queryKey: studentKeys.siblings(id),
    queryFn: () => fetchStudentSiblings(id),
    enabled: !!id,
  })
}

export function useStudentHealth(id: string) {
  return useQuery({
    queryKey: studentKeys.health(id),
    queryFn: () => fetchStudentHealth(id),
    enabled: !!id,
  })
}

export function useIDCardData(id: string) {
  return useQuery({
    queryKey: studentKeys.idCard(id),
    queryFn: () => fetchIDCardData(id),
    enabled: !!id,
  })
}

// ==================== MUTATION HOOKS ====================

export function useCreateStudent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateStudentRequest) => createStudent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentKeys.lists() })
    },
  })
}

export function useUpdateStudent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateStudentRequest }) =>
      updateStudent(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: studentKeys.detail(variables.id) })
      queryClient.invalidateQueries({ queryKey: studentKeys.lists() })
    },
  })
}

export function useDeleteStudent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteStudent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentKeys.lists() })
    },
  })
}

export function useUploadDocument() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      studentId,
      data,
    }: {
      studentId: string
      data: { type: string; name: string; fileName: string; fileSize: number; mimeType: string }
    }) => uploadStudentDocument(studentId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: studentKeys.documents(variables.studentId) })
    },
  })
}

export function useDeleteDocument() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ studentId, docId }: { studentId: string; docId: string }) =>
      deleteStudentDocument(studentId, docId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: studentKeys.documents(variables.studentId) })
    },
  })
}

export function useVerifyDocument() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ studentId, docId }: { studentId: string; docId: string }) =>
      verifyStudentDocument(studentId, docId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: studentKeys.documents(variables.studentId) })
    },
  })
}

export function usePromoteStudents() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: PromotionRequest) => promoteStudents(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentKeys.all })
    },
  })
}

export function useLinkSibling() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ studentId, siblingId }: { studentId: string; siblingId: string }) =>
      linkSibling(studentId, siblingId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: studentKeys.siblings(variables.studentId) })
      queryClient.invalidateQueries({ queryKey: studentKeys.siblings(variables.siblingId) })
    },
  })
}

export function useUnlinkSibling() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ studentId, siblingId }: { studentId: string; siblingId: string }) =>
      unlinkSibling(studentId, siblingId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: studentKeys.siblings(variables.studentId) })
      queryClient.invalidateQueries({ queryKey: studentKeys.siblings(variables.siblingId) })
    },
  })
}

export function useUpdateHealth() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: StudentHealthRecord }) =>
      updateStudentHealth(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: studentKeys.health(variables.id) })
    },
  })
}

export function useBulkImport() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (rows: Record<string, string>[]) => bulkImportStudents(rows),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentKeys.lists() })
    },
  })
}

export function useExportStudents() {
  return useMutation({
    mutationFn: (filters?: { class?: string; section?: string }) => exportStudents(filters),
  })
}
