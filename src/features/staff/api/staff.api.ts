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
