import { apiGet, apiPost, apiPut } from '@/lib/api-client'
import type {
  ClassAttendance,
  AttendanceRecord,
  AttendanceStudent,
  AttendanceReport,
  StudentAttendanceView,
  LeaveRequest,
  MarkAttendanceRequest,
  AttendanceFilters,
  LeaveRequestCreate,
  LeaveRequestUpdate,
} from '../types/attendance.types'

const API_BASE = '/api'

// ==================== ATTENDANCE ====================

export async function fetchClassAttendance(
  date: string,
  className: string,
  section: string
): Promise<{ data: ClassAttendance }> {
  const params = new URLSearchParams({ date, className, section })
  const response = await fetch(`${API_BASE}/attendance?${params.toString()}`)
  if (!response.ok) throw new Error('Failed to fetch attendance')
  return response.json()
}

export async function fetchStudentsForAttendance(
  className: string,
  section: string,
  date: string
): Promise<{ data: AttendanceStudent[] }> {
  const params = new URLSearchParams({ className, section, date })
  const response = await fetch(`${API_BASE}/attendance/students?${params.toString()}`)
  if (!response.ok) throw new Error('Failed to fetch students')
  return response.json()
}

export async function markAttendance(
  data: MarkAttendanceRequest
): Promise<{ success: boolean; markedCount: number }> {
  const response = await fetch(`${API_BASE}/attendance`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error('Failed to mark attendance')
  return response.json()
}

export async function fetchAttendanceHistory(
  filters: AttendanceFilters
): Promise<{ data: AttendanceRecord[]; meta: { total: number } }> {
  const params = new URLSearchParams()
  if (filters.startDate) params.set('startDate', filters.startDate)
  if (filters.endDate) params.set('endDate', filters.endDate)
  if (filters.className) params.set('className', filters.className)
  if (filters.section) params.set('section', filters.section)
  if (filters.studentId) params.set('studentId', filters.studentId)
  if (filters.status) params.set('status', filters.status)

  const response = await fetch(`${API_BASE}/attendance/history?${params.toString()}`)
  if (!response.ok) throw new Error('Failed to fetch attendance history')
  return response.json()
}

// ==================== STUDENT ATTENDANCE ====================

export async function fetchStudentAttendance(
  studentId: string,
  academicYear?: string
): Promise<{ data: StudentAttendanceView }> {
  const params = new URLSearchParams()
  if (academicYear) params.set('academicYear', academicYear)

  const response = await fetch(`${API_BASE}/students/${studentId}/attendance?${params.toString()}`)
  if (!response.ok) throw new Error('Failed to fetch student attendance')
  return response.json()
}

export async function fetchMyAttendance(
  academicYear?: string
): Promise<{ data: StudentAttendanceView }> {
  const params = new URLSearchParams()
  if (academicYear) params.set('academicYear', academicYear)

  return apiGet(`${API_BASE}/attendance/my?${params.toString()}`)
}

export async function fetchMyChildrenAttendance(
  academicYear?: string
): Promise<{ data: StudentAttendanceView[] }> {
  const params = new URLSearchParams()
  if (academicYear) params.set('academicYear', academicYear)

  return apiGet(`${API_BASE}/attendance/my-children?${params.toString()}`)
}

// ==================== REPORTS ====================

export async function fetchAttendanceReport(
  className: string,
  section: string,
  startDate: string,
  endDate: string
): Promise<{ data: AttendanceReport[] }> {
  const params = new URLSearchParams({ className, section, startDate, endDate })
  const response = await fetch(`${API_BASE}/attendance/report?${params.toString()}`)
  if (!response.ok) throw new Error('Failed to fetch attendance report')
  return response.json()
}

export async function fetchClassAttendanceSummary(
  className: string,
  section: string,
  month: string,
  year: string
): Promise<{
  data: {
    totalStudents: number
    averageAttendance: number
    dailyData: { date: string; present: number; absent: number; late: number }[]
  }
}> {
  const params = new URLSearchParams({ className, section, month, year })
  const response = await fetch(`${API_BASE}/attendance/summary?${params.toString()}`)
  if (!response.ok) throw new Error('Failed to fetch attendance summary')
  return response.json()
}

// ==================== LEAVE MANAGEMENT ====================

export async function fetchLeaveRequests(
  filters?: { status?: string; className?: string; section?: string }
): Promise<{ data: LeaveRequest[] }> {
  const params = new URLSearchParams()
  if (filters?.status) params.set('status', filters.status)
  if (filters?.className) params.set('className', filters.className)
  if (filters?.section) params.set('section', filters.section)

  const response = await fetch(`${API_BASE}/attendance/leaves?${params.toString()}`)
  if (!response.ok) throw new Error('Failed to fetch leave requests')
  return response.json()
}

export async function createLeaveRequest(
  data: LeaveRequestCreate
): Promise<{ data: LeaveRequest }> {
  const response = await fetch(`${API_BASE}/attendance/leaves`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error('Failed to create leave request')
  return response.json()
}

export async function updateLeaveRequest(
  id: string,
  data: LeaveRequestUpdate
): Promise<{ data: LeaveRequest }> {
  const response = await fetch(`${API_BASE}/attendance/leaves/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error('Failed to update leave request')
  return response.json()
}

export async function fetchStudentLeaves(
  studentId: string
): Promise<{ data: LeaveRequest[] }> {
  const response = await fetch(`${API_BASE}/students/${studentId}/leaves`)
  if (!response.ok) throw new Error('Failed to fetch student leaves')
  return response.json()
}
