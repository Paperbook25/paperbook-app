import { formatDistanceToNow } from 'date-fns'
import {
  IndianRupee,
  ClipboardCheck,
  BookOpen,
  Award,
  Calendar,
  FileText,
  User,
  GraduationCap,
  ArrowUpCircle,
  ArrowRightCircle,
  Clock,
  type LucideIcon,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { useStudentTimeline } from '../hooks/useStudents'
import type { TimelineEvent, TimelineEventType } from '../types/student.types'

interface StudentTimelineProps {
  studentId: string
}

const EVENT_ICON_MAP: Record<TimelineEventType, LucideIcon> = {
  fee_paid: IndianRupee,
  attendance_marked: ClipboardCheck,
  book_issued: BookOpen,
  book_returned: BookOpen,
  marks_entered: Award,
  leave_applied: Calendar,
  document_uploaded: FileText,
  profile_updated: User,
  admission: GraduationCap,
  promotion: ArrowUpCircle,
  transfer: ArrowRightCircle,
}

const EVENT_COLOR_MAP: Record<TimelineEventType, string> = {
  fee_paid: 'bg-green-100 text-green-700',
  attendance_marked: 'bg-blue-100 text-blue-700',
  book_issued: 'bg-amber-100 text-amber-700',
  book_returned: 'bg-amber-100 text-amber-700',
  marks_entered: 'bg-purple-100 text-purple-700',
  leave_applied: 'bg-orange-100 text-orange-700',
  document_uploaded: 'bg-cyan-100 text-cyan-700',
  profile_updated: 'bg-gray-100 text-gray-700',
  admission: 'bg-emerald-100 text-emerald-700',
  promotion: 'bg-indigo-100 text-indigo-700',
  transfer: 'bg-rose-100 text-rose-700',
}

function TimelineItem({ event }: { event: TimelineEvent }) {
  const Icon = EVENT_ICON_MAP[event.type] ?? Clock
  const colorClass = EVENT_COLOR_MAP[event.type] ?? 'bg-gray-100 text-gray-700'

  return (
    <div className="relative flex gap-4 pb-8 last:pb-0">
      {/* Connecting line */}
      <div className="absolute left-[19px] top-10 bottom-0 w-px bg-border last:hidden" />

      {/* Icon */}
      <div
        className={cn(
          'relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
          colorClass
        )}
      >
        <Icon className="h-4 w-4" />
      </div>

      {/* Content */}
      <div className="flex-1 pt-1">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-sm font-medium leading-tight">{event.title}</p>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {event.description}
            </p>
          </div>
          <time className="shrink-0 text-xs text-muted-foreground whitespace-nowrap">
            {formatDistanceToNow(new Date(event.timestamp), {
              addSuffix: true,
            })}
          </time>
        </div>
      </div>
    </div>
  )
}

function TimelineSkeleton() {
  return (
    <div className="space-y-6">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <Skeleton className="h-10 w-10 rounded-full shrink-0" />
          <div className="flex-1 space-y-2 pt-1">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-3 w-16 shrink-0" />
        </div>
      ))}
    </div>
  )
}

export function StudentTimeline({ studentId }: StudentTimelineProps) {
  const { data: events, isLoading, isError } = useStudentTimeline(studentId)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Activity Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <TimelineSkeleton />
        ) : isError ? (
          <div className="text-center py-8 text-destructive text-sm">
            Failed to load timeline. Please try again.
          </div>
        ) : !events || events.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Clock className="h-10 w-10 mb-3 opacity-40" />
            <p className="text-sm font-medium">No activity yet</p>
            <p className="text-xs mt-1">
              Student activity will appear here as events occur.
            </p>
          </div>
        ) : (
          <div>
            {events.map((event) => (
              <TimelineItem key={event.id} event={event} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
