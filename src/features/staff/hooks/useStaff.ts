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
  fetchStaffTimetable,
  fetchClassTimetable,
  createTimetableEntry,
  deleteTimetableEntry,
  fetchSubstitutions,
  createSubstitution,
  updateSubstitutionStatus,
  fetchPerformanceReviews,
  fetchStaffPerformanceReviews,
  createPerformanceReview,
  acknowledgeReview,
  fetchStaffPD,
  fetchAllPD,
  createPD,
  updatePD,
  deletePD,
} from '../api/staff.api'
import type {
  StaffFilters,
  CreateStaffRequest,
  UpdateStaffRequest,
  BulkAttendanceRecord,
  CreateLeaveRequest,
  ProcessSalaryRequest,
  SalaryStructure,
  TimetableEntry,
  CreateSubstitutionRequest,
  CreatePerformanceReview,
  CreatePDRequest,
  ProfessionalDevelopment,
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
  timetable: () => [...staffKeys.all, 'timetable'] as const,
  staffTimetable: (staffId: string) => [...staffKeys.timetable(), 'staff', staffId] as const,
  classTimetable: (cls: string, section: string) => [...staffKeys.timetable(), 'class', cls, section] as const,
  substitutions: (filters?: { date?: string; status?: string }) => [...staffKeys.all, 'substitutions', filters] as const,
  performanceReviews: (filters?: { staffId?: string; period?: string; year?: number }) =>
    [...staffKeys.all, 'performance-reviews', filters] as const,
  staffPerformanceReviews: (staffId: string) => [...staffKeys.all, 'performance-reviews', 'staff', staffId] as const,
  professionalDev: () => [...staffKeys.all, 'professional-development'] as const,
  staffPD: (staffId: string) => [...staffKeys.professionalDev(), 'staff', staffId] as const,
  allPD: (filters?: { type?: string; status?: string }) => [...staffKeys.professionalDev(), 'all', filters] as const,
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

// ==================== TIMETABLE HOOKS ====================

export function useStaffTimetable(staffId: string) {
  return useQuery({
    queryKey: staffKeys.staffTimetable(staffId),
    queryFn: () => fetchStaffTimetable(staffId),
    enabled: !!staffId,
  })
}

export function useClassTimetable(cls: string, section: string) {
  return useQuery({
    queryKey: staffKeys.classTimetable(cls, section),
    queryFn: () => fetchClassTimetable(cls, section),
    enabled: !!cls && !!section,
  })
}

export function useCreateTimetableEntry() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Omit<TimetableEntry, 'id' | 'staffName'>) => createTimetableEntry(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: staffKeys.timetable() })
    },
  })
}

export function useDeleteTimetableEntry() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteTimetableEntry(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: staffKeys.timetable() })
    },
  })
}

// ==================== SUBSTITUTION HOOKS ====================

export function useSubstitutions(filters?: { date?: string; status?: string }) {
  return useQuery({
    queryKey: staffKeys.substitutions(filters),
    queryFn: () => fetchSubstitutions(filters),
  })
}

export function useCreateSubstitution() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateSubstitutionRequest) => createSubstitution(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: staffKeys.substitutions() })
    },
  })
}

export function useUpdateSubstitutionStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => updateSubstitutionStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: staffKeys.substitutions() })
    },
  })
}

// ==================== PERFORMANCE REVIEW HOOKS ====================

export function usePerformanceReviews(filters?: { staffId?: string; period?: string; year?: number }) {
  return useQuery({
    queryKey: staffKeys.performanceReviews(filters),
    queryFn: () => fetchPerformanceReviews(filters),
  })
}

export function useStaffPerformanceReviews(staffId: string) {
  return useQuery({
    queryKey: staffKeys.staffPerformanceReviews(staffId),
    queryFn: () => fetchStaffPerformanceReviews(staffId),
    enabled: !!staffId,
  })
}

export function useCreatePerformanceReview() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreatePerformanceReview) => createPerformanceReview(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: staffKeys.performanceReviews() })
    },
  })
}

export function useAcknowledgeReview() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => acknowledgeReview(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: staffKeys.performanceReviews() })
    },
  })
}

// ==================== PROFESSIONAL DEVELOPMENT HOOKS ====================

export function useStaffPD(staffId: string) {
  return useQuery({
    queryKey: staffKeys.staffPD(staffId),
    queryFn: () => fetchStaffPD(staffId),
    enabled: !!staffId,
  })
}

export function useAllPD(filters?: { type?: string; status?: string }) {
  return useQuery({
    queryKey: staffKeys.allPD(filters),
    queryFn: () => fetchAllPD(filters),
  })
}

export function useCreatePD() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ staffId, data }: { staffId: string; data: Omit<CreatePDRequest, 'staffId'> }) =>
      createPD(staffId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: staffKeys.staffPD(variables.staffId) })
      queryClient.invalidateQueries({ queryKey: staffKeys.allPD() })
    },
  })
}

export function useUpdatePD() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ProfessionalDevelopment> }) => updatePD(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: staffKeys.professionalDev() })
    },
  })
}

export function useDeletePD() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deletePD(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: staffKeys.professionalDev() })
    },
  })
}
