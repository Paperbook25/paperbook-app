import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppShell } from '@/components/layout/AppShell'
import { Toaster } from '@/components/ui/toaster'
import { useAuthStore } from '@/stores/useAuthStore'

// Pages
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage'
import { StudentsListPage } from '@/features/students/pages/StudentsListPage'
import { StudentDetailPage } from '@/features/students/pages/StudentDetailPage'
import { StaffListPage } from '@/features/staff/pages/StaffListPage'
import { StaffDetailPage } from '@/features/staff/pages/StaffDetailPage'
import { NewStaffPage } from '@/features/staff/pages/NewStaffPage'
import { EditStaffPage } from '@/features/staff/pages/EditStaffPage'
import { StaffAttendancePage } from '@/features/staff/pages/StaffAttendancePage'
import { LeaveManagementPage } from '@/features/staff/pages/LeaveManagementPage'
import { SalaryManagementPage } from '@/features/staff/pages/SalaryManagementPage'
import { AttendancePage } from '@/features/attendance/pages/AttendancePage'
import { AdmissionsPage } from '@/features/admissions/pages/AdmissionsPage'
import { ApplicationsListPage } from '@/features/admissions/pages/ApplicationsListPage'
import { ApplicationDetailPage } from '@/features/admissions/pages/ApplicationDetailPage'
import { NewApplicationPage } from '@/features/admissions/pages/NewApplicationPage'
import { LibraryPage } from '@/features/library/pages/LibraryPage'
import { TransportPage } from '@/features/transport/pages/TransportPage'
import { FinancePage } from '@/features/finance/pages/FinancePage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
})

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <AppShell>{children}</AppShell>
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Toaster />
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Students */}
          <Route
            path="/students"
            element={
              <ProtectedRoute>
                <StudentsListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/students/:id"
            element={
              <ProtectedRoute>
                <StudentDetailPage />
              </ProtectedRoute>
            }
          />

          {/* Staff */}
          <Route
            path="/staff"
            element={
              <ProtectedRoute>
                <StaffListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff/new"
            element={
              <ProtectedRoute>
                <NewStaffPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff/attendance"
            element={
              <ProtectedRoute>
                <StaffAttendancePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff/leave"
            element={
              <ProtectedRoute>
                <LeaveManagementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff/salary"
            element={
              <ProtectedRoute>
                <SalaryManagementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff/:id"
            element={
              <ProtectedRoute>
                <StaffDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff/:id/edit"
            element={
              <ProtectedRoute>
                <EditStaffPage />
              </ProtectedRoute>
            }
          />

          {/* Attendance */}
          <Route
            path="/attendance"
            element={
              <ProtectedRoute>
                <AttendancePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/attendance/*"
            element={
              <ProtectedRoute>
                <AttendancePage />
              </ProtectedRoute>
            }
          />

          {/* Admissions */}
          <Route
            path="/admissions"
            element={
              <ProtectedRoute>
                <ApplicationsListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admissions/pipeline"
            element={
              <ProtectedRoute>
                <AdmissionsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admissions/new"
            element={
              <ProtectedRoute>
                <NewApplicationPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admissions/:id"
            element={
              <ProtectedRoute>
                <ApplicationDetailPage />
              </ProtectedRoute>
            }
          />

          {/* Library */}
          <Route
            path="/library"
            element={
              <ProtectedRoute>
                <LibraryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/library/*"
            element={
              <ProtectedRoute>
                <LibraryPage />
              </ProtectedRoute>
            }
          />

          {/* Transport */}
          <Route
            path="/transport"
            element={
              <ProtectedRoute>
                <TransportPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/transport/*"
            element={
              <ProtectedRoute>
                <TransportPage />
              </ProtectedRoute>
            }
          />

          {/* Finance */}
          <Route
            path="/finance"
            element={
              <ProtectedRoute>
                <FinancePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/finance/*"
            element={
              <ProtectedRoute>
                <FinancePage />
              </ProtectedRoute>
            }
          />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
