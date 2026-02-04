import { useQuery } from '@tanstack/react-query'
import {
  GraduationCap,
  Users,
  IndianRupee,
  ClipboardCheck,
  UserPlus,
  TrendingUp,
  TrendingDown,
  Calendar,
  Bell,
  Activity,
  ArrowRight,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { PageHeader } from '@/components/layout/PageHeader'
import { cn, formatCurrency, formatDate } from '@/lib/utils'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts'

interface StatCardProps {
  title: string
  value: string | number
  change?: { value: number; trend: 'up' | 'down' }
  icon: React.ElementType
  href?: string
  description?: string
}

function StatCard({ title, value, change, icon: Icon, href, description }: StatCardProps) {
  const content = (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <p
            className={cn(
              'text-xs flex items-center gap-1 mt-1',
              change.trend === 'up' ? 'text-green-600' : 'text-red-600'
            )}
          >
            {change.trend === 'up' ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {change.value}% from last month
          </p>
        )}
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
      </CardContent>
    </Card>
  )

  return href ? <Link to={href}>{content}</Link> : content
}

function QuickActions() {
  const actions = [
    { label: 'Add Student', icon: UserPlus, href: '/students/new', color: 'bg-blue-500' },
    { label: 'Mark Attendance', icon: ClipboardCheck, href: '/attendance', color: 'bg-green-500' },
    { label: 'Collect Fee', icon: IndianRupee, href: '/finance/collection', color: 'bg-purple-500' },
    { label: 'New Admission', icon: GraduationCap, href: '/admissions/new', color: 'bg-orange-500' },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action) => (
            <Link key={action.label} to={action.href}>
              <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2">
                <div className={cn('p-2 rounded-lg text-white', action.color)}>
                  <action.icon className="h-5 w-5" />
                </div>
                <span className="text-xs">{action.label}</span>
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: async () => {
      const res = await fetch('/api/dashboard/stats')
      const json = await res.json()
      return json.data
    },
  })

  const { data: feeData, isLoading: feeLoading } = useQuery({
    queryKey: ['dashboard', 'fee-collection'],
    queryFn: async () => {
      const res = await fetch('/api/dashboard/fee-collection')
      const json = await res.json()
      return json.data
    },
  })

  const { data: attendanceData } = useQuery({
    queryKey: ['dashboard', 'attendance'],
    queryFn: async () => {
      const res = await fetch('/api/dashboard/attendance')
      const json = await res.json()
      return json.data
    },
  })

  const { data: announcements } = useQuery({
    queryKey: ['dashboard', 'announcements'],
    queryFn: async () => {
      const res = await fetch('/api/dashboard/announcements')
      const json = await res.json()
      return json.data
    },
  })

  const { data: events } = useQuery({
    queryKey: ['dashboard', 'events'],
    queryFn: async () => {
      const res = await fetch('/api/dashboard/events')
      const json = await res.json()
      return json.data
    },
  })

  const { data: activities } = useQuery({
    queryKey: ['dashboard', 'activities'],
    queryFn: async () => {
      const res = await fetch('/api/dashboard/activities')
      const json = await res.json()
      return json.data
    },
  })

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Welcome back! Here's an overview of your school."
      />

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        {statsLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))
        ) : (
          <>
            <StatCard
              title="Total Students"
              value={stats?.totalStudents || 0}
              change={{ value: 12, trend: 'up' }}
              icon={GraduationCap}
              href="/students"
            />
            <StatCard
              title="Total Staff"
              value={stats?.totalStaff || 0}
              change={{ value: 3, trend: 'up' }}
              icon={Users}
              href="/staff"
            />
            <StatCard
              title="Fee Collected"
              value={formatCurrency(stats?.totalFeeCollected || 0)}
              change={{ value: 8, trend: 'up' }}
              icon={IndianRupee}
              href="/finance"
            />
            <StatCard
              title="Today's Attendance"
              value={`${stats?.attendanceToday || 0}%`}
              change={{ value: 2, trend: 'down' }}
              icon={ClipboardCheck}
              href="/attendance"
            />
          </>
        )}
      </div>

      {/* Charts & Widgets */}
      <div className="grid gap-6 lg:grid-cols-3 mb-6">
        {/* Fee Collection Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Fee Collection Overview</CardTitle>
            <CardDescription>Monthly fee collection vs pending</CardDescription>
          </CardHeader>
          <CardContent>
            {feeLoading ? (
              <Skeleton className="h-[250px] w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={feeData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" tickFormatter={(v) => `₹${v / 1000}k`} />
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{
                      backgroundColor: 'var(--background)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="collected"
                    stackId="1"
                    stroke="var(--color-chart-1)"
                    fill="var(--color-chart-1)"
                    fillOpacity={0.6}
                    name="Collected"
                  />
                  <Area
                    type="monotone"
                    dataKey="pending"
                    stackId="1"
                    stroke="var(--color-chart-3)"
                    fill="var(--color-chart-3)"
                    fillOpacity={0.6}
                    name="Pending"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <QuickActions />
      </div>

      {/* Attendance & Events */}
      <div className="grid gap-6 lg:grid-cols-3 mb-6">
        {/* Weekly Attendance */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Attendance</CardTitle>
            <CardDescription>This week's attendance trend</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="day" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--background)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="present" fill="var(--color-chart-2)" name="Present %" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Announcements */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Announcements
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {announcements?.slice(0, 3).map((item: any) => (
              <div key={item.id} className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      item.priority === 'high'
                        ? 'destructive'
                        : item.priority === 'medium'
                        ? 'default'
                        : 'secondary'
                    }
                    className="text-[10px] px-1.5 py-0"
                  >
                    {item.priority}
                  </Badge>
                  <span className="text-sm font-medium truncate">{item.title}</span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">{item.content}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Upcoming Events
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {events?.slice(0, 4).map((event: any) => (
              <div key={event.id} className="flex items-center gap-3">
                <div
                  className={cn(
                    'w-10 h-10 rounded-lg flex items-center justify-center text-white text-xs font-medium',
                    event.type === 'exam'
                      ? 'bg-red-500'
                      : event.type === 'meeting'
                      ? 'bg-blue-500'
                      : event.type === 'holiday'
                      ? 'bg-green-500'
                      : 'bg-purple-500'
                  )}
                >
                  {new Date(event.date).getDate()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{event.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(event.date, { weekday: 'short', month: 'short', day: 'numeric' })}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest actions across the system</CardDescription>
          </div>
          <Button variant="ghost" size="sm">
            View All
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activities?.map((activity: any) => (
              <div key={activity.id} className="flex items-start gap-4">
                <div className="w-2 h-2 mt-2 rounded-full bg-primary" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm">
                    <span className="font-medium">{activity.action}:</span> {activity.description}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {activity.user.name} • {formatDate(activity.timestamp, { hour: 'numeric', minute: 'numeric' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
