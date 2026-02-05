// Attendance status types
export type AttendanceStatus = 'present' | 'absent' | 'late' | 'half_day' | 'excused'

export const ATTENDANCE_STATUS_LABELS: Record<AttendanceStatus, string> = {
  present: 'Present',
  absent: 'Absent',
  late: 'Late',
  half_day: 'Half Day',
  excused: 'Excused',
}

export const ATTENDANCE_STATUS_COLORS: Record<AttendanceStatus, string> = {
  present: 'bg-green-500',
  absent: 'bg-red-500',
  late: 'bg-yellow-500',
  half_day: 'bg-orange-500',
  excused: 'bg-blue-500',
}

// Leave types
export type LeaveType = 'sick' | 'casual' | 'medical' | 'family_emergency' | 'other'

export const LEAVE_TYPE_LABELS: Record<LeaveType, string> = {
  sick: 'Sick Leave',
  casual: 'Casual Leave',
  medical: 'Medical Leave',
  family_emergency: 'Family Emergency',
  other: 'Other',
}

export type LeaveStatus = 'pending' | 'approved' | 'rejected'

// Student attendance record
export interface AttendanceRecord {
  id: string
  studentId: string
  studentName: string
  admissionNumber: string
  rollNumber: number
  date: string
  status: AttendanceStatus
  checkInTime?: string
  checkOutTime?: string
  remarks?: string
  markedBy: string
  markedAt: string
}

// Class attendance summary
export interface ClassAttendance {
  date: string
  className: string
  section: string
  totalStudents: number
  present: number
  absent: number
  late: number
  halfDay: number
  excused: number
  records: AttendanceRecord[]
}

// Student for marking attendance
export interface AttendanceStudent {
  id: string
  name: string
  admissionNumber: string
  rollNumber: number
  photoUrl?: string
  status?: AttendanceStatus
  remarks?: string
}

// Leave request
export interface LeaveRequest {
  id: string
  studentId: string
  studentName: string
  className: string
  section: string
  leaveType: LeaveType
  startDate: string
  endDate: string
  reason: string
  status: LeaveStatus
  appliedBy: string
  appliedAt: string
  approvedBy?: string
  approvedAt?: string
  rejectionReason?: string
}

// Attendance report
export interface AttendanceReport {
  studentId: string
  studentName: string
  admissionNumber: string
  className: string
  section: string
  totalDays: number
  presentDays: number
  absentDays: number
  lateDays: number
  halfDays: number
  excusedDays: number
  attendancePercentage: number
  monthlyBreakdown: {
    month: string
    present: number
    absent: number
    late: number
    total: number
    percentage: number
  }[]
}

// Student's own attendance view
export interface StudentAttendanceView {
  studentId: string
  studentName: string
  className: string
  section: string
  academicYear: string
  summary: {
    totalDays: number
    presentDays: number
    absentDays: number
    lateDays: number
    attendancePercentage: number
  }
  recentRecords: AttendanceRecord[]
  monthlyData: {
    month: string
    present: number
    absent: number
    late: number
    percentage: number
  }[]
}

// API Request/Response types
export interface MarkAttendanceRequest {
  date: string
  className: string
  section: string
  records: {
    studentId: string
    status: AttendanceStatus
    remarks?: string
  }[]
}

export interface AttendanceFilters {
  date?: string
  startDate?: string
  endDate?: string
  className?: string
  section?: string
  studentId?: string
  status?: AttendanceStatus
}

export interface LeaveRequestCreate {
  studentId: string
  leaveType: LeaveType
  startDate: string
  endDate: string
  reason: string
}

export interface LeaveRequestUpdate {
  status: LeaveStatus
  rejectionReason?: string
}

// ==================== PERIOD-WISE ATTENDANCE ====================

export type PeriodNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8

export interface PeriodDefinition {
  period: PeriodNumber
  name: string
  startTime: string
  endTime: string
  subject?: string
  teacherId?: string
  teacherName?: string
}

export interface PeriodAttendanceRecord {
  id: string
  studentId: string
  studentName: string
  admissionNumber: string
  rollNumber: number
  date: string
  period: PeriodNumber
  periodName: string
  subject: string
  status: AttendanceStatus
  markedBy: string
  markedAt: string
}

export interface PeriodWiseAttendance {
  date: string
  className: string
  section: string
  periods: PeriodDefinition[]
  records: PeriodAttendanceRecord[]
}

export interface MarkPeriodAttendanceRequest {
  date: string
  className: string
  section: string
  period: PeriodNumber
  subject: string
  records: {
    studentId: string
    status: AttendanceStatus
  }[]
}

export interface StudentPeriodSummary {
  studentId: string
  studentName: string
  admissionNumber: string
  totalPeriods: number
  attendedPeriods: number
  absentPeriods: number
  latePeriods: number
  periodPercentage: number
  subjectWise: {
    subject: string
    total: number
    attended: number
    percentage: number
  }[]
}

// ==================== SHORTAGE ALERTS ====================

export type AlertSeverity = 'warning' | 'critical'
export type AlertType = 'below_threshold' | 'consecutive_absences' | 'period_shortage'

export interface AttendanceThreshold {
  id: string
  minimumPercentage: number
  warningPercentage: number
  consecutiveAbsenceDays: number
  notifyParent: boolean
  notifyTeacher: boolean
  notifyPrincipal: boolean
  enabled: boolean
}

export interface AttendanceAlert {
  id: string
  studentId: string
  studentName: string
  className: string
  section: string
  type: AlertType
  severity: AlertSeverity
  currentPercentage: number
  threshold: number
  message: string
  createdAt: string
  acknowledgedAt?: string
  acknowledgedBy?: string
}

export interface UpdateThresholdRequest {
  minimumPercentage?: number
  warningPercentage?: number
  consecutiveAbsenceDays?: number
  notifyParent?: boolean
  notifyTeacher?: boolean
  notifyPrincipal?: boolean
  enabled?: boolean
}

// ==================== LATE DETECTION ====================

export interface LatePolicy {
  id: string
  schoolStartTime: string
  lateAfterMinutes: number
  halfDayAfterTime: string
  enabled: boolean
}

export interface LateRecord {
  id: string
  studentId: string
  studentName: string
  className: string
  section: string
  date: string
  arrivalTime: string
  lateByMinutes: number
  reason?: string
  isHabitual: boolean
}

export interface LatePatternStudent {
  studentId: string
  studentName: string
  className: string
  section: string
  totalLateDays: number
  averageLateMinutes: number
  lateCount30Days: number
  trend: 'improving' | 'stable' | 'worsening'
  isHabitual: boolean
  recentLates: LateRecord[]
}

export interface UpdateLatePolicyRequest {
  schoolStartTime?: string
  lateAfterMinutes?: number
  halfDayAfterTime?: string
  enabled?: boolean
}

// ==================== ABSENCE NOTIFICATIONS ====================

export type NotificationChannel = 'sms' | 'email' | 'whatsapp' | 'in_app'
export type NotificationEventType = 'absence' | 'late' | 'low_attendance' | 'leave_status'

export interface NotificationConfig {
  id: string
  channel: NotificationChannel
  enabled: boolean
  events: NotificationEventType[]
  timing: 'immediate' | 'daily_digest'
}

export interface AbsenceNotification {
  id: string
  studentId: string
  studentName: string
  className: string
  section: string
  date: string
  channel: NotificationChannel
  eventType: NotificationEventType
  recipient: string
  message: string
  status: 'sent' | 'delivered' | 'failed' | 'pending'
  sentAt: string
  deliveredAt?: string
}

export interface NotificationStats {
  totalSent: number
  delivered: number
  failed: number
  pending: number
  byChannel: Record<NotificationChannel, number>
  byEvent: Record<NotificationEventType, number>
}

export interface UpdateNotificationConfigRequest {
  channel: NotificationChannel
  enabled: boolean
  events: NotificationEventType[]
  timing: 'immediate' | 'daily_digest'
}

// ==================== BIOMETRIC DEVICES ====================

export type BiometricDeviceType = 'fingerprint' | 'facial' | 'rfid' | 'iris'
export type BiometricDeviceStatus = 'active' | 'inactive' | 'error' | 'maintenance'

export interface BiometricDevice {
  id: string
  name: string
  type: BiometricDeviceType
  location: string
  status: BiometricDeviceStatus
  model: string
  serialNumber: string
  ipAddress: string
  lastSyncAt?: string
  installedAt: string
  enrolledStudents: number
  totalCapacity: number
  errorMessage?: string
}

export interface BiometricSyncLog {
  id: string
  deviceId: string
  deviceName: string
  syncedAt: string
  recordsProcessed: number
  recordsFailed: number
  status: 'success' | 'partial' | 'failed'
  duration: number
  errorMessage?: string
}

export interface RegisterDeviceRequest {
  name: string
  type: BiometricDeviceType
  location: string
  model: string
  serialNumber: string
  ipAddress: string
}

// Constants
export const CLASSES = [
  'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5',
  'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10',
  'Class 11', 'Class 12',
]

export const SECTIONS = ['A', 'B', 'C', 'D']

export const PERIOD_NAMES: Record<PeriodNumber, string> = {
  1: '1st Period',
  2: '2nd Period',
  3: '3rd Period',
  4: '4th Period',
  5: '5th Period',
  6: '6th Period',
  7: '7th Period',
  8: '8th Period',
}

export const SUBJECTS = [
  'Mathematics', 'English', 'Hindi', 'Science', 'Social Studies',
  'Physics', 'Chemistry', 'Biology', 'Computer Science', 'Physical Education',
  'Art', 'Music',
]

export const NOTIFICATION_CHANNEL_LABELS: Record<NotificationChannel, string> = {
  sms: 'SMS',
  email: 'Email',
  whatsapp: 'WhatsApp',
  in_app: 'In-App',
}

export const NOTIFICATION_EVENT_LABELS: Record<NotificationEventType, string> = {
  absence: 'Student Absent',
  late: 'Student Late',
  low_attendance: 'Low Attendance',
  leave_status: 'Leave Status Update',
}

export const BIOMETRIC_TYPE_LABELS: Record<BiometricDeviceType, string> = {
  fingerprint: 'Fingerprint Scanner',
  facial: 'Facial Recognition',
  rfid: 'RFID Card Reader',
  iris: 'Iris Scanner',
}

export const BIOMETRIC_STATUS_LABELS: Record<BiometricDeviceStatus, string> = {
  active: 'Active',
  inactive: 'Inactive',
  error: 'Error',
  maintenance: 'Maintenance',
}
