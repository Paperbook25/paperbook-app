// School Profile
export interface SchoolProfile {
  id: string
  name: string
  address: string
  city: string
  state: string
  pincode: string
  phone: string
  email: string
  website?: string
  logo?: string
  principalName: string
  establishedYear: number
  affiliationNumber?: string
  affiliationBoard?: 'CBSE' | 'ICSE' | 'State' | 'IB' | 'Other'
}

// Academic Year
export interface AcademicYear {
  id: string
  name: string // e.g., "2024-25"
  startDate: string
  endDate: string
  isCurrent: boolean
  status: 'active' | 'completed' | 'upcoming'
}

// Class & Section
export interface ClassSection {
  id: string
  className: string // e.g., "Class 1", "Class 2"
  sections: string[] // e.g., ["A", "B", "C"]
  classTeacherId?: string
  classTeacherName?: string
}

// User Management
export type UserRole = 'admin' | 'principal' | 'teacher' | 'accountant' | 'librarian' | 'receptionist'

export interface SystemUser {
  id: string
  email: string
  name: string
  role: UserRole
  isActive: boolean
  lastLogin?: string
  createdAt: string
}

// Notification Settings
export interface NotificationPreferences {
  emailNotifications: boolean
  smsNotifications: boolean
  feeReminders: boolean
  attendanceAlerts: boolean
  examResults: boolean
  generalAnnouncements: boolean
}

// Backup Settings
export interface BackupConfig {
  autoBackup: boolean
  backupFrequency: 'daily' | 'weekly' | 'monthly'
  lastBackupAt?: string
  backupRetentionDays: number
}

// Theme Settings
export interface ThemeConfig {
  mode: 'light' | 'dark' | 'system'
  primaryColor: string
  accentColor: string
}

// Request/Update types
export interface UpdateSchoolProfileRequest {
  name?: string
  address?: string
  city?: string
  state?: string
  pincode?: string
  phone?: string
  email?: string
  website?: string
  logo?: string
  principalName?: string
  establishedYear?: number
  affiliationNumber?: string
  affiliationBoard?: 'CBSE' | 'ICSE' | 'State' | 'IB' | 'Other'
}

export interface CreateAcademicYearRequest {
  name: string
  startDate: string
  endDate: string
}

export interface UpdateAcademicYearRequest {
  name?: string
  startDate?: string
  endDate?: string
  status?: 'active' | 'completed' | 'upcoming'
}

export interface CreateClassSectionRequest {
  className: string
  sections: string[]
  classTeacherId?: string
}

export interface UpdateClassSectionRequest {
  className?: string
  sections?: string[]
  classTeacherId?: string
}

export interface CreateUserRequest {
  email: string
  name: string
  role: UserRole
  password: string
}

export interface UpdateUserRequest {
  email?: string
  name?: string
  role?: UserRole
  isActive?: boolean
}

export interface UpdateNotificationPreferencesRequest {
  emailNotifications?: boolean
  smsNotifications?: boolean
  feeReminders?: boolean
  attendanceAlerts?: boolean
  examResults?: boolean
  generalAnnouncements?: boolean
}

export interface UpdateBackupConfigRequest {
  autoBackup?: boolean
  backupFrequency?: 'daily' | 'weekly' | 'monthly'
  backupRetentionDays?: number
}

export interface UpdateThemeConfigRequest {
  mode?: 'light' | 'dark' | 'system'
  primaryColor?: string
  accentColor?: string
}

// ==================== AUDIT LOG ====================

export type AuditAction = 'create' | 'update' | 'delete' | 'login' | 'logout' | 'export' | 'import' | 'status_change'
export type AuditModule = 'students' | 'staff' | 'admissions' | 'attendance' | 'finance' | 'library' | 'exams' | 'transport' | 'settings' | 'auth'

export const AUDIT_ACTION_LABELS: Record<AuditAction, string> = {
  create: 'Created',
  update: 'Updated',
  delete: 'Deleted',
  login: 'Logged In',
  logout: 'Logged Out',
  export: 'Exported',
  import: 'Imported',
  status_change: 'Status Changed',
}

export const AUDIT_MODULE_LABELS: Record<AuditModule, string> = {
  students: 'Students',
  staff: 'Staff',
  admissions: 'Admissions',
  attendance: 'Attendance',
  finance: 'Finance',
  library: 'Library',
  exams: 'Exams',
  transport: 'Transport',
  settings: 'Settings',
  auth: 'Authentication',
}

export interface AuditLogEntry {
  id: string
  userId: string
  userName: string
  userRole: string
  action: AuditAction
  module: AuditModule
  entityType: string
  entityId: string
  entityName: string
  description: string
  changes?: { field: string; oldValue: string; newValue: string }[]
  ipAddress: string
  timestamp: string
}

// ==================== ACADEMIC CALENDAR ====================

export type CalendarEventType = 'holiday' | 'exam' | 'ptm' | 'sports' | 'cultural' | 'workshop' | 'vacation' | 'other'

export const CALENDAR_EVENT_TYPE_LABELS: Record<CalendarEventType, string> = {
  holiday: 'Holiday',
  exam: 'Examination',
  ptm: 'Parent-Teacher Meeting',
  sports: 'Sports Event',
  cultural: 'Cultural Event',
  workshop: 'Workshop / Training',
  vacation: 'Vacation',
  other: 'Other',
}

export interface CalendarEvent {
  id: string
  title: string
  description: string
  type: CalendarEventType
  startDate: string
  endDate: string
  isRecurring: boolean
  appliesToClasses: string[] // empty = all classes
  createdAt: string
}

export interface CreateCalendarEventRequest {
  title: string
  description: string
  type: CalendarEventType
  startDate: string
  endDate: string
  isRecurring: boolean
  appliesToClasses: string[]
}

// ==================== EMAIL TEMPLATES ====================

export type TemplateCategory = 'fee' | 'attendance' | 'exam' | 'admission' | 'general' | 'transport'

export const TEMPLATE_CATEGORY_LABELS: Record<TemplateCategory, string> = {
  fee: 'Fee & Payment',
  attendance: 'Attendance',
  exam: 'Exams & Results',
  admission: 'Admissions',
  general: 'General',
  transport: 'Transport',
}

export interface EmailTemplate {
  id: string
  name: string
  subject: string
  body: string
  category: TemplateCategory
  variables: string[] // Available placeholders: {{student_name}}, {{class}}, etc.
  isActive: boolean
  lastModified: string
  createdAt: string
}

export interface CreateEmailTemplateRequest {
  name: string
  subject: string
  body: string
  category: TemplateCategory
}

export interface UpdateEmailTemplateRequest {
  name?: string
  subject?: string
  body?: string
  category?: TemplateCategory
  isActive?: boolean
}
