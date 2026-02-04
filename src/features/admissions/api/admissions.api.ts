import type { PaginatedResponse } from '@/types/common.types'
import type {
  AddDocumentRequest,
  AddNoteRequest,
  Application,
  ApplicationDocument,
  ApplicationFilters,
  ApplicationNote,
  CreateApplicationRequest,
  UpdateApplicationRequest,
  UpdateStatusRequest,
} from '../types/admission.types'

const API_BASE = '/api/admissions'

interface ApplicationsResponse extends PaginatedResponse<Application> {}

interface ApplicationStatsResponse {
  data: {
    total: number
    byStatus: Record<string, number>
    byClass: Record<string, number>
    thisMonth: number
    pendingReview: number
  }
}

export async function fetchApplications(
  filters: ApplicationFilters & { page?: number; limit?: number } = {}
): Promise<ApplicationsResponse> {
  const params = new URLSearchParams()

  if (filters.page) params.set('page', String(filters.page))
  if (filters.limit) params.set('limit', String(filters.limit))
  if (filters.search) params.set('search', filters.search)
  if (filters.status && filters.status !== 'all') params.set('status', filters.status)
  if (filters.class) params.set('class', filters.class)
  if (filters.dateFrom) params.set('dateFrom', filters.dateFrom)
  if (filters.dateTo) params.set('dateTo', filters.dateTo)

  const response = await fetch(`${API_BASE}?${params.toString()}`)
  if (!response.ok) {
    throw new Error('Failed to fetch applications')
  }
  return response.json()
}

export async function fetchApplicationStats(): Promise<ApplicationStatsResponse> {
  const response = await fetch(`${API_BASE}/stats`)
  if (!response.ok) {
    throw new Error('Failed to fetch application stats')
  }
  return response.json()
}

export async function fetchApplication(id: string): Promise<{ data: Application }> {
  const response = await fetch(`${API_BASE}/${id}`)
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Application not found')
    }
    throw new Error('Failed to fetch application')
  }
  return response.json()
}

export async function createApplication(data: CreateApplicationRequest): Promise<{ data: Application }> {
  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error('Failed to create application')
  }
  return response.json()
}

export async function updateApplication(
  id: string,
  data: UpdateApplicationRequest
): Promise<{ data: Application }> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error('Failed to update application')
  }
  return response.json()
}

export async function updateApplicationStatus(
  id: string,
  data: UpdateStatusRequest
): Promise<{ data: Application }> {
  const response = await fetch(`${API_BASE}/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error('Failed to update application status')
  }
  return response.json()
}

export async function addDocument(
  applicationId: string,
  data: AddDocumentRequest
): Promise<{ data: ApplicationDocument }> {
  const response = await fetch(`${API_BASE}/${applicationId}/documents`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error('Failed to add document')
  }
  return response.json()
}

export async function updateDocumentStatus(
  applicationId: string,
  documentId: string,
  data: { status: 'verified' | 'rejected'; rejectionReason?: string }
): Promise<{ data: ApplicationDocument }> {
  const response = await fetch(`${API_BASE}/${applicationId}/documents/${documentId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error('Failed to update document status')
  }
  return response.json()
}

export async function addNote(applicationId: string, data: AddNoteRequest): Promise<{ data: ApplicationNote }> {
  const response = await fetch(`${API_BASE}/${applicationId}/notes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error('Failed to add note')
  }
  return response.json()
}

export async function scheduleInterview(
  applicationId: string,
  interviewDate: string
): Promise<{ data: Application }> {
  const response = await fetch(`${API_BASE}/${applicationId}/interview`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ interviewDate }),
  })
  if (!response.ok) {
    throw new Error('Failed to schedule interview')
  }
  return response.json()
}

export async function scheduleEntranceExam(
  applicationId: string,
  entranceExamDate: string
): Promise<{ data: Application }> {
  const response = await fetch(`${API_BASE}/${applicationId}/entrance-exam`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ entranceExamDate }),
  })
  if (!response.ok) {
    throw new Error('Failed to schedule entrance exam')
  }
  return response.json()
}

export async function deleteApplication(id: string): Promise<{ success: boolean }> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE',
  })
  if (!response.ok) {
    throw new Error('Failed to delete application')
  }
  return response.json()
}
