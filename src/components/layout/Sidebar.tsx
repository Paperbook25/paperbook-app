import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  UserPlus,
  GraduationCap,
  Users,
  ClipboardCheck,
  ClipboardList,
  BookOpen,
  Bus,
  MonitorPlay,
  IndianRupee,
  Settings,
  Plug,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useUIStore } from '@/stores/useUIStore'
import { useAuthStore } from '@/stores/useAuthStore'
import type { Role } from '@/types/common.types'
import { useState } from 'react'

interface NavItem {
  name: string
  href: string
  icon: LucideIcon
  roles: Role[]
  children?: { name: string; href: string }[]
}

const navigation: NavItem[] = [
  {
    name: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
    roles: ['admin', 'principal', 'teacher', 'accountant', 'librarian', 'transport_manager', 'student', 'parent'],
  },
  {
    name: 'Admissions',
    href: '/admissions',
    icon: UserPlus,
    roles: ['admin', 'principal'],
    children: [
      { name: 'All Applications', href: '/admissions' },
      { name: 'Pipeline', href: '/admissions/pipeline' },
      { name: 'New Application', href: '/admissions/new' },
      { name: 'Entrance Exams', href: '/admissions/entrance-exams' },
      { name: 'Waitlist', href: '/admissions/waitlist' },
      { name: 'Communications', href: '/admissions/communications' },
      { name: 'Payments', href: '/admissions/payments' },
      { name: 'Analytics', href: '/admissions/analytics' },
    ],
  },
  {
    name: 'Students',
    href: '/students',
    icon: GraduationCap,
    roles: ['admin', 'principal', 'teacher'],
  },
  {
    name: 'Staff',
    href: '/staff',
    icon: Users,
    roles: ['admin', 'principal'],
    children: [
      { name: 'All Staff', href: '/staff' },
      { name: 'Add Staff', href: '/staff/new' },
      { name: 'Attendance', href: '/staff/attendance' },
      { name: 'Leave Management', href: '/staff/leave' },
      { name: 'Salary & Payroll', href: '/staff/salary' },
      { name: 'Timetable', href: '/staff/timetable' },
      { name: 'Substitutions', href: '/staff/substitutions' },
    ],
  },
  {
    name: 'Attendance',
    href: '/attendance',
    icon: ClipboardCheck,
    roles: ['admin', 'principal', 'teacher'],
    children: [
      { name: 'Mark Attendance', href: '/attendance' },
      { name: 'Period-wise', href: '/attendance/periods' },
      { name: 'Reports', href: '/attendance?tab=reports' },
      { name: 'Leave Management', href: '/attendance?tab=leave' },
      { name: 'Shortage Alerts', href: '/attendance/alerts' },
      { name: 'Late Detection', href: '/attendance/late' },
      { name: 'Notifications', href: '/attendance/notifications' },
      { name: 'Biometric Devices', href: '/attendance/biometric' },
    ],
  },
  // Student/Parent specific attendance view
  {
    name: 'My Attendance',
    href: '/attendance',
    icon: ClipboardCheck,
    roles: ['student', 'parent'],
  },
  {
    name: 'Library',
    href: '/library',
    icon: BookOpen,
    roles: ['admin', 'principal', 'librarian', 'teacher', 'student'],
    children: [
      { name: 'Catalog', href: '/library' },
      { name: 'Issued Books', href: '/library?tab=issued' },
      { name: 'Reservations', href: '/library/reservations' },
      { name: 'Scanner', href: '/library/scanner' },
      { name: 'Digital Library', href: '/library/digital' },
      { name: 'Reading History', href: '/library/reading' },
      { name: 'Notifications', href: '/library/notifications' },
      { name: 'Fines', href: '/library?tab=fines' },
    ],
  },
  {
    name: 'LMS',
    href: '/lms',
    icon: MonitorPlay,
    roles: ['admin', 'principal', 'teacher', 'student', 'parent'],
    children: [
      { name: 'Dashboard', href: '/lms' },
      { name: 'Courses', href: '/lms/courses' },
      { name: 'Live Classes', href: '/lms/live-classes' },
      { name: 'Enrollments', href: '/lms/enrollments' },
      { name: 'Assignments', href: '/lms/assignments' },
    ],
  },
  {
    name: 'Transport',
    href: '/transport',
    icon: Bus,
    roles: ['admin', 'principal', 'transport_manager'],
    children: [
      { name: 'Routes', href: '/transport' },
      { name: 'Vehicles', href: '/transport/vehicles' },
      { name: 'Drivers', href: '/transport/drivers' },
      { name: 'Stop Assignments', href: '/transport/stops' },
      { name: 'Live Tracking', href: '/transport/tracking' },
      { name: 'Maintenance', href: '/transport/maintenance' },
      { name: 'Notifications', href: '/transport/notifications' },
    ],
  },
  // Parent-specific transport view
  {
    name: 'Bus Tracking',
    href: '/transport/tracking',
    icon: Bus,
    roles: ['parent'],
  },
  {
    name: 'Exams',
    href: '/exams',
    icon: ClipboardList,
    roles: ['admin', 'principal', 'teacher'],
    children: [
      { name: 'All Exams', href: '/exams' },
      { name: 'Timetable', href: '/exams/timetable' },
      { name: 'Marks Entry', href: '/exams?tab=marks' },
      { name: 'Analytics', href: '/exams/analytics' },
      { name: 'Progress', href: '/exams/progress' },
      { name: 'Co-Scholastic', href: '/exams/co-scholastic' },
      { name: 'Question Papers', href: '/exams/question-papers' },
      { name: 'Report Cards', href: '/exams?tab=reports' },
      { name: 'Grade Settings', href: '/exams?tab=grades' },
    ],
  },
  // Student/Parent exam results view
  {
    name: 'My Results',
    href: '/exams?tab=reports',
    icon: ClipboardList,
    roles: ['student', 'parent'],
  },
  {
    name: 'Finance',
    href: '/finance',
    icon: IndianRupee,
    roles: ['admin', 'principal', 'accountant'],
    children: [
      { name: 'Fee Structure', href: '/finance' },
      { name: 'Collection', href: '/finance?tab=collection' },
      { name: 'Payments', href: '/finance?tab=payments' },
      { name: 'Installments', href: '/finance/installments' },
      { name: 'Discounts', href: '/finance/discounts' },
      { name: 'Concessions', href: '/finance/concessions' },
      { name: 'Online Payments', href: '/finance/online-payments' },
      { name: 'Escalation', href: '/finance/escalation' },
      { name: 'Reports', href: '/finance?tab=reports' },
    ],
  },
  // Parent-specific fees view
  {
    name: 'Fees',
    href: '/finance/my-fees',
    icon: IndianRupee,
    roles: ['parent'],
  },
  {
    name: 'Integrations',
    href: '/integrations',
    icon: Plug,
    roles: ['admin', 'principal'],
    children: [
      { name: 'SMS Gateway', href: '/integrations?tab=sms' },
      { name: 'Email Service', href: '/integrations?tab=email' },
      { name: 'Payment Gateway', href: '/integrations?tab=payment' },
      { name: 'Biometric Devices', href: '/integrations?tab=biometric' },
      { name: 'Webhooks', href: '/integrations?tab=webhooks' },
      { name: 'API Keys', href: '/integrations?tab=api-keys' },
    ],
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
    roles: ['admin', 'principal'],
    children: [
      { name: 'School Profile', href: '/settings' },
      { name: 'Academic Year', href: '/settings?tab=academic' },
      { name: 'Calendar', href: '/settings?tab=calendar' },
      { name: 'Classes', href: '/settings?tab=classes' },
      { name: 'Users', href: '/settings?tab=users' },
      { name: 'Email Templates', href: '/settings?tab=templates' },
      { name: 'Audit Log', href: '/settings?tab=audit' },
    ],
  },
]

function NavItem({ item, collapsed }: { item: NavItem; collapsed: boolean }) {
  const location = useLocation()
  const [expanded, setExpanded] = useState(false)
  const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + '/')
  const hasChildren = item.children && item.children.length > 0

  const content = (
    <div>
      <Link
        to={hasChildren ? '#' : item.href}
        onClick={(e) => {
          if (hasChildren) {
            e.preventDefault()
            setExpanded(!expanded)
          }
        }}
        className={cn(
          'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
          isActive
            ? 'bg-primary text-primary-foreground'
            : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
          collapsed && 'justify-center px-2'
        )}
      >
        <item.icon className="h-5 w-5 shrink-0" />
        {!collapsed && (
          <>
            <span className="flex-1">{item.name}</span>
            {hasChildren && (
              <ChevronDown
                className={cn(
                  'h-4 w-4 transition-transform',
                  expanded && 'rotate-180'
                )}
              />
            )}
          </>
        )}
      </Link>

      {hasChildren && expanded && !collapsed && (
        <div className="ml-4 mt-1 space-y-1 border-l pl-4">
          {item.children?.map((child) => (
            <Link
              key={child.href}
              to={child.href}
              className={cn(
                'block rounded-lg px-3 py-1.5 text-sm transition-colors',
                location.pathname === child.href
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                  : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              )}
            >
              {child.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  )

  if (collapsed) {
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent side="right" className="flex items-center gap-4">
          {item.name}
        </TooltipContent>
      </Tooltip>
    )
  }

  return content
}

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useUIStore()
  const { hasRole } = useAuthStore()

  const filteredNav = navigation.filter((item) => hasRole(item.roles))

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 flex h-screen flex-col border-r bg-sidebar transition-all duration-300',
        sidebarCollapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b px-4">
        {!sidebarCollapsed && (
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.svg" alt="PaperBook" className="h-8 w-8" />
            <span className="font-semibold text-lg">PaperBook</span>
          </Link>
        )}
        {sidebarCollapsed && (
          <Link to="/" className="mx-auto">
            <img src="/logo.svg" alt="PaperBook" className="h-8 w-8" />
          </Link>
        )}
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 py-4">
        <nav className="space-y-1 px-2">
          {filteredNav.map((item) => (
            <NavItem key={item.name} item={item} collapsed={sidebarCollapsed} />
          ))}
        </nav>
      </ScrollArea>

      {/* Collapse Button */}
      <div className="border-t p-2">
        <Button
          variant="ghost"
          size="sm"
          className={cn('w-full', sidebarCollapsed && 'px-2')}
          onClick={toggleSidebar}
        >
          {sidebarCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Collapse
            </>
          )}
        </Button>
      </div>
    </aside>
  )
}
