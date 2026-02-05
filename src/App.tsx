import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppShell } from '@/components/layout/AppShell'
import { Toaster } from '@/components/ui/toaster'
import { useAuthStore } from '@/stores/useAuthStore'

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
import { ExamsPage, NewExamPage, ExamDetailPage, MarksEntryPage } from '@/features/exams/pages'
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
              <ProtectedRoute>
                <StudentsListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/students/new"
            element={
              <ProtectedRoute>
                <NewStudentPage />
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
          <Route
            path="/students/:id/edit"
            element={
              <ProtectedRoute>
                <EditStudentPage />
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
            path="/staff/timetable"
            element={
              <ProtectedRoute>
                <TimetableManagementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff/substitutions"
            element={
              <ProtectedRoute>
                <SubstitutionPage />
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
            path="/attendance/periods"
            element={
              <ProtectedRoute>
                <PeriodAttendancePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/attendance/alerts"
            element={
              <ProtectedRoute>
                <ShortageAlertsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/attendance/late"
            element={
              <ProtectedRoute>
                <LateDetectionPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/attendance/notifications"
            element={
              <ProtectedRoute>
                <AttendanceNotificationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/attendance/biometric"
            element={
              <ProtectedRoute>
                <BiometricPage />
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
            path="/admissions/entrance-exams"
            element={
              <ProtectedRoute>
                <EntranceExamsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admissions/waitlist"
            element={
              <ProtectedRoute>
                <WaitlistPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admissions/communications"
            element={
              <ProtectedRoute>
                <CommunicationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admissions/payments"
            element={
              <ProtectedRoute>
                <AdmissionPaymentsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admissions/analytics"
            element={
              <ProtectedRoute>
                <AdmissionAnalyticsPage />
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
            path="/library/scanner"
            element={
              <ProtectedRoute>
                <BarcodeScannerPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/library/reservations"
            element={
              <ProtectedRoute>
                <ReservationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/library/reading"
            element={
              <ProtectedRoute>
                <ReadingHistoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/library/digital"
            element={
              <ProtectedRoute>
                <DigitalLibraryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/library/notifications"
            element={
              <ProtectedRoute>
                <OverdueNotificationsPage />
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
            path="/transport/vehicles"
            element={
              <ProtectedRoute>
                <VehiclesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/transport/drivers"
            element={
              <ProtectedRoute>
                <DriversPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/transport/tracking"
            element={
              <ProtectedRoute>
                <TrackingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/transport/stops"
            element={
              <ProtectedRoute>
                <StopAssignmentsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/transport/maintenance"
            element={
              <ProtectedRoute>
                <MaintenancePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/transport/notifications"
            element={
              <ProtectedRoute>
                <TransportNotificationsPage />
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
            path="/finance/installments"
            element={
              <ProtectedRoute>
                <InstallmentPlansPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/finance/discounts"
            element={
              <ProtectedRoute>
                <DiscountRulesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/finance/concessions"
            element={
              <ProtectedRoute>
                <ConcessionsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/finance/escalation"
            element={
              <ProtectedRoute>
                <EscalationPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/finance/online-payments"
            element={
              <ProtectedRoute>
                <OnlinePaymentsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/finance/my-fees"
            element={
              <ProtectedRoute>
                <ParentFeeDashboardPage />
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

          {/* Settings */}
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings/*"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />

          {/* Integrations */}
          <Route
            path="/integrations"
            element={
              <ProtectedRoute>
                <IntegrationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/integrations/*"
            element={
              <ProtectedRoute>
                <IntegrationsPage />
              </ProtectedRoute>
            }
          />

          {/* Exams */}
          <Route
            path="/exams"
            element={
              <ProtectedRoute>
                <ExamsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/exams/new"
            element={
              <ProtectedRoute>
                <NewExamPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/exams/timetable"
            element={
              <ProtectedRoute>
                <ExamTimetablePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/exams/analytics"
            element={
              <ProtectedRoute>
                <MarksAnalyticsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/exams/progress"
            element={
              <ProtectedRoute>
                <ProgressTrackingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/exams/co-scholastic"
            element={
              <ProtectedRoute>
                <CoScholasticPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/exams/question-papers"
            element={
              <ProtectedRoute>
                <QuestionPapersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/exams/:id"
            element={
              <ProtectedRoute>
                <ExamDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/exams/:id/marks"
            element={
              <ProtectedRoute>
                <MarksEntryPage />
              </ProtectedRoute>
            }
          />

          {/* LMS */}
          <Route
            path="/lms"
            element={
              <ProtectedRoute>
                <LmsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lms/courses"
            element={
              <ProtectedRoute>
                <CoursesListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lms/courses/new"
            element={
              <ProtectedRoute>
                <NewCoursePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lms/courses/:id"
            element={
              <ProtectedRoute>
                <CourseDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lms/courses/:id/edit"
            element={
              <ProtectedRoute>
                <EditCoursePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lms/courses/:id/learn"
            element={
              <ProtectedRoute>
                <StudentCoursePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lms/live-classes"
            element={
              <ProtectedRoute>
                <LiveClassesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lms/enrollments"
            element={
              <ProtectedRoute>
                <EnrollmentsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lms/assignments"
            element={
              <ProtectedRoute>
                <AssignmentsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lms/*"
            element={
              <ProtectedRoute>
                <LmsPage />
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
