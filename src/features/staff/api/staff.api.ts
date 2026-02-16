import { apiGet, apiPost, apiPut, apiPatch, apiDelete } from '@/lib/api-client'
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

  return apiGet<PaginatedResponse<Staff>>(`${API_BASE}?${params.toString()}`)
}

export async function fetchStaffMember(id: string): Promise<{ data: Staff }> {
  return apiGet<{ data: Staff }>(`${API_BASE}/${id}`)
}

export async function createStaff(data: CreateStaffRequest): Promise<{ data: Staff }> {
  return apiPost<{ data: Staff }>(API_BASE, data)
}

export async function updateStaff(id: string, data: UpdateStaffRequest): Promise<{ data: Staff }> {
  return apiPut<{ data: Staff }>(`${API_BASE}/${id}`, data)
}

export async function deleteStaff(id: string): Promise<{ success: boolean }> {
  return apiDelete<{ success: boolean }>(`${API_BASE}/${id}`)
}

// ==================== ATTENDANCE ====================

export async function fetchDailyAttendance(date: string): Promise<{ data: StaffAttendanceRecord[] }> {
  return apiGet<{ data: StaffAttendanceRecord[] }>(`${API_BASE}/attendance?date=${date}`)
}

export async function saveAttendance(
  date: string,
  records: BulkAttendanceRecord[]
): Promise<{ success: boolean; count: number }> {
  const recordsWithDate = records.map((r) => ({ ...r, date }))
  return apiPost<{ success: boolean; count: number }>(`${API_BASE}/attendance`, recordsWithDate)
}

export async function fetchStaffAttendance(
  staffId: string,
  month?: number,
  year?: number
): Promise<{ data: StaffAttendanceRecord[] }> {
  const params = new URLSearchParams()
  if (month) params.set('month', String(month))
  if (year) params.set('year', String(year))

  return apiGet<{ data: StaffAttendanceRecord[] }>(`${API_BASE}/${staffId}/attendance?${params.toString()}`)
}

export async function fetchAttendanceSummary(
  staffId: string,
  month?: number,
  year?: number
): Promise<{ data: StaffAttendanceSummary }> {
  const params = new URLSearchParams()
  if (month) params.set('month', String(month))
  if (year) params.set('year', String(year))

  return apiGet<{ data: StaffAttendanceSummary }>(`${API_BASE}/${staffId}/attendance/summary?${params.toString()}`)
}

// ==================== LEAVE ====================

export async function fetchLeaveBalance(staffId: string, year?: number): Promise<{ data: LeaveBalance }> {
  const params = year ? `?year=${year}` : ''
  return apiGet<{ data: LeaveBalance }>(`${API_BASE}/${staffId}/leave-balance${params}`)
}

export async function fetchAllLeaveRequests(
  filters: { status?: string; staffId?: string } = {}
): Promise<{ data: LeaveRequest[] }> {
  const params = new URLSearchParams()
  if (filters.status) params.set('status', filters.status)
  if (filters.staffId) params.set('staffId', filters.staffId)

  return apiGet<{ data: LeaveRequest[] }>(`${API_BASE}/leave-requests?${params.toString()}`)
}

export async function fetchStaffLeaveRequests(staffId: string): Promise<{ data: LeaveRequest[] }> {
  return apiGet<{ data: LeaveRequest[] }>(`${API_BASE}/${staffId}/leave-requests`)
}

export async function createLeaveRequest(
  staffId: string,
  data: CreateLeaveRequest
): Promise<{ data: LeaveRequest }> {
  return apiPost<{ data: LeaveRequest }>(`${API_BASE}/${staffId}/leave-requests`, data)
}

export async function updateLeaveRequest(
  requestId: string,
  data: { status: 'approved' | 'rejected'; rejectionReason?: string }
): Promise<{ data: LeaveRequest }> {
  return apiPatch<{ data: LeaveRequest }>(`${API_BASE}/leave-requests/${requestId}`, data)
}

// ==================== SALARY ====================

export async function fetchSalaryStructure(staffId: string): Promise<{ data: SalaryStructure }> {
  return apiGet<{ data: SalaryStructure }>(`${API_BASE}/${staffId}/salary-structure`)
}

export async function updateSalaryStructure(
  staffId: string,
  data: Partial<SalaryStructure>
): Promise<{ data: SalaryStructure }> {
  return apiPut<{ data: SalaryStructure }>(`${API_BASE}/${staffId}/salary-structure`, data)
}

export async function fetchSalarySlips(staffId: string): Promise<{ data: SalarySlip[] }> {
  return apiGet<{ data: SalarySlip[] }>(`${API_BASE}/${staffId}/salary-slips`)
}

export async function processMonthlySalary(
  data: ProcessSalaryRequest
): Promise<{ data: SalarySlip[]; message: string }> {
  return apiPost<{ data: SalarySlip[]; message: string }>('/api/salary/process', data)
}

export async function markSalaryPaid(slipId: string): Promise<{ data: SalarySlip }> {
  return apiPatch<{ data: SalarySlip }>(`${API_BASE}/salary-slips/${slipId}/pay`)
}

// ==================== TIMETABLE ====================

export async function fetchStaffTimetable(staffId: string): Promise<{ data: StaffTimetable }> {
  return apiGet<{ data: StaffTimetable }>(`${API_BASE}/${staffId}/timetable`)
}

export async function fetchClassTimetable(cls: string, section: string): Promise<{ data: ClassTimetable }> {
  return apiGet<{ data: ClassTimetable }>(`/api/timetable/class?class=${encodeURIComponent(cls)}&section=${encodeURIComponent(section)}`)
}

export async function createTimetableEntry(data: Omit<TimetableEntry, 'id' | 'staffName'>): Promise<{ data: TimetableEntry }> {
  return apiPost<{ data: TimetableEntry }>('/api/timetable', data)
}

export async function deleteTimetableEntry(id: string): Promise<{ success: boolean }> {
  return apiDelete<{ success: boolean }>(`/api/timetable/${id}`)
}

// ==================== SUBSTITUTIONS ====================

export async function fetchSubstitutions(filters?: { date?: string; status?: string }): Promise<{ data: Substitution[] }> {
  const params = new URLSearchParams()
  if (filters?.date) params.set('date', filters.date)
  if (filters?.status) params.set('status', filters.status)
  return apiGet<{ data: Substitution[] }>(`${API_BASE}/substitutions?${params}`)
}

export async function createSubstitution(data: CreateSubstitutionRequest): Promise<{ data: Substitution }> {
  return apiPost<{ data: Substitution }>(`${API_BASE}/substitutions`, data)
}

export async function updateSubstitutionStatus(id: string, status: string): Promise<{ data: Substitution }> {
  return apiPatch<{ data: Substitution }>(`${API_BASE}/substitutions/${id}`, { status })
}

// ==================== PERFORMANCE REVIEWS ====================

export async function fetchPerformanceReviews(filters?: { staffId?: string; period?: string; year?: number }): Promise<{ data: PerformanceReview[] }> {
  const params = new URLSearchParams()
  if (filters?.staffId) params.set('staffId', filters.staffId)
  if (filters?.period) params.set('period', filters.period)
  if (filters?.year) params.set('year', String(filters.year))
  return apiGet<{ data: PerformanceReview[] }>(`${API_BASE}/performance-reviews?${params}`)
}

export async function fetchStaffPerformanceReviews(staffId: string): Promise<{ data: PerformanceReview[] }> {
  return apiGet<{ data: PerformanceReview[] }>(`${API_BASE}/${staffId}/performance-reviews`)
}

export async function createPerformanceReview(data: CreatePerformanceReview): Promise<{ data: PerformanceReview }> {
  return apiPost<{ data: PerformanceReview }>(`${API_BASE}/performance-reviews`, data)
}

export async function acknowledgeReview(id: string): Promise<{ data: PerformanceReview }> {
  return apiPatch<{ data: PerformanceReview }>(`${API_BASE}/performance-reviews/${id}/acknowledge`)
}

// ==================== PROFESSIONAL DEVELOPMENT ====================

export async function fetchStaffPD(staffId: string): Promise<{ data: ProfessionalDevelopment[] }> {
  return apiGet<{ data: ProfessionalDevelopment[] }>(`${API_BASE}/${staffId}/professional-development`)
}

export async function fetchAllPD(filters?: { type?: string; status?: string }): Promise<{ data: ProfessionalDevelopment[] }> {
  const params = new URLSearchParams()
  if (filters?.type) params.set('type', filters.type)
  if (filters?.status) params.set('status', filters.status)
  return apiGet<{ data: ProfessionalDevelopment[] }>(`${API_BASE}/professional-development?${params}`)
}

export async function createPD(staffId: string, data: Omit<CreatePDRequest, 'staffId'>): Promise<{ data: ProfessionalDevelopment }> {
  return apiPost<{ data: ProfessionalDevelopment }>(`${API_BASE}/${staffId}/professional-development`, data)
}

export async function updatePD(id: string, data: Partial<ProfessionalDevelopment>): Promise<{ data: ProfessionalDevelopment }> {
  return apiPut<{ data: ProfessionalDevelopment }>(`${API_BASE}/professional-development/${id}`, data)
}

export async function deletePD(id: string): Promise<{ success: boolean }> {
  return apiDelete<{ success: boolean }>(`${API_BASE}/professional-development/${id}`)
}

// ==================== EXPORT ====================

export async function exportStaff(
  filters?: { department?: string; status?: string }
): Promise<{ data: Record<string, string | number>[] }> {
  const params = new URLSearchParams()
  if (filters?.department) params.set('department', filters.department)
  if (filters?.status) params.set('status', filters.status)
  return apiGet<{ data: Record<string, string | number>[] }>(`${API_BASE}/export?${params}`)
}
