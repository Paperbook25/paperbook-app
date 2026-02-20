import { Link, useLocation } from 'react-router-dom'
import { createPortal } from 'react-dom'
import {
  LayoutDashboard,
  UserPlus,
  UsersRound,
  ClipboardCheck,
  ClipboardList,
  BookOpen,
  Bus,
  MonitorPlay,
  IndianRupee,
  Settings,
  BarChart3,
  X,
  Cog,
  MessageCircle,
  Briefcase,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { useUIStore } from '@/stores/useUIStore'
import { useAuthStore } from '@/stores/useAuthStore'
import type { Role } from '@/types/common.types'
import { useState, useRef, useEffect, useCallback } from 'react'

interface NavChildItem {
  name: string
  href: string
  roles?: Role[]
}

interface NavItem {
  name: string
  shortName?: string
  href: string
  icon: LucideIcon
  roles: Role[]
  children?: NavChildItem[]
  moduleColor?: string
}

const navigation: NavItem[] = [
  {
    name: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
    roles: ['admin', 'principal', 'teacher', 'accountant', 'librarian', 'transport_manager', 'student', 'parent'],
    moduleColor: 'var(--color-module-academic)',
  },
  {
    name: 'Admissions',
    shortName: 'Admit',
    href: '/admissions',
    icon: UserPlus,
    roles: ['admin', 'principal'],
    moduleColor: 'var(--color-module-admissions)',
  },
  // People module (consolidated Students, Staff, Attendance, Behavior) for admin/principal/teacher
  {
    name: 'People',
    href: '/people',
    icon: UsersRound,
    roles: ['admin', 'principal', 'teacher'],
    moduleColor: 'var(--color-module-students)',
    children: [
      { name: 'Students', href: '/people?tab=students' },
      { name: 'Staff', href: '/people?tab=staff', roles: ['admin', 'principal'] },
      { name: 'Attendance', href: '/people?tab=attendance' },
      { name: 'Behavior', href: '/people?tab=behavior' },
    ],
  },
  // Student/Parent specific attendance view (shows My Attendance)
  {
    name: 'My Attendance',
    shortName: 'Attend',
    href: '/people',
    icon: ClipboardCheck,
    roles: ['student', 'parent'],
    moduleColor: 'var(--color-module-attendance)',
  },
  {
    name: 'Library',
    href: '/library',
    icon: BookOpen,
    roles: ['admin', 'principal', 'librarian', 'teacher', 'student', 'parent'],
    moduleColor: 'var(--color-module-library)',
  },
  {
    name: 'LMS',
    href: '/lms',
    icon: MonitorPlay,
    roles: ['admin', 'principal', 'teacher', 'student', 'parent'],
    moduleColor: 'var(--color-module-lms)',
  },
  // Operations module (consolidated Transport, Hostel, Assets, Visitors)
  {
    name: 'Operations',
    shortName: 'Ops',
    href: '/operations',
    icon: Cog,
    roles: ['admin', 'principal', 'transport_manager', 'accountant'],
    moduleColor: 'var(--color-module-operations)',
    children: [
      { name: 'Transport', href: '/operations?tab=transport', roles: ['admin', 'principal', 'transport_manager'] },
      { name: 'Hostel', href: '/operations?tab=hostel', roles: ['admin', 'principal'] },
      { name: 'Assets', href: '/operations?tab=assets', roles: ['admin', 'principal', 'accountant'] },
      { name: 'Visitors', href: '/visitors', roles: ['admin', 'principal'] },
    ],
  },
  // Parent/Student transport tracking view - keep as separate item
  {
    name: 'Bus Tracking',
    shortName: 'Bus',
    href: '/transport/tracking',
    icon: Bus,
    roles: ['parent', 'student'],
    moduleColor: 'var(--color-module-transport)',
  },
  {
    name: 'Exams',
    href: '/exams',
    icon: ClipboardList,
    roles: ['admin', 'principal', 'teacher'],
    moduleColor: 'var(--color-module-exams)',
  },
  // Student/Parent exam results view
  {
    name: 'My Results',
    shortName: 'Results',
    href: '/exams?tab=reports',
    icon: ClipboardList,
    roles: ['student', 'parent'],
    moduleColor: 'var(--color-module-exams)',
  },
  {
    name: 'Finance',
    href: '/finance',
    icon: IndianRupee,
    roles: ['admin', 'principal', 'accountant'],
    moduleColor: 'var(--color-module-finance)',
  },
  // Parent/Student fees view
  {
    name: 'Fees',
    href: '/finance/my-fees',
    icon: IndianRupee,
    roles: ['parent', 'student'],
    moduleColor: 'var(--color-module-finance)',
  },
  // Parent Portal for parent-teacher communication
  {
    name: 'Parent Portal',
    shortName: 'Connect',
    href: '/parent-portal',
    icon: MessageCircle,
    roles: ['parent'],
    moduleColor: 'var(--color-module-parent-portal)',
  },
  // Management module (consolidated Schedule, Docs, Alumni)
  {
    name: 'Management',
    shortName: 'Mgmt',
    href: '/management',
    icon: Briefcase,
    roles: ['admin', 'principal', 'teacher', 'accountant'],
    moduleColor: 'var(--color-module-management)',
    children: [
      { name: 'Schedule', href: '/management?tab=schedule' },
      { name: 'Docs', href: '/management?tab=docs', roles: ['admin', 'principal', 'teacher', 'accountant'] },
      { name: 'Alumni', href: '/management?tab=alumni', roles: ['admin', 'principal'] },
    ],
  },
  {
    name: 'Reports',
    href: '/reports',
    icon: BarChart3,
    roles: ['admin', 'principal', 'accountant'],
    moduleColor: 'var(--color-module-reports)',
  },
  // Settings module (includes General, Communication, Integrations)
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
    roles: ['admin', 'principal', 'teacher'],
    moduleColor: 'var(--color-module-settings)',
    children: [
      { name: 'General', href: '/settings', roles: ['admin', 'principal'] },
      { name: 'Communication', href: '/settings?tab=communication', roles: ['admin', 'principal', 'teacher'] },
      { name: 'Integrations', href: '/settings?tab=integrations', roles: ['admin', 'principal'] },
    ],
  },
]

interface FlyoutPanelProps {
  item: NavItem
  isOpen: boolean
  onNavigate: () => void
  triggerRect: DOMRect | null
  hasRole: (roles: Role[]) => boolean
}

function FlyoutPanel({ item, isOpen, onNavigate, triggerRect, hasRole }: FlyoutPanelProps) {
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
            {item.children?.filter((child) => !child.roles || hasRole(child.roles)).map((child) => {
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
  const { hasRole } = useAuthStore()
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
          'relative flex flex-col items-center justify-center gap-1.5 rounded-xl px-2 py-3 text-center transition-all w-full',
          isActive
            ? 'bg-sidebar-accent text-sidebar-accent-foreground shadow-sm'
            : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
        )}
        style={isActive && item.moduleColor ? {
          boxShadow: `inset 3px 0 0 ${item.moduleColor}`,
          borderTopLeftRadius: '0.75rem',
          borderBottomLeftRadius: '0.75rem',
        } : undefined}
      >
        <item.icon
          className="h-6 w-6 shrink-0 transition-colors"
          strokeWidth={1.75}
          style={isActive && item.moduleColor ? { color: item.moduleColor } : undefined}
        />
        <span className="text-[10px] font-medium leading-tight truncate w-full">
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
          hasRole={hasRole}
        />
      )}
    </div>
  )
}

// Mobile nav item with accordion-style expansion
function MobileNavItem({ item, onNavigate }: { item: NavItem; onNavigate: () => void }) {
  const location = useLocation()
  const { hasRole } = useAuthStore()
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
        style={isActive && item.moduleColor ? {
          backgroundColor: item.moduleColor,
        } : undefined}
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
          {item.children?.filter((child) => !child.roles || hasRole(child.roles)).map((child) => (
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
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[96px] flex-col bg-sidebar border-r border-sidebar-border shadow-sm lg:flex">
        {/* Logo */}
        <div className="flex h-16 items-center justify-center border-b border-sidebar-border">
          <Link to="/">
            <img src="/logo.svg" alt="PaperBook" className="h-9 w-9" />
          </Link>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1">
          <nav className="flex flex-col gap-0.5 py-3 px-2.5">
            {filteredNav.map((item) => (
              <SidebarNavItem key={item.href + item.name} item={item} />
            ))}
          </nav>
        </ScrollArea>
      </aside>

      {/* Mobile Drawer */}
      <MobileDrawer filteredNav={filteredNav} />
    </>
  )
}
