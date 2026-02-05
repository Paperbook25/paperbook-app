import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchClassAttendance,
  fetchStudentsForAttendance,
  markAttendance,
  fetchAttendanceHistory,
  fetchStudentAttendance,
  fetchMyAttendance,
  fetchMyChildrenAttendance,
  fetchAttendanceReport,
  fetchClassAttendanceSummary,
  fetchLeaveRequests,
  createLeaveRequest,
  updateLeaveRequest,
  fetchStudentLeaves,
} from '../api/attendance.api'
import type {
  MarkAttendanceRequest,
  AttendanceFilters,
  LeaveRequestCreate,
  LeaveRequestUpdate,
} from '../types/attendance.types'

// ==================== QUERY KEYS ====================

export const attendanceKeys = {
  all: ['attendance'] as const,

  // Class attendance
  classAttendance: (date: string, className: string, section: string) =>
    [...attendanceKeys.all, 'class', date, className, section] as const,
  studentsForAttendance: (className: string, section: string, date: string) =>
    [...attendanceKeys.all, 'students', className, section, date] as const,

  // History
  history: (filters: AttendanceFilters) =>
    [...attendanceKeys.all, 'history', filters] as const,

  // Student attendance
  studentAttendance: (studentId: string, academicYear?: string) =>
    [...attendanceKeys.all, 'student', studentId, academicYear] as const,
  myAttendance: (academicYear?: string) =>
    [...attendanceKeys.all, 'my', academicYear] as const,
  myChildrenAttendance: (academicYear?: string) =>
    [...attendanceKeys.all, 'my-children', academicYear] as const,

  // Reports
  report: (className: string, section: string, startDate: string, endDate: string) =>
    [...attendanceKeys.all, 'report', className, section, startDate, endDate] as const,
  summary: (className: string, section: string, month: string, year: string) =>
    [...attendanceKeys.all, 'summary', className, section, month, year] as const,

  // Leaves
  leaves: (filters?: { status?: string; className?: string; section?: string }) =>
    [...attendanceKeys.all, 'leaves', filters] as const,
  studentLeaves: (studentId: string) =>
    [...attendanceKeys.all, 'student-leaves', studentId] as const,
}

// ==================== ATTENDANCE HOOKS ====================

export function useClassAttendance(date: string, className: string, section: string) {
  return useQuery({
    queryKey: attendanceKeys.classAttendance(date, className, section),
    queryFn: () => fetchClassAttendance(date, className, section),
    enabled: !!date && !!className && !!section,
  })
}

export function useStudentsForAttendance(className: string, section: string, date: string) {
  return useQuery({
    queryKey: attendanceKeys.studentsForAttendance(className, section, date),
    queryFn: () => fetchStudentsForAttendance(className, section, date),
    enabled: !!className && !!section && !!date,
  })
}

export function useMarkAttendance() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: MarkAttendanceRequest) => markAttendance(data),
    onSuccess: (_, variables) => {
      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: attendanceKeys.classAttendance(
          variables.date,
          variables.className,
          variables.section
        ),
      })
      queryClient.invalidateQueries({
        queryKey: attendanceKeys.studentsForAttendance(
          variables.className,
          variables.section,
          variables.date
        ),
      })
    },
  })
}

export function useAttendanceHistory(filters: AttendanceFilters) {
  return useQuery({
    queryKey: attendanceKeys.history(filters),
    queryFn: () => fetchAttendanceHistory(filters),
  })
}

// ==================== STUDENT ATTENDANCE HOOKS ====================

export function useStudentAttendance(studentId: string, academicYear?: string) {
  return useQuery({
    queryKey: attendanceKeys.studentAttendance(studentId, academicYear),
    queryFn: () => fetchStudentAttendance(studentId, academicYear),
    enabled: !!studentId,
  })
}

export function useMyAttendance(academicYear?: string) {
  return useQuery({
    queryKey: attendanceKeys.myAttendance(academicYear),
    queryFn: () => fetchMyAttendance(academicYear),
  })
}

export function useMyChildrenAttendance(academicYear?: string) {
  return useQuery({
    queryKey: attendanceKeys.myChildrenAttendance(academicYear),
    queryFn: () => fetchMyChildrenAttendance(academicYear),
  })
}

// ==================== REPORT HOOKS ====================

export function useAttendanceReport(
  className: string,
  section: string,
  startDate: string,
  endDate: string
) {
  return useQuery({
    queryKey: attendanceKeys.report(className, section, startDate, endDate),
    queryFn: () => fetchAttendanceReport(className, section, startDate, endDate),
    enabled: !!className && !!section && !!startDate && !!endDate,
  })
}

export function useClassAttendanceSummary(
  className: string,
  section: string,
  month: string,
  year: string
) {
  return useQuery({
    queryKey: attendanceKeys.summary(className, section, month, year),
    queryFn: () => fetchClassAttendanceSummary(className, section, month, year),
    enabled: !!className && !!section && !!month && !!year,
  })
}

// ==================== LEAVE HOOKS ====================

export function useLeaveRequests(filters?: {
  status?: string
  className?: string
  section?: string
}) {
  return useQuery({
    queryKey: attendanceKeys.leaves(filters),
    queryFn: () => fetchLeaveRequests(filters),
  })
}

export function useCreateLeaveRequest() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: LeaveRequestCreate) => createLeaveRequest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance', 'leaves'] })
    },
  })
}

export function useUpdateLeaveRequest() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: LeaveRequestUpdate }) =>
      updateLeaveRequest(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance', 'leaves'] })
    },
  })
}

export function useStudentLeaves(studentId: string) {
  return useQuery({
    queryKey: attendanceKeys.studentLeaves(studentId),
    queryFn: () => fetchStudentLeaves(studentId),
    enabled: !!studentId,
  })
}
