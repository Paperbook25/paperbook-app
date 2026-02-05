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
  WaitlistEntry,
  ClassCapacity,
  EntranceExamSchedule,
  ExamResult,
  ScheduleExamRequest,
  RecordExamScoreRequest,
  CommunicationLog,
  CommunicationTemplate,
  SendCommunicationRequest,
  AdmissionPayment,
  RecordPaymentRequest,
  AdmissionAnalytics,
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

// ==================== WAITLIST API ====================

export async function fetchWaitlist(cls?: string): Promise<WaitlistEntry[]> {
  const params = new URLSearchParams()
  if (cls) params.set('class', cls)
  const response = await fetch(`${API_BASE}/waitlist?${params}`)
  if (!response.ok) throw new Error('Failed to fetch waitlist')
  const json = await response.json()
  return json.data
}

export async function fetchClassCapacity(): Promise<ClassCapacity[]> {
  const response = await fetch(`${API_BASE}/class-capacity`)
  if (!response.ok) throw new Error('Failed to fetch class capacity')
  const json = await response.json()
  return json.data
}

// ==================== ENTRANCE EXAM API ====================

export async function fetchExamSchedules(): Promise<EntranceExamSchedule[]> {
  const response = await fetch(`${API_BASE}/exam-schedules`)
  if (!response.ok) throw new Error('Failed to fetch exam schedules')
  const json = await response.json()
  return json.data
}

export async function createExamSchedule(data: ScheduleExamRequest): Promise<EntranceExamSchedule> {
  const response = await fetch(`${API_BASE}/exam-schedules`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error('Failed to create exam schedule')
  const json = await response.json()
  return json.data
}

export async function fetchExamResults(filters?: { class?: string; scheduleId?: string }): Promise<ExamResult[]> {
  const params = new URLSearchParams()
  if (filters?.class) params.set('class', filters.class)
  if (filters?.scheduleId) params.set('scheduleId', filters.scheduleId)
  const response = await fetch(`${API_BASE}/exam-results?${params}`)
  if (!response.ok) throw new Error('Failed to fetch exam results')
  const json = await response.json()
  return json.data
}

export async function recordExamScore(applicationId: string, data: Omit<RecordExamScoreRequest, 'applicationId'>): Promise<Application> {
  const response = await fetch(`${API_BASE}/${applicationId}/exam-score`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error('Failed to record exam score')
  const json = await response.json()
  return json.data
}

// ==================== COMMUNICATION API ====================

export async function fetchCommunicationLogs(filters?: { applicationId?: string; type?: string }): Promise<CommunicationLog[]> {
  const params = new URLSearchParams()
  if (filters?.applicationId) params.set('applicationId', filters.applicationId)
  if (filters?.type) params.set('type', filters.type)
  const response = await fetch(`${API_BASE}/communications?${params}`)
  if (!response.ok) throw new Error('Failed to fetch communication logs')
  const json = await response.json()
  return json.data
}

export async function fetchCommunicationTemplates(): Promise<CommunicationTemplate[]> {
  const response = await fetch(`${API_BASE}/communication-templates`)
  if (!response.ok) throw new Error('Failed to fetch templates')
  const json = await response.json()
  return json.data
}

export async function sendCommunication(data: SendCommunicationRequest): Promise<{ count: number }> {
  const response = await fetch(`${API_BASE}/send-communication`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error('Failed to send communication')
  const json = await response.json()
  return json
}

// ==================== PAYMENT API ====================

export async function fetchAdmissionPayments(status?: string): Promise<AdmissionPayment[]> {
  const params = new URLSearchParams()
  if (status) params.set('status', status)
  const response = await fetch(`${API_BASE}/payments?${params}`)
  if (!response.ok) throw new Error('Failed to fetch payments')
  const json = await response.json()
  return json.data
}

export async function fetchApplicationPayment(applicationId: string): Promise<AdmissionPayment> {
  const response = await fetch(`${API_BASE}/${applicationId}/payment`)
  if (!response.ok) throw new Error('Failed to fetch payment')
  const json = await response.json()
  return json.data
}

export async function recordPayment(data: RecordPaymentRequest): Promise<AdmissionPayment> {
  const response = await fetch(`${API_BASE}/${data.applicationId}/payment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error('Failed to record payment')
  const json = await response.json()
  return json.data
}

// ==================== ANALYTICS API ====================

export async function fetchAdmissionAnalytics(): Promise<AdmissionAnalytics> {
  const response = await fetch(`${API_BASE}/analytics`)
  if (!response.ok) throw new Error('Failed to fetch analytics')
  const json = await response.json()
  return json.data
}

// ==================== PUBLIC API ====================

export async function submitPublicApplication(data: CreateApplicationRequest & { source?: string }): Promise<{ applicationNumber: string; message: string }> {
  const response = await fetch('/api/public/admissions/apply', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error('Failed to submit application')
  const json = await response.json()
  return json.data
}
