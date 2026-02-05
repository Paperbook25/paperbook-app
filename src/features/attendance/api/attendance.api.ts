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
  PeriodDefinition,
  PeriodWiseAttendance,
  PeriodNumber,
  MarkPeriodAttendanceRequest,
  StudentPeriodSummary,
  AttendanceThreshold,
  AttendanceAlert,
  UpdateThresholdRequest,
  LatePolicy,
  LateRecord,
  LatePatternStudent,
  UpdateLatePolicyRequest,
  NotificationConfig,
  AbsenceNotification,
  NotificationStats,
  UpdateNotificationConfigRequest,
  BiometricDevice,
  BiometricSyncLog,
  RegisterDeviceRequest,
  NotificationChannel,
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

// ==================== PERIOD-WISE ATTENDANCE ====================

export async function fetchPeriodDefinitions(
  className: string,
  section: string
): Promise<PeriodDefinition[]> {
  const params = new URLSearchParams({ className, section })
  const response = await fetch(`${API_BASE}/attendance/periods/definitions?${params.toString()}`)
  if (!response.ok) throw new Error('Failed to fetch period definitions')
  const json = await response.json()
  return json.data
}

export async function fetchPeriodAttendance(
  date: string,
  className: string,
  section: string,
  period: PeriodNumber
): Promise<PeriodWiseAttendance> {
  const params = new URLSearchParams({ date, className, section, period: String(period) })
  const response = await fetch(`${API_BASE}/attendance/periods?${params.toString()}`)
  if (!response.ok) throw new Error('Failed to fetch period attendance')
  const json = await response.json()
  return json.data
}

export async function markPeriodAttendance(
  data: MarkPeriodAttendanceRequest
): Promise<{ success: boolean; markedCount: number }> {
  const response = await fetch(`${API_BASE}/attendance/periods`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error('Failed to mark period attendance')
  return response.json()
}

export async function fetchStudentPeriodSummary(
  className: string,
  section: string
): Promise<StudentPeriodSummary[]> {
  const params = new URLSearchParams({ className, section })
  const response = await fetch(`${API_BASE}/attendance/periods/summary?${params.toString()}`)
  if (!response.ok) throw new Error('Failed to fetch period summary')
  const json = await response.json()
  return json.data
}

// ==================== SHORTAGE ALERTS ====================

export async function fetchAttendanceThresholds(): Promise<AttendanceThreshold> {
  const response = await fetch(`${API_BASE}/attendance/thresholds`)
  if (!response.ok) throw new Error('Failed to fetch thresholds')
  const json = await response.json()
  return json.data
}

export async function updateAttendanceThresholds(
  data: UpdateThresholdRequest
): Promise<AttendanceThreshold> {
  const response = await fetch(`${API_BASE}/attendance/thresholds`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error('Failed to update thresholds')
  const json = await response.json()
  return json.data
}

export async function fetchAttendanceAlerts(
  filters?: { severity?: string; type?: string }
): Promise<AttendanceAlert[]> {
  const params = new URLSearchParams()
  if (filters?.severity) params.set('severity', filters.severity)
  if (filters?.type) params.set('type', filters.type)
  const response = await fetch(`${API_BASE}/attendance/alerts?${params.toString()}`)
  if (!response.ok) throw new Error('Failed to fetch alerts')
  const json = await response.json()
  return json.data
}

export async function acknowledgeAlert(id: string): Promise<AttendanceAlert> {
  const response = await fetch(`${API_BASE}/attendance/alerts/${id}/acknowledge`, {
    method: 'POST',
  })
  if (!response.ok) throw new Error('Failed to acknowledge alert')
  const json = await response.json()
  return json.data
}

// ==================== LATE DETECTION ====================

export async function fetchLatePolicy(): Promise<LatePolicy> {
  const response = await fetch(`${API_BASE}/attendance/late-policy`)
  if (!response.ok) throw new Error('Failed to fetch late policy')
  const json = await response.json()
  return json.data
}

export async function updateLatePolicy(
  data: UpdateLatePolicyRequest
): Promise<LatePolicy> {
  const response = await fetch(`${API_BASE}/attendance/late-policy`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error('Failed to update late policy')
  const json = await response.json()
  return json.data
}

export async function fetchLateRecords(
  filters?: { className?: string; date?: string }
): Promise<LateRecord[]> {
  const params = new URLSearchParams()
  if (filters?.className) params.set('className', filters.className)
  if (filters?.date) params.set('date', filters.date)
  const response = await fetch(`${API_BASE}/attendance/late-records?${params.toString()}`)
  if (!response.ok) throw new Error('Failed to fetch late records')
  const json = await response.json()
  return json.data
}

export async function fetchLatePatterns(): Promise<LatePatternStudent[]> {
  const response = await fetch(`${API_BASE}/attendance/late-patterns`)
  if (!response.ok) throw new Error('Failed to fetch late patterns')
  const json = await response.json()
  return json.data
}

// ==================== ABSENCE NOTIFICATIONS ====================

export async function fetchNotificationConfig(): Promise<NotificationConfig[]> {
  const response = await fetch(`${API_BASE}/attendance/notifications/config`)
  if (!response.ok) throw new Error('Failed to fetch notification config')
  const json = await response.json()
  return json.data
}

export async function updateNotificationConfig(
  channel: NotificationChannel,
  data: UpdateNotificationConfigRequest
): Promise<NotificationConfig> {
  const response = await fetch(`${API_BASE}/attendance/notifications/config/${channel}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error('Failed to update notification config')
  const json = await response.json()
  return json.data
}

export async function fetchNotificationHistory(
  filters?: { channel?: string; eventType?: string }
): Promise<AbsenceNotification[]> {
  const params = new URLSearchParams()
  if (filters?.channel) params.set('channel', filters.channel)
  if (filters?.eventType) params.set('eventType', filters.eventType)
  const response = await fetch(`${API_BASE}/attendance/notifications/history?${params.toString()}`)
  if (!response.ok) throw new Error('Failed to fetch notification history')
  const json = await response.json()
  return json.data
}

export async function fetchNotificationStats(): Promise<NotificationStats> {
  const response = await fetch(`${API_BASE}/attendance/notifications/stats`)
  if (!response.ok) throw new Error('Failed to fetch notification stats')
  const json = await response.json()
  return json.data
}

export async function sendTestNotification(
  channel: NotificationChannel,
  recipient: string
): Promise<{ id: string; status: string }> {
  const response = await fetch(`${API_BASE}/attendance/notifications/test`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ channel, recipient }),
  })
  if (!response.ok) throw new Error('Failed to send test notification')
  const json = await response.json()
  return json.data
}

// ==================== BIOMETRIC DEVICES ====================

export async function fetchBiometricDevices(): Promise<BiometricDevice[]> {
  const response = await fetch(`${API_BASE}/biometric/devices`)
  if (!response.ok) throw new Error('Failed to fetch biometric devices')
  const json = await response.json()
  return json.data
}

export async function registerBiometricDevice(
  data: RegisterDeviceRequest
): Promise<BiometricDevice> {
  const response = await fetch(`${API_BASE}/biometric/devices`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error('Failed to register device')
  const json = await response.json()
  return json.data
}

export async function updateBiometricDevice(
  id: string,
  data: Partial<BiometricDevice>
): Promise<BiometricDevice> {
  const response = await fetch(`${API_BASE}/biometric/devices/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error('Failed to update device')
  const json = await response.json()
  return json.data
}

export async function fetchBiometricSyncLogs(
  deviceId?: string
): Promise<BiometricSyncLog[]> {
  const params = new URLSearchParams()
  if (deviceId) params.set('deviceId', deviceId)
  const response = await fetch(`${API_BASE}/biometric/sync-logs?${params.toString()}`)
  if (!response.ok) throw new Error('Failed to fetch sync logs')
  const json = await response.json()
  return json.data
}

export async function triggerBiometricSync(
  deviceId: string
): Promise<BiometricSyncLog> {
  const response = await fetch(`${API_BASE}/biometric/devices/${deviceId}/sync`, {
    method: 'POST',
  })
  if (!response.ok) throw new Error('Failed to trigger sync')
  const json = await response.json()
  return json.data
}
