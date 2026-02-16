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

export async function fetchStudentTimeline(id: string): Promise<{ data: TimelineEvent[] }> {
  return apiGet<{ data: TimelineEvent[] }>(`${API_BASE}/${id}/timeline`)
}

// ==================== DOCUMENTS ====================

export async function fetchStudentDocuments(id: string): Promise<{ data: StudentDocument[] }> {
  return apiGet<{ data: StudentDocument[] }>(`${API_BASE}/${id}/documents`)
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
): Promise<{ data: PromotionResult }> {
  return apiPost<{ data: PromotionResult }>(`${API_BASE}/promote`, data)
}

// ==================== SIBLINGS ====================

export async function fetchStudentSiblings(
  id: string
): Promise<{ data: { id: string; name: string; class: string; section: string; rollNumber: number; photoUrl: string }[] }> {
  return apiGet<{ data: { id: string; name: string; class: string; section: string; rollNumber: number; photoUrl: string }[] }>(`${API_BASE}/${id}/siblings`)
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
): Promise<{ data: StudentHealthRecord | null }> {
  return apiGet<{ data: StudentHealthRecord | null }>(`${API_BASE}/${id}/health`)
}

export async function updateStudentHealth(
  id: string,
  data: StudentHealthRecord
): Promise<{ data: StudentHealthRecord }> {
  return apiPut<{ data: StudentHealthRecord }>(`${API_BASE}/${id}/health`, data)
}

// ==================== ID CARD ====================

export async function fetchIDCardData(id: string): Promise<{ data: IDCardData }> {
  return apiGet<{ data: IDCardData }>(`${API_BASE}/${id}/id-card`)
}

// ==================== BULK IMPORT/EXPORT ====================

export async function bulkImportStudents(
  rows: Record<string, string>[]
): Promise<{ data: BulkImportResult }> {
  return apiPost<{ data: BulkImportResult }>(`${API_BASE}/bulk-import`, { rows })
}

export async function exportStudents(
  filters?: { class?: string; section?: string }
): Promise<{ data: Record<string, string | number>[] }> {
  const params = new URLSearchParams()
  if (filters?.class) params.set('class', filters.class)
  if (filters?.section) params.set('section', filters.section)
  return apiGet<{ data: Record<string, string | number>[] }>(`${API_BASE}/export?${params}`)
}

// ==================== MESSAGING ====================

export async function sendParentMessage(
  studentId: string,
  data: { channel: 'sms' | 'email' | 'whatsapp' | 'all'; subject?: string; message: string }
): Promise<{ data: { success: boolean; sentVia: string[] } }> {
  return apiPost<{ data: { success: boolean; sentVia: string[] } }>(`${API_BASE}/${studentId}/message-parent`, data)
}

// ==================== CROSS-MODULE LOOKUPS ====================

import type { RoomAllocation } from '@/features/hostel/types/hostel.types'
import type { Alumni } from '@/features/alumni/types/alumni.types'

export async function fetchStudentHostelAllocation(
  studentId: string
): Promise<{ data: RoomAllocation | null }> {
  return apiGet<{ data: RoomAllocation | null }>(`${API_BASE}/${studentId}/hostel`)
}

export async function fetchStudentAlumniRecord(
  studentId: string
): Promise<{ data: Alumni | null }> {
  return apiGet<{ data: Alumni | null }>(`${API_BASE}/${studentId}/alumni`)
}
