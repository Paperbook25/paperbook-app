import type { PaginatedResponse } from '@/types/common.types'
import type {
  Staff,
  StaffFilters,
  CreateStaffRequest,
  UpdateStaffRequest,
  StaffAttendanceRecord,
  StaffAttendanceSummary,
  BulkAttendanceRecord,
  LeaveBalance,
  LeaveRequest,
  CreateLeaveRequest,
  SalaryStructure,
  SalarySlip,
  ProcessSalaryRequest,
  StaffTimetable,
  ClassTimetable,
  TimetableEntry,
  Substitution,
  CreateSubstitutionRequest,
  PerformanceReview,
  CreatePerformanceReview,
  ProfessionalDevelopment,
  CreatePDRequest,
} from '../types/staff.types'

const API_BASE = '/api/staff'

// ==================== STAFF CRUD ====================

export async function fetchStaff(
  filters: StaffFilters & { page?: number; limit?: number } = {}
): Promise<PaginatedResponse<Staff>> {
  const params = new URLSearchParams()

  if (filters.page) params.set('page', String(filters.page))
  if (filters.limit) params.set('limit', String(filters.limit))
  if (filters.search) params.set('search', filters.search)
  if (filters.department) params.set('department', filters.department)
  if (filters.status && filters.status !== 'all') params.set('status', filters.status)

  const response = await fetch(`${API_BASE}?${params.toString()}`)
  if (!response.ok) {
    throw new Error('Failed to fetch staff')
  }
  return response.json()
}

export async function fetchStaffMember(id: string): Promise<{ data: Staff }> {
  const response = await fetch(`${API_BASE}/${id}`)
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Staff member not found')
    }
    throw new Error('Failed to fetch staff member')
  }
  return response.json()
}

export async function createStaff(data: CreateStaffRequest): Promise<{ data: Staff }> {
  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error('Failed to create staff member')
  }
  return response.json()
}

export async function updateStaff(id: string, data: UpdateStaffRequest): Promise<{ data: Staff }> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error('Failed to update staff member')
  }
  return response.json()
}

export async function deleteStaff(id: string): Promise<{ success: boolean }> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE',
  })
  if (!response.ok) {
    throw new Error('Failed to delete staff member')
  }
  return response.json()
}

// ==================== ATTENDANCE ====================

export async function fetchDailyAttendance(date: string): Promise<{ data: StaffAttendanceRecord[] }> {
  const response = await fetch(`${API_BASE}/attendance?date=${date}`)
  if (!response.ok) {
    throw new Error('Failed to fetch attendance')
  }
  return response.json()
}

export async function saveAttendance(
  date: string,
  records: BulkAttendanceRecord[]
): Promise<{ success: boolean; count: number }> {
  const recordsWithDate = records.map((r) => ({ ...r, date }))
  const response = await fetch(`${API_BASE}/attendance`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(recordsWithDate),
  })
  if (!response.ok) {
    throw new Error('Failed to save attendance')
  }
  return response.json()
}

export async function fetchStaffAttendance(
  staffId: string,
  month?: number,
  year?: number
): Promise<{ data: StaffAttendanceRecord[] }> {
  const params = new URLSearchParams()
  if (month) params.set('month', String(month))
  if (year) params.set('year', String(year))

  const response = await fetch(`${API_BASE}/${staffId}/attendance?${params.toString()}`)
  if (!response.ok) {
    throw new Error('Failed to fetch staff attendance')
  }
  return response.json()
}

export async function fetchAttendanceSummary(
  staffId: string,
  month?: number,
  year?: number
): Promise<{ data: StaffAttendanceSummary }> {
  const params = new URLSearchParams()
  if (month) params.set('month', String(month))
  if (year) params.set('year', String(year))

  const response = await fetch(`${API_BASE}/${staffId}/attendance/summary?${params.toString()}`)
  if (!response.ok) {
    throw new Error('Failed to fetch attendance summary')
  }
  return response.json()
}

// ==================== LEAVE ====================

export async function fetchLeaveBalance(staffId: string, year?: number): Promise<{ data: LeaveBalance }> {
  const params = year ? `?year=${year}` : ''
  const response = await fetch(`${API_BASE}/${staffId}/leave-balance${params}`)
  if (!response.ok) {
    throw new Error('Failed to fetch leave balance')
  }
  return response.json()
}

export async function fetchAllLeaveRequests(
  filters: { status?: string; staffId?: string } = {}
): Promise<{ data: LeaveRequest[] }> {
  const params = new URLSearchParams()
  if (filters.status) params.set('status', filters.status)
  if (filters.staffId) params.set('staffId', filters.staffId)

  const response = await fetch(`${API_BASE}/leave-requests?${params.toString()}`)
  if (!response.ok) {
    throw new Error('Failed to fetch leave requests')
  }
  return response.json()
}

export async function fetchStaffLeaveRequests(staffId: string): Promise<{ data: LeaveRequest[] }> {
  const response = await fetch(`${API_BASE}/${staffId}/leave-requests`)
  if (!response.ok) {
    throw new Error('Failed to fetch staff leave requests')
  }
  return response.json()
}

export async function createLeaveRequest(
  staffId: string,
  data: CreateLeaveRequest
): Promise<{ data: LeaveRequest }> {
  const response = await fetch(`${API_BASE}/${staffId}/leave-requests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error('Failed to create leave request')
  }
  return response.json()
}

export async function updateLeaveRequest(
  requestId: string,
  data: { status: 'approved' | 'rejected'; rejectionReason?: string }
): Promise<{ data: LeaveRequest }> {
  const response = await fetch(`/api/leave-requests/${requestId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error('Failed to update leave request')
  }
  return response.json()
}

// ==================== SALARY ====================

export async function fetchSalaryStructure(staffId: string): Promise<{ data: SalaryStructure }> {
  const response = await fetch(`${API_BASE}/${staffId}/salary-structure`)
  if (!response.ok) {
    throw new Error('Failed to fetch salary structure')
  }
  return response.json()
}

export async function updateSalaryStructure(
  staffId: string,
  data: Partial<SalaryStructure>
): Promise<{ data: SalaryStructure }> {
  const response = await fetch(`${API_BASE}/${staffId}/salary-structure`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error('Failed to update salary structure')
  }
  return response.json()
}

export async function fetchSalarySlips(staffId: string): Promise<{ data: SalarySlip[] }> {
  const response = await fetch(`${API_BASE}/${staffId}/salary-slips`)
  if (!response.ok) {
    throw new Error('Failed to fetch salary slips')
  }
  return response.json()
}

export async function processMonthlySalary(
  data: ProcessSalaryRequest
): Promise<{ data: SalarySlip[]; message: string }> {
  const response = await fetch('/api/salary/process', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error('Failed to process salary')
  }
  return response.json()
}

export async function markSalaryPaid(slipId: string): Promise<{ data: SalarySlip }> {
  const response = await fetch(`/api/salary-slips/${slipId}/pay`, {
    method: 'PATCH',
  })
  if (!response.ok) {
    throw new Error('Failed to mark salary as paid')
  }
  return response.json()
}

// ==================== TIMETABLE ====================

export async function fetchStaffTimetable(staffId: string): Promise<StaffTimetable> {
  const response = await fetch(`${API_BASE}/${staffId}/timetable`)
  if (!response.ok) throw new Error('Failed to fetch timetable')
  const json = await response.json()
  return json.data
}

export async function fetchClassTimetable(cls: string, section: string): Promise<ClassTimetable> {
  const response = await fetch(`/api/timetable/class?class=${encodeURIComponent(cls)}&section=${encodeURIComponent(section)}`)
  if (!response.ok) throw new Error('Failed to fetch class timetable')
  const json = await response.json()
  return json.data
}

export async function createTimetableEntry(data: Omit<TimetableEntry, 'id' | 'staffName'>): Promise<TimetableEntry> {
  const response = await fetch('/api/timetable', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error('Failed to create timetable entry')
  const json = await response.json()
  return json.data
}

export async function deleteTimetableEntry(id: string): Promise<{ success: boolean }> {
  const response = await fetch(`/api/timetable/${id}`, { method: 'DELETE' })
  if (!response.ok) throw new Error('Failed to delete timetable entry')
  return response.json()
}

// ==================== SUBSTITUTIONS ====================

export async function fetchSubstitutions(filters?: { date?: string; status?: string }): Promise<Substitution[]> {
  const params = new URLSearchParams()
  if (filters?.date) params.set('date', filters.date)
  if (filters?.status) params.set('status', filters.status)
  const response = await fetch(`${API_BASE}/substitutions?${params}`)
  if (!response.ok) throw new Error('Failed to fetch substitutions')
  const json = await response.json()
  return json.data
}

export async function createSubstitution(data: CreateSubstitutionRequest): Promise<Substitution> {
  const response = await fetch(`${API_BASE}/substitutions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error('Failed to create substitution')
  const json = await response.json()
  return json.data
}

export async function updateSubstitutionStatus(id: string, status: string): Promise<Substitution> {
  const response = await fetch(`${API_BASE}/substitutions/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  })
  if (!response.ok) throw new Error('Failed to update substitution')
  const json = await response.json()
  return json.data
}

// ==================== PERFORMANCE REVIEWS ====================

export async function fetchPerformanceReviews(filters?: { staffId?: string; period?: string; year?: number }): Promise<PerformanceReview[]> {
  const params = new URLSearchParams()
  if (filters?.staffId) params.set('staffId', filters.staffId)
  if (filters?.period) params.set('period', filters.period)
  if (filters?.year) params.set('year', String(filters.year))
  const response = await fetch(`${API_BASE}/performance-reviews?${params}`)
  if (!response.ok) throw new Error('Failed to fetch performance reviews')
  const json = await response.json()
  return json.data
}

export async function fetchStaffPerformanceReviews(staffId: string): Promise<PerformanceReview[]> {
  const response = await fetch(`${API_BASE}/${staffId}/performance-reviews`)
  if (!response.ok) throw new Error('Failed to fetch staff performance reviews')
  const json = await response.json()
  return json.data
}

export async function createPerformanceReview(data: CreatePerformanceReview): Promise<PerformanceReview> {
  const response = await fetch(`${API_BASE}/performance-reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error('Failed to create performance review')
  const json = await response.json()
  return json.data
}

export async function acknowledgeReview(id: string): Promise<PerformanceReview> {
  const response = await fetch(`${API_BASE}/performance-reviews/${id}/acknowledge`, {
    method: 'PATCH',
  })
  if (!response.ok) throw new Error('Failed to acknowledge review')
  const json = await response.json()
  return json.data
}

// ==================== PROFESSIONAL DEVELOPMENT ====================

export async function fetchStaffPD(staffId: string): Promise<ProfessionalDevelopment[]> {
  const response = await fetch(`${API_BASE}/${staffId}/professional-development`)
  if (!response.ok) throw new Error('Failed to fetch professional development records')
  const json = await response.json()
  return json.data
}

export async function fetchAllPD(filters?: { type?: string; status?: string }): Promise<ProfessionalDevelopment[]> {
  const params = new URLSearchParams()
  if (filters?.type) params.set('type', filters.type)
  if (filters?.status) params.set('status', filters.status)
  const response = await fetch(`${API_BASE}/professional-development?${params}`)
  if (!response.ok) throw new Error('Failed to fetch professional development records')
  const json = await response.json()
  return json.data
}

export async function createPD(staffId: string, data: Omit<CreatePDRequest, 'staffId'>): Promise<ProfessionalDevelopment> {
  const response = await fetch(`${API_BASE}/${staffId}/professional-development`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error('Failed to create professional development record')
  const json = await response.json()
  return json.data
}

export async function updatePD(id: string, data: Partial<ProfessionalDevelopment>): Promise<ProfessionalDevelopment> {
  const response = await fetch(`${API_BASE}/professional-development/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error('Failed to update professional development record')
  const json = await response.json()
  return json.data
}

export async function deletePD(id: string): Promise<{ success: boolean }> {
  const response = await fetch(`${API_BASE}/professional-development/${id}`, { method: 'DELETE' })
  if (!response.ok) throw new Error('Failed to delete professional development record')
  return response.json()
}
