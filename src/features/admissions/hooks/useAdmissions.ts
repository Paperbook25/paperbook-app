import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchApplications,
  fetchApplication,
  fetchApplicationStats,
  createApplication,
  updateApplication,
  updateApplicationStatus,
  addDocument,
  updateDocumentStatus,
  addNote,
  scheduleInterview,
  scheduleEntranceExam,
  deleteApplication,
} from '../api/admissions.api'
import type {
  ApplicationFilters,
  CreateApplicationRequest,
  UpdateApplicationRequest,
  UpdateStatusRequest,
  AddDocumentRequest,
  AddNoteRequest,
} from '../types/admission.types'

// Query keys
export const admissionsKeys = {
  all: ['admissions'] as const,
  lists: () => [...admissionsKeys.all, 'list'] as const,
  list: (filters: ApplicationFilters & { page?: number; limit?: number }) =>
    [...admissionsKeys.lists(), filters] as const,
  details: () => [...admissionsKeys.all, 'detail'] as const,
  detail: (id: string) => [...admissionsKeys.details(), id] as const,
  stats: () => [...admissionsKeys.all, 'stats'] as const,
}

// Fetch applications list with filters
export function useApplications(filters: ApplicationFilters & { page?: number; limit?: number } = {}) {
  return useQuery({
    queryKey: admissionsKeys.list(filters),
    queryFn: () => fetchApplications(filters),
  })
}

// Fetch single application
export function useApplication(id: string) {
  return useQuery({
    queryKey: admissionsKeys.detail(id),
    queryFn: () => fetchApplication(id),
    enabled: !!id,
  })
}

// Fetch application stats
export function useApplicationStats() {
  return useQuery({
    queryKey: admissionsKeys.stats(),
    queryFn: fetchApplicationStats,
  })
}

// Create application mutation
export function useCreateApplication() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateApplicationRequest) => createApplication(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: admissionsKeys.lists() })
      queryClient.invalidateQueries({ queryKey: admissionsKeys.stats() })
    },
  })
}

// Update application mutation
export function useUpdateApplication() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateApplicationRequest }) => updateApplication(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: admissionsKeys.detail(variables.id) })
      queryClient.invalidateQueries({ queryKey: admissionsKeys.lists() })
    },
  })
}

// Update status mutation
export function useUpdateStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateStatusRequest }) => updateApplicationStatus(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: admissionsKeys.detail(variables.id) })
      queryClient.invalidateQueries({ queryKey: admissionsKeys.lists() })
      queryClient.invalidateQueries({ queryKey: admissionsKeys.stats() })
    },
  })
}

// Add document mutation
export function useAddDocument() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ applicationId, data }: { applicationId: string; data: AddDocumentRequest }) =>
      addDocument(applicationId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: admissionsKeys.detail(variables.applicationId) })
    },
  })
}

// Update document status mutation
export function useUpdateDocumentStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      applicationId,
      documentId,
      data,
    }: {
      applicationId: string
      documentId: string
      data: { status: 'verified' | 'rejected'; rejectionReason?: string }
    }) => updateDocumentStatus(applicationId, documentId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: admissionsKeys.detail(variables.applicationId) })
    },
  })
}

// Add note mutation
export function useAddNote() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ applicationId, data }: { applicationId: string; data: AddNoteRequest }) =>
      addNote(applicationId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: admissionsKeys.detail(variables.applicationId) })
    },
  })
}

// Schedule interview mutation
export function useScheduleInterview() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ applicationId, interviewDate }: { applicationId: string; interviewDate: string }) =>
      scheduleInterview(applicationId, interviewDate),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: admissionsKeys.detail(variables.applicationId) })
      queryClient.invalidateQueries({ queryKey: admissionsKeys.lists() })
    },
  })
}

// Schedule entrance exam mutation
export function useScheduleEntranceExam() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ applicationId, entranceExamDate }: { applicationId: string; entranceExamDate: string }) =>
      scheduleEntranceExam(applicationId, entranceExamDate),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: admissionsKeys.detail(variables.applicationId) })
      queryClient.invalidateQueries({ queryKey: admissionsKeys.lists() })
    },
  })
}

// Delete application mutation
export function useDeleteApplication() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteApplication(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: admissionsKeys.lists() })
      queryClient.invalidateQueries({ queryKey: admissionsKeys.stats() })
    },
  })
}
