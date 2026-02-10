import { apiGet, apiPost, apiPut, apiPatch, apiDelete } from '@/lib/api-client'
import type { PaginatedResponse } from '@/types/common.types'
import type {
  Student,
  StudentFilters,
  CreateStudentRequest,
  UpdateStudentRequest,
  TimelineEvent,
  StudentDocument,
  PromotionRequest,
  PromotionResult,
  StudentHealthRecord,
  IDCardData,
  BulkImportResult,
} from '../types/student.types'

const API_BASE = '/api/students'

// ==================== CRUD ====================

export async function fetchStudents(
  filters: StudentFilters = {}
): Promise<PaginatedResponse<Student>> {
  const params = new URLSearchParams()

  if (filters.page) params.set('page', String(filters.page))
  if (filters.limit) params.set('limit', String(filters.limit))
  if (filters.search) params.set('search', filters.search)
  if (filters.class) params.set('class', filters.class)
  if (filters.section) params.set('section', filters.section)
  if (filters.status && filters.status !== 'all') params.set('status', filters.status)

  return apiGet<PaginatedResponse<Student>>(`${API_BASE}?${params.toString()}`)
}

export async function fetchStudent(id: string): Promise<{ data: Student }> {
  return apiGet<{ data: Student }>(`${API_BASE}/${id}`)
}

export async function createStudent(data: CreateStudentRequest): Promise<{ data: Student }> {
  return apiPost<{ data: Student }>(API_BASE, data)
}

export async function updateStudent(
  id: string,
  data: UpdateStudentRequest
): Promise<{ data: Student }> {
  return apiPut<{ data: Student }>(`${API_BASE}/${id}`, data)
}

export async function deleteStudent(id: string): Promise<{ success: boolean }> {
  return apiDelete<{ success: boolean }>(`${API_BASE}/${id}`)
}

// ==================== TIMELINE ====================

export async function fetchStudentTimeline(id: string): Promise<TimelineEvent[]> {
  const result = await apiGet<{ data: TimelineEvent[] }>(`${API_BASE}/${id}/timeline`)
  return result.data
}

// ==================== DOCUMENTS ====================

export async function fetchStudentDocuments(id: string): Promise<StudentDocument[]> {
  const result = await apiGet<{ data: StudentDocument[] }>(`${API_BASE}/${id}/documents`)
  return result.data
}

export async function uploadStudentDocument(
  studentId: string,
  data: { type: string; name: string; fileName: string; fileSize: number; mimeType: string }
): Promise<{ data: StudentDocument }> {
  return apiPost<{ data: StudentDocument }>(`${API_BASE}/${studentId}/documents`, data)
}

export async function deleteStudentDocument(
  studentId: string,
  docId: string
): Promise<{ success: boolean }> {
  return apiDelete<{ success: boolean }>(`${API_BASE}/${studentId}/documents/${docId}`)
}

export async function verifyStudentDocument(
  studentId: string,
  docId: string
): Promise<{ data: StudentDocument }> {
  return apiPatch<{ data: StudentDocument }>(`${API_BASE}/${studentId}/documents/${docId}/verify`)
}

// ==================== PROMOTION ====================

export async function promoteStudents(
  data: PromotionRequest
): Promise<PromotionResult> {
  const result = await apiPost<{ data: PromotionResult }>(`${API_BASE}/promote`, data)
  return result.data
}

// ==================== SIBLINGS ====================

export async function fetchStudentSiblings(
  id: string
): Promise<{ id: string; name: string; class: string; section: string; rollNumber: number; photoUrl: string }[]> {
  const result = await apiGet<{ data: { id: string; name: string; class: string; section: string; rollNumber: number; photoUrl: string }[] }>(`${API_BASE}/${id}/siblings`)
  return result.data
}

export async function linkSibling(
  studentId: string,
  siblingId: string
): Promise<{ success: boolean }> {
  return apiPost<{ success: boolean }>(`${API_BASE}/${studentId}/siblings`, { siblingId })
}

export async function unlinkSibling(
  studentId: string,
  siblingId: string
): Promise<{ success: boolean }> {
  return apiDelete<{ success: boolean }>(`${API_BASE}/${studentId}/siblings/${siblingId}`)
}

// ==================== HEALTH RECORDS ====================

export async function fetchStudentHealth(
  id: string
): Promise<StudentHealthRecord | null> {
  const result = await apiGet<{ data: StudentHealthRecord | null }>(`${API_BASE}/${id}/health`)
  return result.data
}

export async function updateStudentHealth(
  id: string,
  data: StudentHealthRecord
): Promise<StudentHealthRecord> {
  const result = await apiPut<{ data: StudentHealthRecord }>(`${API_BASE}/${id}/health`, data)
  return result.data
}

// ==================== ID CARD ====================

export async function fetchIDCardData(id: string): Promise<IDCardData> {
  const result = await apiGet<{ data: IDCardData }>(`${API_BASE}/${id}/id-card`)
  return result.data
}

// ==================== BULK IMPORT/EXPORT ====================

export async function bulkImportStudents(
  rows: Record<string, string>[]
): Promise<BulkImportResult> {
  const result = await apiPost<{ data: BulkImportResult }>(`${API_BASE}/bulk-import`, { rows })
  return result.data
}

export async function exportStudents(
  filters?: { class?: string; section?: string }
): Promise<Record<string, string | number>[]> {
  const params = new URLSearchParams()
  if (filters?.class) params.set('class', filters.class)
  if (filters?.section) params.set('section', filters.section)
  const result = await apiGet<{ data: Record<string, string | number>[] }>(`${API_BASE}/export?${params}`)
  return result.data
}

// ==================== MESSAGING ====================

export async function sendParentMessage(
  studentId: string,
  data: { channel: 'sms' | 'email' | 'whatsapp' | 'all'; subject?: string; message: string }
): Promise<{ success: boolean; sentVia: string[] }> {
  const result = await apiPost<{ data: { success: boolean; sentVia: string[] } }>(`${API_BASE}/${studentId}/message-parent`, data)
  return result.data
}

// ==================== CROSS-MODULE LOOKUPS ====================

import type { RoomAllocation } from '@/features/hostel/types/hostel.types'
import type { Alumni } from '@/features/alumni/types/alumni.types'

export async function fetchStudentHostelAllocation(
  studentId: string
): Promise<RoomAllocation | null> {
  const result = await apiGet<{ data: RoomAllocation | null }>(`${API_BASE}/${studentId}/hostel`)
  return result.data
}

export async function fetchStudentAlumniRecord(
  studentId: string
): Promise<Alumni | null> {
  const result = await apiGet<{ data: Alumni | null }>(`${API_BASE}/${studentId}/alumni`)
  return result.data
}
