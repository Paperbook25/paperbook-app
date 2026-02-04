import type { Address } from '@/types/common.types'

// ==================== STAFF TYPES ====================

export type StaffStatus = 'active' | 'on_leave' | 'resigned'

export interface Staff {
  id: string
  employeeId: string
  name: string
  email: string
  phone: string
  dateOfBirth: string
  gender: 'male' | 'female'
  department: string
  designation: string
  joiningDate: string
  photoUrl: string
  qualification: string[]
  specialization: string
  salary: number
  address: Address
  status: StaffStatus
  // Additional fields for complete staff record
  emergencyContact?: {
    name: string
    phone: string
    relationship: string
  }
  bankDetails?: {
    accountNumber: string
    bankName: string
    ifscCode: string
    accountHolderName: string
  }
}

export interface CreateStaffRequest {
  name: string
  email: string
  phone: string
  dateOfBirth: string
  gender: 'male' | 'female'
  department: string
  designation: string
  joiningDate: string
  qualification: string[]
  specialization: string
  salary: number
  address: Address
  emergencyContact?: {
    name: string
    phone: string
    relationship: string
  }
  bankDetails?: {
    accountNumber: string
    bankName: string
    ifscCode: string
    accountHolderName: string
  }
}

export interface UpdateStaffRequest extends Partial<CreateStaffRequest> {
  status?: StaffStatus
}

export interface StaffFilters {
  search?: string
  department?: string
  status?: StaffStatus | 'all'
}

// ==================== LEAVE TYPES ====================

export type LeaveType = 'EL' | 'CL' | 'SL' | 'PL'
export type LeaveStatus = 'pending' | 'approved' | 'rejected' | 'cancelled'

export const LEAVE_TYPE_LABELS: Record<LeaveType, string> = {
  EL: 'Earned Leave',
  CL: 'Casual Leave',
  SL: 'Sick Leave',
  PL: 'Privilege Leave',
}

export interface LeaveBalance {
  staffId: string
  year: number
  EL: { total: number; used: number; available: number }
  CL: { total: number; used: number; available: number }
  SL: { total: number; used: number; available: number }
  PL: { total: number; used: number; available: number }
}

export interface LeaveRequest {
  id: string
  staffId: string
  staffName: string
  type: LeaveType
  startDate: string
  endDate: string
  reason: string
  status: LeaveStatus
  numberOfDays: number
  appliedOn: string
  approvedBy?: string
  rejectionReason?: string
}

export interface CreateLeaveRequest {
  type: LeaveType
  startDate: string
  endDate: string
  reason: string
}

// ==================== ATTENDANCE TYPES ====================

export type StaffAttendanceStatus = 'present' | 'absent' | 'half_day' | 'on_leave'

export interface StaffAttendanceRecord {
  id: string
  staffId: string
  date: string
  status: StaffAttendanceStatus
  checkInTime?: string
  checkOutTime?: string
}

export interface StaffAttendanceSummary {
  staffId: string
  month: number
  year: number
  totalWorkingDays: number
  present: number
  absent: number
  halfDay: number
  onLeave: number
  attendancePercentage: number
}

export interface BulkAttendanceRecord {
  staffId: string
  status: StaffAttendanceStatus
  checkInTime?: string
  checkOutTime?: string
}

// ==================== SALARY TYPES ====================

export interface SalaryStructure {
  staffId: string
  basic: number
  hra: number
  da: number
  conveyance: number
  specialAllowance: number
  grossSalary: number
  pf: number
  professionalTax: number
  tds: number
  totalDeductions: number
  netSalary: number
}

export interface SalarySlip {
  id: string
  staffId: string
  staffName: string
  month: number
  year: number
  earnings: {
    basic: number
    hra: number
    da: number
    conveyance: number
    allowances: number
    gross: number
  }
  deductions: {
    pf: number
    tax: number
    professionalTax: number
    lop: number
    total: number
  }
  netPayable: number
  status: 'generated' | 'paid'
  paidOn?: string
}

export interface ProcessSalaryRequest {
  month: number
  year: number
  staffIds?: string[]
}

// ==================== CONSTANTS ====================

export const DEPARTMENTS = [
  'Mathematics',
  'Science',
  'English',
  'Social Studies',
  'Hindi',
  'Computer Science',
  'Physical Education',
  'Art',
  'Music',
  'Administration',
] as const

export const DESIGNATIONS = [
  'Principal',
  'Vice Principal',
  'Senior Teacher',
  'Teacher',
  'Assistant Teacher',
  'Lab Assistant',
  'Librarian',
  'Accountant',
  'Clerk',
  'Peon',
] as const

export const QUALIFICATIONS = [
  'B.Ed',
  'M.Ed',
  'B.A.',
  'M.A.',
  'B.Sc.',
  'M.Sc.',
  'B.Com',
  'M.Com',
  'Ph.D.',
  'MBA',
] as const

export const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Delhi',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
] as const
