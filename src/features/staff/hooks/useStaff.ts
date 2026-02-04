import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchStaff,
  fetchStaffMember,
  createStaff,
  updateStaff,
  deleteStaff,
  fetchDailyAttendance,
  saveAttendance,
  fetchStaffAttendance,
  fetchAttendanceSummary,
  fetchLeaveBalance,
  fetchAllLeaveRequests,
  fetchStaffLeaveRequests,
  createLeaveRequest,
  updateLeaveRequest,
  fetchSalaryStructure,
  updateSalaryStructure,
  fetchSalarySlips,
  processMonthlySalary,
  markSalaryPaid,
} from '../api/staff.api'
import type {
  StaffFilters,
  CreateStaffRequest,
  UpdateStaffRequest,
  BulkAttendanceRecord,
  CreateLeaveRequest,
  ProcessSalaryRequest,
  SalaryStructure,
} from '../types/staff.types'

// ==================== QUERY KEYS ====================

export const staffKeys = {
  all: ['staff'] as const,
  lists: () => [...staffKeys.all, 'list'] as const,
  list: (filters: StaffFilters & { page?: number; limit?: number }) =>
    [...staffKeys.lists(), filters] as const,
  details: () => [...staffKeys.all, 'detail'] as const,
  detail: (id: string) => [...staffKeys.details(), id] as const,
  attendance: () => [...staffKeys.all, 'attendance'] as const,
  dailyAttendance: (date: string) => [...staffKeys.attendance(), 'daily', date] as const,
  staffAttendance: (staffId: string, month?: number, year?: number) =>
    [...staffKeys.attendance(), 'staff', staffId, month, year] as const,
  attendanceSummary: (staffId: string, month?: number, year?: number) =>
    [...staffKeys.attendance(), 'summary', staffId, month, year] as const,
  leave: () => [...staffKeys.all, 'leave'] as const,
  leaveBalance: (staffId: string, year?: number) => [...staffKeys.leave(), 'balance', staffId, year] as const,
  leaveRequests: (filters?: { status?: string; staffId?: string }) =>
    [...staffKeys.leave(), 'requests', filters] as const,
  staffLeaveRequests: (staffId: string) => [...staffKeys.leave(), 'staff', staffId] as const,
  salary: () => [...staffKeys.all, 'salary'] as const,
  salaryStructure: (staffId: string) => [...staffKeys.salary(), 'structure', staffId] as const,
  salarySlips: (staffId: string) => [...staffKeys.salary(), 'slips', staffId] as const,
}

// ==================== STAFF CRUD HOOKS ====================

export function useStaffList(filters: StaffFilters & { page?: number; limit?: number } = {}) {
  return useQuery({
    queryKey: staffKeys.list(filters),
    queryFn: () => fetchStaff(filters),
  })
}

export function useStaffMember(id: string) {
  return useQuery({
    queryKey: staffKeys.detail(id),
    queryFn: () => fetchStaffMember(id),
    enabled: !!id,
  })
}

export function useCreateStaff() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateStaffRequest) => createStaff(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: staffKeys.lists() })
    },
  })
}

export function useUpdateStaff() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateStaffRequest }) => updateStaff(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: staffKeys.detail(variables.id) })
      queryClient.invalidateQueries({ queryKey: staffKeys.lists() })
    },
  })
}

export function useDeleteStaff() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteStaff(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: staffKeys.lists() })
    },
  })
}

// ==================== ATTENDANCE HOOKS ====================

export function useDailyAttendance(date: string) {
  return useQuery({
    queryKey: staffKeys.dailyAttendance(date),
    queryFn: () => fetchDailyAttendance(date),
    enabled: !!date,
  })
}

export function useSaveAttendance() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ date, records }: { date: string; records: BulkAttendanceRecord[] }) =>
      saveAttendance(date, records),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: staffKeys.dailyAttendance(variables.date) })
      queryClient.invalidateQueries({ queryKey: staffKeys.attendance() })
    },
  })
}

export function useStaffAttendance(staffId: string, month?: number, year?: number) {
  return useQuery({
    queryKey: staffKeys.staffAttendance(staffId, month, year),
    queryFn: () => fetchStaffAttendance(staffId, month, year),
    enabled: !!staffId,
  })
}

export function useAttendanceSummary(staffId: string, month?: number, year?: number) {
  return useQuery({
    queryKey: staffKeys.attendanceSummary(staffId, month, year),
    queryFn: () => fetchAttendanceSummary(staffId, month, year),
    enabled: !!staffId,
  })
}

// ==================== LEAVE HOOKS ====================

export function useLeaveBalance(staffId: string, year?: number) {
  return useQuery({
    queryKey: staffKeys.leaveBalance(staffId, year),
    queryFn: () => fetchLeaveBalance(staffId, year),
    enabled: !!staffId,
  })
}

export function useAllLeaveRequests(filters: { status?: string; staffId?: string } = {}) {
  return useQuery({
    queryKey: staffKeys.leaveRequests(filters),
    queryFn: () => fetchAllLeaveRequests(filters),
  })
}

export function useStaffLeaveRequests(staffId: string) {
  return useQuery({
    queryKey: staffKeys.staffLeaveRequests(staffId),
    queryFn: () => fetchStaffLeaveRequests(staffId),
    enabled: !!staffId,
  })
}

export function useCreateLeaveRequest() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ staffId, data }: { staffId: string; data: CreateLeaveRequest }) =>
      createLeaveRequest(staffId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: staffKeys.staffLeaveRequests(variables.staffId) })
      queryClient.invalidateQueries({ queryKey: staffKeys.leaveRequests() })
    },
  })
}

export function useUpdateLeaveRequest() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      requestId,
      data,
    }: {
      requestId: string
      data: { status: 'approved' | 'rejected'; rejectionReason?: string }
    }) => updateLeaveRequest(requestId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: staffKeys.leave() })
    },
  })
}

// ==================== SALARY HOOKS ====================

export function useSalaryStructure(staffId: string) {
  return useQuery({
    queryKey: staffKeys.salaryStructure(staffId),
    queryFn: () => fetchSalaryStructure(staffId),
    enabled: !!staffId,
  })
}

export function useUpdateSalaryStructure() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ staffId, data }: { staffId: string; data: Partial<SalaryStructure> }) =>
      updateSalaryStructure(staffId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: staffKeys.salaryStructure(variables.staffId) })
    },
  })
}

export function useSalarySlips(staffId: string) {
  return useQuery({
    queryKey: staffKeys.salarySlips(staffId),
    queryFn: () => fetchSalarySlips(staffId),
    enabled: !!staffId,
  })
}

export function useProcessMonthlySalary() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: ProcessSalaryRequest) => processMonthlySalary(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: staffKeys.salary() })
    },
  })
}

export function useMarkSalaryPaid() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (slipId: string) => markSalaryPaid(slipId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: staffKeys.salary() })
    },
  })
}
