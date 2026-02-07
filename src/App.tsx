import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppShell } from '@/components/layout/AppShell'
import { Toaster } from '@/components/ui/toaster'
import { useAuthStore } from '@/stores/useAuthStore'
import { RoleProtectedRoute, ALL_ROLES } from '@/components/auth/RoleProtectedRoute'

// Pages
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage'
import { StudentDashboard } from '@/features/dashboard/pages/StudentDashboard'
import { ParentDashboard } from '@/features/dashboard/pages/ParentDashboard'
import { TeacherDashboard } from '@/features/dashboard/pages/TeacherDashboard'
import { StudentsListPage } from '@/features/students/pages/StudentsListPage'
import { StudentDetailPage } from '@/features/students/pages/StudentDetailPage'
import { NewStudentPage } from '@/features/students/pages/NewStudentPage'
import { EditStudentPage } from '@/features/students/pages/EditStudentPage'
import { StaffListPage } from '@/features/staff/pages/StaffListPage'
import { StaffDetailPage } from '@/features/staff/pages/StaffDetailPage'
import { NewStaffPage } from '@/features/staff/pages/NewStaffPage'
import { EditStaffPage } from '@/features/staff/pages/EditStaffPage'
import { StaffAttendancePage } from '@/features/staff/pages/StaffAttendancePage'
import { LeaveManagementPage } from '@/features/staff/pages/LeaveManagementPage'
import { SalaryManagementPage } from '@/features/staff/pages/SalaryManagementPage'
import { TimetableManagementPage } from '@/features/staff/pages/TimetableManagementPage'
import { SubstitutionPage } from '@/features/staff/pages/SubstitutionPage'
import { AttendancePage } from '@/features/attendance/pages/AttendancePage'
import { AdmissionsPage } from '@/features/admissions/pages/AdmissionsPage'
import { ApplicationsListPage } from '@/features/admissions/pages/ApplicationsListPage'
import { ApplicationDetailPage } from '@/features/admissions/pages/ApplicationDetailPage'
import { NewApplicationPage } from '@/features/admissions/pages/NewApplicationPage'
import { LibraryPage } from '@/features/library/pages/LibraryPage'
import { BarcodeScannerPage } from '@/features/library/pages/BarcodeScannerPage'
import { ReservationsPage } from '@/features/library/pages/ReservationsPage'
import { ReadingHistoryPage } from '@/features/library/pages/ReadingHistoryPage'
import { DigitalLibraryPage } from '@/features/library/pages/DigitalLibraryPage'
import { OverdueNotificationsPage } from '@/features/library/pages/OverdueNotificationsPage'
import { TransportPage } from '@/features/transport/pages/TransportPage'
import { VehiclesPage } from '@/features/transport/pages/VehiclesPage'
import { DriversPage } from '@/features/transport/pages/DriversPage'
import { TrackingPage } from '@/features/transport/pages/TrackingPage'
import { StopAssignmentsPage } from '@/features/transport/pages/StopAssignmentsPage'
import { MaintenancePage } from '@/features/transport/pages/MaintenancePage'
import { TransportNotificationsPage } from '@/features/transport/pages/TransportNotificationsPage'
import { FinancePage } from '@/features/finance/pages/FinancePage'
import { InstallmentPlansPage } from '@/features/finance/pages/InstallmentPlansPage'
import { DiscountRulesPage } from '@/features/finance/pages/DiscountRulesPage'
import { ConcessionsPage } from '@/features/finance/pages/ConcessionsPage'
import { EscalationPage } from '@/features/finance/pages/EscalationPage'
import { OnlinePaymentsPage } from '@/features/finance/pages/OnlinePaymentsPage'
import { ParentFeeDashboardPage } from '@/features/finance/pages/ParentFeeDashboardPage'
import { SettingsPage } from '@/features/settings/pages/SettingsPage'
import { IntegrationsPage } from '@/features/integrations/pages/IntegrationsPage'
import { ExamsPage, NewExamPage, EditExamPage, ExamDetailPage, MarksEntryPage } from '@/features/exams/pages'
import { ExamTimetablePage } from '@/features/exams/pages/ExamTimetablePage'
import { MarksAnalyticsPage } from '@/features/exams/pages/MarksAnalyticsPage'
import { ProgressTrackingPage } from '@/features/exams/pages/ProgressTrackingPage'
import { CoScholasticPage } from '@/features/exams/pages/CoScholasticPage'
import { QuestionPapersPage } from '@/features/exams/pages/QuestionPapersPage'
import { EntranceExamsPage } from '@/features/admissions/pages/EntranceExamsPage'
import { WaitlistPage } from '@/features/admissions/pages/WaitlistPage'
import { CommunicationsPage } from '@/features/admissions/pages/CommunicationsPage'
import { AdmissionPaymentsPage } from '@/features/admissions/pages/AdmissionPaymentsPage'
import { AdmissionAnalyticsPage } from '@/features/admissions/pages/AdmissionAnalyticsPage'
import { PublicApplicationPage } from '@/features/admissions/pages/PublicApplicationPage'
import { PeriodAttendancePage } from '@/features/attendance/pages/PeriodAttendancePage'
import { ShortageAlertsPage } from '@/features/attendance/pages/ShortageAlertsPage'
import { LateDetectionPage } from '@/features/attendance/pages/LateDetectionPage'
import { AttendanceNotificationsPage } from '@/features/attendance/pages/NotificationsPage'
import { BiometricPage } from '@/features/attendance/pages/BiometricPage'
import { LmsPage } from '@/features/lms/pages/LmsPage'
import { CoursesListPage } from '@/features/lms/pages/CoursesListPage'
import { NewCoursePage } from '@/features/lms/pages/NewCoursePage'
import { CourseDetailPage } from '@/features/lms/pages/CourseDetailPage'
import { EditCoursePage } from '@/features/lms/pages/EditCoursePage'
import { StudentCoursePage } from '@/features/lms/pages/StudentCoursePage'
import { LiveClassesPage } from '@/features/lms/pages/LiveClassesPage'
import { EnrollmentsPage } from '@/features/lms/pages/EnrollmentsPage'
import { AssignmentsPage } from '@/features/lms/pages/AssignmentsPage'

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

// Role-based dashboard selector
function RoleDashboard() {
  const { user } = useAuthStore()

  if (user?.role === 'student') {
    return <StudentDashboard />
  }

  if (user?.role === 'parent') {
    return <ParentDashboard />
  }

  if (user?.role === 'teacher') {
    return <TeacherDashboard />
  }

  // Default to admin/staff dashboard
  return <DashboardPage />
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Toaster />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/apply" element={<PublicApplicationPage />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <RoleDashboard />
              </ProtectedRoute>
            }
          />

          {/* Students */}
          <Route
            path="/students"
            element={
              <RoleProtectedRoute allowedRoles={['admin', 'principal', 'teacher']}>
                <StudentsListPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/students/new"
            element={
              <RoleProtectedRoute allowedRoles={['admin', 'principal', 'teacher']}>
                <NewStudentPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/students/:id"
            element={
              <RoleProtectedRoute allowedRoles={['admin', 'principal', 'teacher']}>
                <StudentDetailPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/students/:id/edit"
            element={
              <RoleProtectedRoute allowedRoles={['admin', 'principal', 'teacher']}>
                <EditStudentPage />
              </RoleProtectedRoute>
            }
          />

          {/* Staff */}
          <Route
            path="/staff"
            element={
              <RoleProtectedRoute allowedRoles={['admin', 'principal']}>
                <StaffListPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/staff/new"
            element={
              <RoleProtectedRoute allowedRoles={['admin', 'principal']}>
                <NewStaffPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/staff/attendance"
            element={
              <RoleProtectedRoute allowedRoles={['admin', 'principal']}>
                <StaffAttendancePage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/staff/leave"
            element={
              <RoleProtectedRoute allowedRoles={['admin', 'principal']}>
                <LeaveManagementPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/staff/salary"
            element={
              <RoleProtectedRoute allowedRoles={['admin', 'principal']}>
                <SalaryManagementPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/staff/timetable"
            element={
              <RoleProtectedRoute allowedRoles={['admin', 'principal']}>
                <TimetableManagementPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/staff/substitutions"
            element={
              <RoleProtectedRoute allowedRoles={['admin', 'principal']}>
                <SubstitutionPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/staff/:id"
            element={
              <RoleProtectedRoute allowedRoles={['admin', 'principal']}>
                <StaffDetailPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/staff/:id/edit"
            element={
              <RoleProtectedRoute allowedRoles={['admin', 'principal']}>
                <EditStaffPage />
              </RoleProtectedRoute>
            }
          />

          {/* Attendance */}
          <Route
            path="/attendance"
            element={
              <RoleProtectedRoute allowedRoles={ALL_ROLES}>
                <AttendancePage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/attendance/periods"
            element={
              <RoleProtectedRoute allowedRoles={ALL_ROLES}>
                <PeriodAttendancePage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/attendance/alerts"
            element={
              <RoleProtectedRoute allowedRoles={ALL_ROLES}>
                <ShortageAlertsPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/attendance/late"
            element={
              <RoleProtectedRoute allowedRoles={ALL_ROLES}>
                <LateDetectionPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/attendance/notifications"
            element={
              <RoleProtectedRoute allowedRoles={ALL_ROLES}>
                <AttendanceNotificationsPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/attendance/biometric"
            element={
              <RoleProtectedRoute allowedRoles={ALL_ROLES}>
                <BiometricPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/attendance/*"
            element={
              <RoleProtectedRoute allowedRoles={ALL_ROLES}>
                <AttendancePage />
              </RoleProtectedRoute>
            }
          />

          {/* Admissions */}
          <Route
            path="/admissions"
            element={
              <RoleProtectedRoute allowedRoles={['admin', 'principal']}>
                <ApplicationsListPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/admissions/pipeline"
            element={
              <RoleProtectedRoute allowedRoles={['admin', 'principal']}>
                <AdmissionsPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/admissions/new"
            element={
              <RoleProtectedRoute allowedRoles={['admin', 'principal']}>
                <NewApplicationPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/admissions/entrance-exams"
            element={
              <RoleProtectedRoute allowedRoles={['admin', 'principal']}>
                <EntranceExamsPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/admissions/waitlist"
            element={
              <RoleProtectedRoute allowedRoles={['admin', 'principal']}>
                <WaitlistPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/admissions/communications"
            element={
              <RoleProtectedRoute allowedRoles={['admin', 'principal']}>
                <CommunicationsPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/admissions/payments"
            element={
              <RoleProtectedRoute allowedRoles={['admin', 'principal']}>
                <AdmissionPaymentsPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/admissions/analytics"
            element={
              <RoleProtectedRoute allowedRoles={['admin', 'principal']}>
                <AdmissionAnalyticsPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/admissions/:id"
            element={
              <RoleProtectedRoute allowedRoles={['admin', 'principal']}>
                <ApplicationDetailPage />
              </RoleProtectedRoute>
            }
          />

          {/* Library */}
          <Route
            path="/library"
            element={
              <RoleProtectedRoute allowedRoles={['admin', 'principal', 'librarian', 'teacher', 'student']}>
                <LibraryPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/library/scanner"
            element={
              <RoleProtectedRoute allowedRoles={['admin', 'principal', 'librarian', 'teacher', 'student']}>
                <BarcodeScannerPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/library/reservations"
            element={
              <RoleProtectedRoute allowedRoles={['admin', 'principal', 'librarian', 'teacher', 'student']}>
                <ReservationsPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/library/reading"
            element={
              <RoleProtectedRoute allowedRoles={['admin', 'principal', 'librarian', 'teacher', 'student']}>
                <ReadingHistoryPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/library/digital"
            element={
              <RoleProtectedRoute allowedRoles={['admin', 'principal', 'librarian', 'teacher', 'student']}>
                <DigitalLibraryPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/library/notifications"
            element={
              <RoleProtectedRoute allowedRoles={['admin', 'principal', 'librarian', 'teacher', 'student']}>
                <OverdueNotificationsPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/library/*"
            element={
              <RoleProtectedRoute allowedRoles={['admin', 'principal', 'librarian', 'teacher', 'student']}>
                <LibraryPage />
              </RoleProtectedRoute>
            }
          />

          {/* Transport */}
          <Route
            path="/transport"
            element={
              <RoleProtectedRoute allowedRoles={['admin', 'principal', 'transport_manager', 'parent']}>
                <TransportPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/transport/vehicles"
            element={
              <RoleProtectedRoute allowedRoles={['admin', 'principal', 'transport_manager', 'parent']}>
                <VehiclesPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/transport/drivers"
            element={
              <RoleProtectedRoute allowedRoles={['admin', 'principal', 'transport_manager', 'parent']}>
                <DriversPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/transport/tracking"
            element={
              <RoleProtectedRoute allowedRoles={['admin', 'principal', 'transport_manager', 'parent']}>
                <TrackingPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/transport/stops"
            element={
              <RoleProtectedRoute allowedRoles={['admin', 'principal', 'transport_manager', 'parent']}>
                <StopAssignmentsPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/transport/maintenance"
            element={
              <RoleProtectedRoute allowedRoles={['admin', 'principal', 'transport_manager', 'parent']}>
                <MaintenancePage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/transport/notifications"
            element={
              <RoleProtectedRoute allowedRoles={['admin', 'principal', 'transport_manager', 'parent']}>
                <TransportNotificationsPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/transport/*"
            element={
              <RoleProtectedRoute allowedRoles={['admin', 'principal', 'transport_manager', 'parent']}>
                <TransportPage />
              </RoleProtectedRoute>
            }
          />

          {/* Finance */}
          <Route
            path="/finance"
            element={
              <RoleProtectedRoute allowedRoles={['admin', 'principal', 'accountant', 'parent']}>
                <FinancePage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/finance/installments"
            element={
              <RoleProtectedRoute allowedRoles={['admin', 'principal', 'accountant', 'parent']}>
                <InstallmentPlansPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/finance/discounts"
            element={
              <RoleProtectedRoute allowedRoles={['admin', 'principal', 'accountant', 'parent']}>
                <DiscountRulesPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/finance/concessions"
            element={
              <RoleProtectedRoute allowedRoles={['admin', 'principal', 'accountant', 'parent']}>
                <ConcessionsPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/finance/escalation"
            element={
              <RoleProtectedRoute allowedRoles={['admin', 'principal', 'accountant', 'parent']}>
                <EscalationPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/finance/online-payments"
            element={
              <RoleProtectedRoute allowedRoles={['admin', 'principal', 'accountant', 'parent']}>
                <OnlinePaymentsPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/finance/my-fees"
            element={
              <RoleProtectedRoute allowedRoles={['admin', 'principal', 'accountant', 'parent']}>
                <ParentFeeDashboardPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/finance/*"
            element={
              <RoleProtectedRoute allowedRoles={['admin', 'principal', 'accountant', 'parent']}>
                <FinancePage />
              </RoleProtectedRoute>
            }
          />

          {/* Settings */}
          <Route
            path="/settings"
            element={
              <RoleProtectedRoute allowedRoles={['admin', 'principal']}>
                <SettingsPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/settings/*"
            element={
              <RoleProtectedRoute allowedRoles={['admin', 'principal']}>
                <SettingsPage />
              </RoleProtectedRoute>
            }
          />

          {/* Integrations */}
          <Route
            path="/integrations"
            element={
              <RoleProtectedRoute allowedRoles={['admin', 'principal']}>
                <IntegrationsPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/integrations/*"
            element={
              <RoleProtectedRoute allowedRoles={['admin', 'principal']}>
                <IntegrationsPage />
              </RoleProtectedRoute>
            }
          />

          {/* Exams */}
          <Route
            path="/exams"
            element={
              <RoleProtectedRoute allowedRoles={['admin', 'principal', 'teacher', 'student', 'parent']}>
                <ExamsPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/exams/new"
            element={
              <RoleProtectedRoute allowedRoles={['admin', 'principal', 'teacher', 'student', 'parent']}>
                <NewExamPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/exams/timetable"
            element={
              <RoleProtectedRoute allowedRoles={['admin', 'principal', 'teacher', 'student', 'parent']}>
                <ExamTimetablePage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/exams/analytics"
            element={
              <RoleProtectedRoute allowedRoles={['admin', 'principal', 'teacher', 'student', 'parent']}>
                <MarksAnalyticsPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/exams/progress"
            element={
              <RoleProtectedRoute allowedRoles={['admin', 'principal', 'teacher', 'student', 'parent']}>
                <ProgressTrackingPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/exams/co-scholastic"
            element={
              <RoleProtectedRoute allowedRoles={['admin', 'principal', 'teacher', 'student', 'parent']}>
                <CoScholasticPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/exams/question-papers"
            element={
              <RoleProtectedRoute allowedRoles={['admin', 'principal', 'teacher', 'student', 'parent']}>
                <QuestionPapersPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/exams/:id/edit"
            element={
              <RoleProtectedRoute allowedRoles={['admin', 'principal', 'teacher', 'student', 'parent']}>
                <EditExamPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/exams/:id"
            element={
              <RoleProtectedRoute allowedRoles={['admin', 'principal', 'teacher', 'student', 'parent']}>
                <ExamDetailPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/exams/:id/marks"
            element={
              <RoleProtectedRoute allowedRoles={['admin', 'principal', 'teacher', 'student', 'parent']}>
                <MarksEntryPage />
              </RoleProtectedRoute>
            }
          />

          {/* LMS */}
          <Route
            path="/lms"
            element={
              <RoleProtectedRoute allowedRoles={ALL_ROLES}>
                <LmsPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/lms/courses"
            element={
              <RoleProtectedRoute allowedRoles={ALL_ROLES}>
                <CoursesListPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/lms/courses/new"
            element={
              <RoleProtectedRoute allowedRoles={ALL_ROLES}>
                <NewCoursePage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/lms/courses/:id"
            element={
              <RoleProtectedRoute allowedRoles={ALL_ROLES}>
                <CourseDetailPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/lms/courses/:id/edit"
            element={
              <RoleProtectedRoute allowedRoles={ALL_ROLES}>
                <EditCoursePage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/lms/courses/:id/learn"
            element={
              <RoleProtectedRoute allowedRoles={ALL_ROLES}>
                <StudentCoursePage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/lms/live-classes"
            element={
              <RoleProtectedRoute allowedRoles={ALL_ROLES}>
                <LiveClassesPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/lms/enrollments"
            element={
              <RoleProtectedRoute allowedRoles={ALL_ROLES}>
                <EnrollmentsPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/lms/assignments"
            element={
              <RoleProtectedRoute allowedRoles={ALL_ROLES}>
                <AssignmentsPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/lms/*"
            element={
              <RoleProtectedRoute allowedRoles={ALL_ROLES}>
                <LmsPage />
              </RoleProtectedRoute>
            }
          />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
