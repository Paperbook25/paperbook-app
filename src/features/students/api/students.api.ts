import type {
  Student,
  StudentFilters,
  CreateStudentRequest,
  UpdateStudentRequest,
  PaginatedResponse,
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

  const response = await fetch(`${API_BASE}?${params.toString()}`)
  if (!response.ok) {
    throw new Error('Failed to fetch students')
  }
  return response.json()
}

export async function fetchStudent(id: string): Promise<{ data: Student }> {
  const response = await fetch(`${API_BASE}/${id}`)
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Student not found')
    }
    throw new Error('Failed to fetch student')
  }
  return response.json()
}

export async function createStudent(data: CreateStudentRequest): Promise<{ data: Student }> {
  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error('Failed to create student')
  }
  return response.json()
}

export async function updateStudent(
  id: string,
  data: UpdateStudentRequest
): Promise<{ data: Student }> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error('Failed to update student')
  }
  return response.json()
}

export async function deleteStudent(id: string): Promise<{ success: boolean }> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE',
  })
  if (!response.ok) {
    throw new Error('Failed to delete student')
  }
  return response.json()
}

// ==================== TIMELINE ====================

export async function fetchStudentTimeline(id: string): Promise<TimelineEvent[]> {
  const response = await fetch(`${API_BASE}/${id}/timeline`)
  if (!response.ok) throw new Error('Failed to fetch timeline')
  const json = await response.json()
  return json.data
}

// ==================== DOCUMENTS ====================

export async function fetchStudentDocuments(id: string): Promise<StudentDocument[]> {
  const response = await fetch(`${API_BASE}/${id}/documents`)
  if (!response.ok) throw new Error('Failed to fetch documents')
  const json = await response.json()
  return json.data
}

export async function uploadStudentDocument(
  studentId: string,
  data: { type: string; name: string; fileName: string; fileSize: number; mimeType: string }
): Promise<{ data: StudentDocument }> {
  const response = await fetch(`${API_BASE}/${studentId}/documents`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error('Failed to upload document')
  return response.json()
}

export async function deleteStudentDocument(
  studentId: string,
  docId: string
): Promise<{ success: boolean }> {
  const response = await fetch(`${API_BASE}/${studentId}/documents/${docId}`, {
    method: 'DELETE',
  })
  if (!response.ok) throw new Error('Failed to delete document')
  return response.json()
}

export async function verifyStudentDocument(
  studentId: string,
  docId: string
): Promise<{ data: StudentDocument }> {
  const response = await fetch(`${API_BASE}/${studentId}/documents/${docId}/verify`, {
    method: 'PATCH',
  })
  if (!response.ok) throw new Error('Failed to verify document')
  return response.json()
}

// ==================== PROMOTION ====================

export async function promoteStudents(
  data: PromotionRequest
): Promise<PromotionResult> {
  const response = await fetch(`${API_BASE}/promote`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error('Failed to promote students')
  const json = await response.json()
  return json.data
}

// ==================== SIBLINGS ====================

export async function fetchStudentSiblings(
  id: string
): Promise<{ id: string; name: string; class: string; section: string; rollNumber: number; photoUrl: string }[]> {
  const response = await fetch(`${API_BASE}/${id}/siblings`)
  if (!response.ok) throw new Error('Failed to fetch siblings')
  const json = await response.json()
  return json.data
}

export async function linkSibling(
  studentId: string,
  siblingId: string
): Promise<{ success: boolean }> {
  const response = await fetch(`${API_BASE}/${studentId}/siblings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ siblingId }),
  })
  if (!response.ok) throw new Error('Failed to link sibling')
  return response.json()
}

export async function unlinkSibling(
  studentId: string,
  siblingId: string
): Promise<{ success: boolean }> {
  const response = await fetch(`${API_BASE}/${studentId}/siblings/${siblingId}`, {
    method: 'DELETE',
  })
  if (!response.ok) throw new Error('Failed to unlink sibling')
  return response.json()
}

// ==================== HEALTH RECORDS ====================

export async function fetchStudentHealth(
  id: string
): Promise<StudentHealthRecord | null> {
  const response = await fetch(`${API_BASE}/${id}/health`)
  if (!response.ok) throw new Error('Failed to fetch health record')
  const json = await response.json()
  return json.data
}

export async function updateStudentHealth(
  id: string,
  data: StudentHealthRecord
): Promise<StudentHealthRecord> {
  const response = await fetch(`${API_BASE}/${id}/health`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error('Failed to update health record')
  const json = await response.json()
  return json.data
}

// ==================== ID CARD ====================

export async function fetchIDCardData(id: string): Promise<IDCardData> {
  const response = await fetch(`${API_BASE}/${id}/id-card`)
  if (!response.ok) throw new Error('Failed to fetch ID card data')
  const json = await response.json()
  return json.data
}

// ==================== BULK IMPORT/EXPORT ====================

export async function bulkImportStudents(
  rows: Record<string, string>[]
): Promise<BulkImportResult> {
  const response = await fetch(`${API_BASE}/bulk-import`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rows }),
  })
  if (!response.ok) throw new Error('Failed to import students')
  const json = await response.json()
  return json.data
}

export async function exportStudents(
  filters?: { class?: string; section?: string }
): Promise<Record<string, string | number>[]> {
  const params = new URLSearchParams()
  if (filters?.class) params.set('class', filters.class)
  if (filters?.section) params.set('section', filters.section)
  const response = await fetch(`${API_BASE}/export?${params}`)
  if (!response.ok) throw new Error('Failed to export students')
  const json = await response.json()
  return json.data
}
