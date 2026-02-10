import { Link, useLocation } from 'react-router-dom'
import { createPortal } from 'react-dom'
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
  Building2,
  UserCheck,
  Package,
  Users2,
  X,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { useUIStore } from '@/stores/useUIStore'
import { useAuthStore } from '@/stores/useAuthStore'
import type { Role } from '@/types/common.types'
import { useState, useRef, useEffect, useCallback } from 'react'

interface NavItem {
  name: string
  shortName?: string
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
    shortName: 'Admit',
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
    shortName: 'Attend',
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
    shortName: 'Attend',
    href: '/attendance',
    icon: ClipboardCheck,
    roles: ['student', 'parent'],
  },
  {
    name: 'Library',
    href: '/library',
    icon: BookOpen,
    roles: ['admin', 'principal', 'librarian', 'teacher', 'student', 'parent'],
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
  // Parent/Student transport tracking view
  {
    name: 'Bus Tracking',
    shortName: 'Bus',
    href: '/transport/tracking',
    icon: Bus,
    roles: ['parent', 'student'],
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
    shortName: 'Results',
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
  // Parent/Student fees view
  {
    name: 'Fees',
    href: '/finance/my-fees',
    icon: IndianRupee,
    roles: ['parent', 'student'],
  },
  {
    name: 'Hostel',
    href: '/hostel',
    icon: Building2,
    roles: ['admin', 'principal'],
    children: [
      { name: 'Dashboard', href: '/hostel' },
      { name: 'Rooms', href: '/hostel/rooms' },
      { name: 'Allocations', href: '/hostel/allocations' },
      { name: 'Fees', href: '/hostel/fees' },
      { name: 'Mess Menu', href: '/hostel/mess' },
      { name: 'Attendance', href: '/hostel/attendance' },
    ],
  },
  {
    name: 'Visitors',
    href: '/visitors',
    icon: UserCheck,
    roles: ['admin', 'principal'],
    children: [
      { name: 'Check-In', href: '/visitors' },
      { name: 'Logs', href: '/visitors/logs' },
      { name: 'Reports', href: '/visitors/reports' },
      { name: 'Pre-Approved', href: '/visitors/pre-approved' },
    ],
  },
  {
    name: 'Inventory',
    href: '/inventory',
    icon: Package,
    roles: ['admin', 'principal', 'accountant'],
    children: [
      { name: 'Dashboard', href: '/inventory' },
      { name: 'Assets', href: '/inventory/assets' },
      { name: 'Stock', href: '/inventory/stock' },
      { name: 'Purchase Orders', href: '/inventory/purchase-orders' },
      { name: 'Vendors', href: '/inventory/vendors' },
    ],
  },
  {
    name: 'Alumni',
    href: '/alumni',
    icon: Users2,
    roles: ['admin', 'principal'],
    children: [
      { name: 'Directory', href: '/alumni' },
      { name: 'Batches', href: '/alumni/batches' },
      { name: 'Achievements', href: '/alumni/achievements' },
      { name: 'Contributions', href: '/alumni/contributions' },
      { name: 'Events', href: '/alumni/events' },
    ],
  },
  {
    name: 'Integrations',
    shortName: 'Integrate',
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

interface FlyoutPanelProps {
  item: NavItem
  isOpen: boolean
  onNavigate: () => void
  triggerRect: DOMRect | null
}

function FlyoutPanel({ item, isOpen, onNavigate, triggerRect }: FlyoutPanelProps) {
  const location = useLocation()

  if (!triggerRect) return null

  // Calculate position based on trigger element
  const left = triggerRect.right + 8 // 8px gap from sidebar

  // Check if flyout would overflow bottom of screen
  const flyoutHeight = Math.min((item.children?.length || 0) * 40 + 60, 380)
  const adjustedTop = triggerRect.top + flyoutHeight > window.innerHeight - 20
    ? Math.max(20, window.innerHeight - flyoutHeight - 20)
    : triggerRect.top

  const flyoutContent = (
    <>
      {/* Invisible bridge to prevent hover gap - rendered at portal level */}
      <div
        style={{
          position: 'fixed',
          top: triggerRect.top,
          left: triggerRect.right,
          width: 12,
          height: triggerRect.height,
          zIndex: 99,
        }}
        className={isOpen ? 'block' : 'hidden'}
      />

      {/* Flyout content */}
      <div
        role="menu"
        aria-label={`${item.name} submenu`}
        style={{ top: adjustedTop, left }}
        className={cn(
          'fixed z-[100] min-w-52 max-w-64',
          'transition-all duration-150 ease-out',
          isOpen
            ? 'opacity-100 translate-x-0 pointer-events-auto'
            : 'opacity-0 -translate-x-2 pointer-events-none'
        )}
      >
        <div className="rounded-xl border bg-card p-2 shadow-lg">
          {/* Header */}
          <div className="mb-2 px-3 py-2 border-b">
            <h3 className="text-sm font-semibold text-foreground">{item.name}</h3>
          </div>

          {/* Menu items */}
          <div className="space-y-0.5 max-h-80 overflow-y-auto">
            {item.children?.map((child) => {
              const isChildActive = location.pathname === child.href ||
                (location.pathname + location.search) === child.href
              return (
                <Link
                  key={child.href}
                  to={child.href}
                  role="menuitem"
                  onClick={onNavigate}
                  className={cn(
                    'flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors',
                    isChildActive
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-foreground/70 hover:bg-muted hover:text-foreground'
                  )}
                >
                  {child.name}
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )

  return createPortal(flyoutContent, document.body)
}

function SidebarNavItem({ item }: { item: NavItem }) {
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  const [triggerRect, setTriggerRect] = useState<DOMRect | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const itemRef = useRef<HTMLDivElement>(null)

  const isActive = location.pathname === item.href ||
    (item.href !== '/' && location.pathname.startsWith(item.href + '/'))
  const hasChildren = item.children && item.children.length > 0

  const handleMouseEnter = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)

    // Capture position for portal positioning
    if (itemRef.current) {
      setTriggerRect(itemRef.current.getBoundingClientRect())
    }

    setIsOpen(true)
  }, [])

  const handleMouseLeave = useCallback(() => {
    timeoutRef.current = setTimeout(() => setIsOpen(false), 150)
  }, [])

  const handleNavigate = useCallback(() => {
    setIsOpen(false)
  }, [])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  // Close flyout on route change
  useEffect(() => {
    setIsOpen(false)
  }, [location.pathname])

  return (
    <div
      ref={itemRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Icon + Label stacked */}
      <Link
        to={item.href}
        onKeyDown={(e) => {
          if (hasChildren && e.key === 'ArrowRight') {
            e.preventDefault()
            setIsOpen(true)
          }
        }}
        aria-label={item.name}
        aria-haspopup={hasChildren ? 'menu' : undefined}
        aria-expanded={hasChildren ? isOpen : undefined}
        className={cn(
          'flex flex-col items-center gap-1 rounded-md px-2 py-1.5 text-center transition-all',
          isActive
            ? 'bg-sidebar-accent text-sidebar-accent-foreground'
            : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
        )}
      >
        <item.icon className="h-5 w-5 shrink-0" />
        <span className="text-[8px] font-medium leading-none truncate w-full">
          {item.shortName || item.name}
        </span>
      </Link>

      {/* Flyout Panel */}
      {hasChildren && (
        <FlyoutPanel
          item={item}
          isOpen={isOpen}
          onNavigate={handleNavigate}
          triggerRect={triggerRect}
        />
      )}
    </div>
  )
}

// Mobile nav item with accordion-style expansion
function MobileNavItem({ item, onNavigate }: { item: NavItem; onNavigate: () => void }) {
  const location = useLocation()
  const [expanded, setExpanded] = useState(false)

  const isActive = location.pathname === item.href ||
    (item.href !== '/' && location.pathname.startsWith(item.href + '/'))
  const hasChildren = item.children && item.children.length > 0

  return (
    <div>
      <Link
        to={hasChildren ? '#' : item.href}
        onClick={(e) => {
          if (hasChildren) {
            e.preventDefault()
            setExpanded(!expanded)
          } else {
            onNavigate()
          }
        }}
        className={cn(
          'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors',
          isActive
            ? 'bg-primary text-primary-foreground'
            : 'text-foreground hover:bg-muted'
        )}
      >
        <item.icon className="h-5 w-5 shrink-0" />
        <span className="flex-1">{item.name}</span>
        {hasChildren && (
          <svg
            className={cn('h-4 w-4 transition-transform', expanded && 'rotate-180')}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </Link>

      {hasChildren && expanded && (
        <div className="ml-4 mt-1 space-y-1 border-l pl-4">
          {item.children?.map((child) => (
            <Link
              key={child.href}
              to={child.href}
              onClick={onNavigate}
              className={cn(
                'block rounded-lg px-3 py-2 text-sm transition-colors',
                location.pathname === child.href
                  ? 'bg-muted text-foreground font-medium'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              {child.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

// Mobile drawer component
function MobileDrawer({ filteredNav }: { filteredNav: NavItem[] }) {
  const { sidebarMobileOpen, setSidebarMobileOpen } = useUIStore()
  const location = useLocation()

  // Close drawer on route change
  useEffect(() => {
    setSidebarMobileOpen(false)
  }, [location.pathname, setSidebarMobileOpen])

  const handleClose = useCallback(() => {
    setSidebarMobileOpen(false)
  }, [setSidebarMobileOpen])

  if (!sidebarMobileOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        onClick={handleClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 left-0 z-50 w-72 bg-background shadow-xl lg:hidden animate-in slide-in-from-left duration-300">
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b px-4">
          <Link to="/" className="flex items-center gap-2" onClick={handleClose}>
            <img src="/logo.svg" alt="PaperBook" className="h-8 w-8" />
            <span className="font-semibold text-lg">PaperBook</span>
          </Link>
          <Button variant="ghost" size="icon" onClick={handleClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <ScrollArea className="h-[calc(100vh-4rem)]">
          <nav className="space-y-1 p-4">
            {filteredNav.map((item) => (
              <MobileNavItem
                key={item.href + item.name}
                item={item}
                onNavigate={handleClose}
              />
            ))}
          </nav>
        </ScrollArea>
      </div>
    </>
  )
}

export function Sidebar() {
  const { hasRole } = useAuthStore()

  const filteredNav = navigation.filter((item) => hasRole(item.roles))

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-20 flex-col bg-sidebar border-r border-sidebar-border lg:flex">
        {/* Logo */}
        <div className="flex h-16 items-center justify-center border-b border-sidebar-border">
          <Link to="/">
            <img src="/logo.svg" alt="PaperBook" className="h-8 w-8" />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col justify-between py-2 px-1.5 overflow-hidden">
          {filteredNav.map((item) => (
            <SidebarNavItem key={item.href + item.name} item={item} />
          ))}
        </nav>
      </aside>

      {/* Mobile Drawer */}
      <MobileDrawer filteredNav={filteredNav} />
    </>
  )
}
