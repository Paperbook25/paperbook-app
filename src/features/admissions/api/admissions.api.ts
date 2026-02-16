import { apiGet, apiPost, apiPut, apiPatch, apiDelete } from '@/lib/api-client'
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

  return apiGet<ApplicationsResponse>(`${API_BASE}?${params.toString()}`)
}

export async function fetchApplicationStats(): Promise<ApplicationStatsResponse> {
  return apiGet<ApplicationStatsResponse>(`${API_BASE}/stats`)
}

export async function fetchApplication(id: string): Promise<{ data: Application }> {
  return apiGet<{ data: Application }>(`${API_BASE}/${id}`)
}

export async function createApplication(data: CreateApplicationRequest): Promise<{ data: Application }> {
  return apiPost<{ data: Application }>(API_BASE, data)
}

export async function updateApplication(
  id: string,
  data: UpdateApplicationRequest
): Promise<{ data: Application }> {
  return apiPut<{ data: Application }>(`${API_BASE}/${id}`, data)
}

export async function updateApplicationStatus(
  id: string,
  data: UpdateStatusRequest
): Promise<{ data: Application }> {
  return apiPatch<{ data: Application }>(`${API_BASE}/${id}/status`, data)
}

export async function addDocument(
  applicationId: string,
  data: AddDocumentRequest
): Promise<{ data: ApplicationDocument }> {
  return apiPost<{ data: ApplicationDocument }>(`${API_BASE}/${applicationId}/documents`, data)
}

export async function updateDocumentStatus(
  applicationId: string,
  documentId: string,
  data: { status: 'verified' | 'rejected'; rejectionReason?: string }
): Promise<{ data: ApplicationDocument }> {
  return apiPatch<{ data: ApplicationDocument }>(`${API_BASE}/${applicationId}/documents/${documentId}`, data)
}

export async function addNote(applicationId: string, data: AddNoteRequest): Promise<{ data: ApplicationNote }> {
  return apiPost<{ data: ApplicationNote }>(`${API_BASE}/${applicationId}/notes`, data)
}

export async function scheduleInterview(
  applicationId: string,
  interviewDate: string
): Promise<{ data: Application }> {
  return apiPatch<{ data: Application }>(`${API_BASE}/${applicationId}/interview`, { interviewDate })
}

export async function scheduleEntranceExam(
  applicationId: string,
  entranceExamDate: string
): Promise<{ data: Application }> {
  return apiPatch<{ data: Application }>(`${API_BASE}/${applicationId}/entrance-exam`, { entranceExamDate })
}

export async function deleteApplication(id: string): Promise<{ success: boolean }> {
  return apiDelete<{ success: boolean }>(`${API_BASE}/${id}`)
}

// ==================== WAITLIST API ====================

export async function fetchWaitlist(cls?: string): Promise<{ data: WaitlistEntry[] }> {
  const params = new URLSearchParams()
  if (cls) params.set('class', cls)
  return apiGet<{ data: WaitlistEntry[] }>(`${API_BASE}/waitlist?${params}`)
}

export async function fetchClassCapacity(): Promise<{ data: ClassCapacity[] }> {
  return apiGet<{ data: ClassCapacity[] }>(`${API_BASE}/class-capacity`)
}

// ==================== ENTRANCE EXAM API ====================

export async function fetchExamSchedules(): Promise<{ data: EntranceExamSchedule[] }> {
  return apiGet<{ data: EntranceExamSchedule[] }>(`${API_BASE}/exam-schedules`)
}

export async function createExamSchedule(data: ScheduleExamRequest): Promise<{ data: EntranceExamSchedule }> {
  return apiPost<{ data: EntranceExamSchedule }>(`${API_BASE}/exam-schedules`, data)
}

export async function fetchExamResults(filters?: { class?: string; scheduleId?: string }): Promise<{ data: ExamResult[] }> {
  const params = new URLSearchParams()
  if (filters?.class) params.set('class', filters.class)
  if (filters?.scheduleId) params.set('scheduleId', filters.scheduleId)
  return apiGet<{ data: ExamResult[] }>(`${API_BASE}/exam-results?${params}`)
}

export async function recordExamScore(applicationId: string, data: Omit<RecordExamScoreRequest, 'applicationId'>): Promise<{ data: Application }> {
  return apiPost<{ data: Application }>(`${API_BASE}/${applicationId}/exam-score`, data)
}

// ==================== COMMUNICATION API ====================

export async function fetchCommunicationLogs(filters?: { applicationId?: string; type?: string }): Promise<{ data: CommunicationLog[] }> {
  const params = new URLSearchParams()
  if (filters?.applicationId) params.set('applicationId', filters.applicationId)
  if (filters?.type) params.set('type', filters.type)
  return apiGet<{ data: CommunicationLog[] }>(`${API_BASE}/communications?${params}`)
}

export async function fetchCommunicationTemplates(): Promise<{ data: CommunicationTemplate[] }> {
  return apiGet<{ data: CommunicationTemplate[] }>(`${API_BASE}/communication-templates`)
}

export async function sendCommunication(data: SendCommunicationRequest): Promise<{ count: number }> {
  return apiPost<{ count: number }>(`${API_BASE}/send-communication`, data)
}

// ==================== PAYMENT API ====================

export async function fetchAdmissionPayments(status?: string): Promise<{ data: AdmissionPayment[] }> {
  const params = new URLSearchParams()
  if (status) params.set('status', status)
  return apiGet<{ data: AdmissionPayment[] }>(`${API_BASE}/payments?${params}`)
}

export async function fetchApplicationPayment(applicationId: string): Promise<{ data: AdmissionPayment }> {
  return apiGet<{ data: AdmissionPayment }>(`${API_BASE}/${applicationId}/payment`)
}

export async function recordPayment(data: RecordPaymentRequest): Promise<{ data: AdmissionPayment }> {
  return apiPost<{ data: AdmissionPayment }>(`${API_BASE}/${data.applicationId}/payment`, data)
}

// ==================== ANALYTICS API ====================

export async function fetchAdmissionAnalytics(): Promise<{ data: AdmissionAnalytics }> {
  return apiGet<{ data: AdmissionAnalytics }>(`${API_BASE}/analytics`)
}

// ==================== PUBLIC API ====================

export async function submitPublicApplication(data: CreateApplicationRequest & { source?: string }): Promise<{ data: { applicationNumber: string; message: string } }> {
  return apiPost<{ data: { applicationNumber: string; message: string } }>('/api/public/admissions/apply', data)
}

// ==================== EXPORT ====================

export async function exportApplications(
  filters?: { status?: string; class?: string }
): Promise<{ data: Record<string, string | number>[] }> {
  const params = new URLSearchParams()
  if (filters?.status) params.set('status', filters.status)
  if (filters?.class) params.set('class', filters.class)
  return apiGet<{ data: Record<string, string | number>[] }>(`${API_BASE}/export?${params}`)
}
