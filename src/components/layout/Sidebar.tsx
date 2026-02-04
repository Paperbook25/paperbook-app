import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  UserPlus,
  GraduationCap,
  Users,
  ClipboardCheck,
  BookOpen,
  Bus,
  IndianRupee,
  Settings,
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
    ],
  },
  {
    name: 'Attendance',
    href: '/attendance',
    icon: ClipboardCheck,
    roles: ['admin', 'principal', 'teacher'],
    children: [
      { name: 'Mark Attendance', href: '/attendance' },
      { name: 'Reports', href: '/attendance/reports' },
      { name: 'Leave Management', href: '/attendance/leave' },
    ],
  },
  {
    name: 'Library',
    href: '/library',
    icon: BookOpen,
    roles: ['admin', 'principal', 'librarian', 'teacher', 'student'],
    children: [
      { name: 'Catalog', href: '/library' },
      { name: 'Issued Books', href: '/library/issued' },
      { name: 'Fines', href: '/library/fines' },
    ],
  },
  {
    name: 'Transport',
    href: '/transport',
    icon: Bus,
    roles: ['admin', 'principal', 'transport_manager', 'parent'],
    children: [
      { name: 'Routes', href: '/transport' },
      { name: 'Vehicles', href: '/transport/vehicles' },
      { name: 'Drivers', href: '/transport/drivers' },
      { name: 'Tracking', href: '/transport/tracking' },
    ],
  },
  {
    name: 'Finance',
    href: '/finance',
    icon: IndianRupee,
    roles: ['admin', 'principal', 'accountant'],
    children: [
      { name: 'Fee Structure', href: '/finance' },
      { name: 'Collection', href: '/finance/collection' },
      { name: 'Payments', href: '/finance/payments' },
      { name: 'Reports', href: '/finance/reports' },
    ],
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
    roles: ['admin', 'principal'],
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
            <NavItem key={item.href} item={item} collapsed={sidebarCollapsed} />
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
