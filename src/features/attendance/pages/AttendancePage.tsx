import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Check, X, Clock, Calendar, Users, FileText, Loader2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { PageHeader } from '@/components/layout/PageHeader'
import { useToast } from '@/hooks/use-toast'
import { usePermission } from '@/components/auth'
import { cn } from '@/lib/utils'
import {
  useStudentsForAttendance,
  useMarkAttendance,
  useLeaveRequests,
  useUpdateLeaveRequest,
  useMyAttendance,
  useAttendanceReport,
} from '../hooks/useAttendance'
import {
  CLASSES,
  SECTIONS,
  ATTENDANCE_STATUS_LABELS,
  LEAVE_TYPE_LABELS,
} from '../types/attendance.types'
import type { AttendanceStatus, AttendanceStudent } from '../types/attendance.types'

type TabValue = 'mark' | 'reports' | 'leave' | 'my-attendance'

export function AttendancePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { toast } = useToast()
  const { isStudent, isParent, canMarkAttendance } = usePermission()

  const activeTab = (searchParams.get('tab') as TabValue) || (canMarkAttendance ? 'mark' : 'my-attendance')

  const [selectedClass, setSelectedClass] = useState('Class 10')
  const [selectedSection, setSelectedSection] = useState('A')
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [attendanceData, setAttendanceData] = useState<Record<string, AttendanceStatus>>({})
  const [hasChanges, setHasChanges] = useState(false)

  // Queries
  const { data: studentsData, isLoading: studentsLoading } = useStudentsForAttendance(
    selectedClass,
    selectedSection,
    selectedDate
  )
  const { data: myAttendanceData, isLoading: myAttendanceLoading } = useMyAttendance()
  const { data: leaveData, isLoading: leavesLoading } = useLeaveRequests()
  const { data: reportData, isLoading: reportLoading } = useAttendanceReport(
    selectedClass,
    selectedSection,
    '2024-04-01',
    new Date().toISOString().split('T')[0]
  )

  // Mutations
  const markAttendance = useMarkAttendance()
  const updateLeave = useUpdateLeaveRequest()

  const students = studentsData?.data || []
  const leaves = leaveData?.data || []
  const myAttendance = myAttendanceData?.data
  const report = reportData?.data || []

  // Initialize attendance data when students load
  useEffect(() => {
    if (students.length > 0) {
      const initial = students.reduce((acc, s) => ({
        ...acc,
        [s.id]: s.status || 'present',
      }), {})
      setAttendanceData(initial)
      setHasChanges(false)
    }
  }, [students])

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value })
  }

  const handleAttendanceChange = (studentId: string, status: AttendanceStatus) => {
    setAttendanceData((prev) => ({ ...prev, [studentId]: status }))
    setHasChanges(true)
  }

  const handleMarkAll = (status: AttendanceStatus) => {
    const newData = students.reduce((acc, s) => ({ ...acc, [s.id]: status }), {})
    setAttendanceData(newData)
    setHasChanges(true)
  }

  const handleSaveAttendance = async () => {
    const records = Object.entries(attendanceData).map(([studentId, status]) => ({
      studentId,
      status,
    }))

    try {
      await markAttendance.mutateAsync({
        date: selectedDate,
        className: selectedClass,
        section: selectedSection,
        records,
      })
      toast({
        title: 'Attendance Saved',
        description: `Attendance marked for ${records.length} students.`,
      })
      setHasChanges(false)
    } catch (error) {
      toast({
        title: 'Save Failed',
        description: 'Failed to save attendance. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const handleLeaveAction = async (leaveId: string, status: 'approved' | 'rejected') => {
    try {
      await updateLeave.mutateAsync({
        id: leaveId,
        data: { status },
      })
      toast({
        title: status === 'approved' ? 'Leave Approved' : 'Leave Rejected',
        description: 'Leave request has been updated.',
      })
    } catch (error) {
      toast({
        title: 'Update Failed',
        description: 'Failed to update leave request.',
        variant: 'destructive',
      })
    }
  }

  // Calculate stats
  const stats = {
    total: students.length,
    present: Object.values(attendanceData).filter((s) => s === 'present').length,
    absent: Object.values(attendanceData).filter((s) => s === 'absent').length,
    late: Object.values(attendanceData).filter((s) => s === 'late').length,
  }

  // Student/Parent View
  if (isStudent || isParent) {
    return (
      <div>
        <PageHeader
          title="My Attendance"
          description="View your attendance records"
          breadcrumbs={[{ label: 'Dashboard', href: '/' }, { label: 'Attendance' }]}
        />

        {myAttendanceLoading ? (
          <div className="space-y-4 mt-6">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        ) : myAttendance ? (
          <div className="space-y-6 mt-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-3xl font-bold">{myAttendance.summary.attendancePercentage}%</p>
                  <p className="text-sm text-muted-foreground">Attendance</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-3xl font-bold text-green-600">{myAttendance.summary.presentDays}</p>
                  <p className="text-sm text-muted-foreground">Present</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-3xl font-bold text-red-600">{myAttendance.summary.absentDays}</p>
                  <p className="text-sm text-muted-foreground">Absent</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-3xl font-bold text-yellow-600">{myAttendance.summary.lateDays}</p>
                  <p className="text-sm text-muted-foreground">Late</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-3xl font-bold">{myAttendance.summary.totalDays}</p>
                  <p className="text-sm text-muted-foreground">Total Days</p>
                </CardContent>
              </Card>
            </div>

            {/* Monthly Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Monthly Attendance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {myAttendance.monthlyData.map((month) => (
                    <div key={month.month} className="flex items-center gap-4">
                      <span className="w-12 text-sm font-medium">{month.month}</span>
                      <div className="flex-1 h-6 bg-muted rounded-full overflow-hidden flex">
                        <div
                          className="bg-green-500 h-full"
                          style={{ width: `${(month.present / (month.present + month.absent + month.late)) * 100}%` }}
                        />
                        <div
                          className="bg-yellow-500 h-full"
                          style={{ width: `${(month.late / (month.present + month.absent + month.late)) * 100}%` }}
                        />
                        <div
                          className="bg-red-500 h-full"
                          style={{ width: `${(month.absent / (month.present + month.absent + month.late)) * 100}%` }}
                        />
                      </div>
                      <span className="w-12 text-sm text-right">{month.percentage}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Records */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Recent Attendance</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Check In</TableHead>
                      <TableHead>Check Out</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {myAttendance.recentRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>{record.date}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              record.status === 'present' ? 'success' :
                              record.status === 'absent' ? 'destructive' : 'warning'
                            }
                          >
                            {ATTENDANCE_STATUS_LABELS[record.status]}
                          </Badge>
                        </TableCell>
                        <TableCell>{record.checkInTime || '-'}</TableCell>
                        <TableCell>{record.checkOutTime || '-'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card className="mt-6">
            <CardContent className="py-12 text-center">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No attendance data available</p>
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  // Staff View
  return (
    <div>
      <PageHeader
        title="Attendance"
        description="Mark and manage daily attendance"
        breadcrumbs={[{ label: 'Dashboard', href: '/' }, { label: 'Attendance' }]}
        actions={
          <Button size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        }
      />

      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4 mt-6">
        <TabsList>
          <TabsTrigger value="mark">Mark Attendance</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="leave">Leave Management</TabsTrigger>
        </TabsList>

        {/* Mark Attendance Tab */}
        <TabsContent value="mark" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-4 items-end">
                <div>
                  <label className="text-sm font-medium mb-1 block">Date</label>
                  <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-[160px]"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Class</label>
                  <Select value={selectedClass} onValueChange={setSelectedClass}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CLASSES.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Section</label>
                  <Select value={selectedSection} onValueChange={setSelectedSection}>
                    <SelectTrigger className="w-[100px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SECTIONS.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2 ml-auto">
                  <Button variant="outline" size="sm" onClick={() => handleMarkAll('present')}>
                    Mark All Present
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleMarkAll('absent')}>
                    Mark All Absent
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg">
                  <Users className="h-5 w-5 text-blue-600 dark:text-blue-200" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-xs text-muted-foreground">Total</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-800 rounded-lg">
                  <Check className="h-5 w-5 text-green-600 dark:text-green-200" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.present}</p>
                  <p className="text-xs text-muted-foreground">Present</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 bg-red-100 dark:bg-red-800 rounded-lg">
                  <X className="h-5 w-5 text-red-600 dark:text-red-200" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.absent}</p>
                  <p className="text-xs text-muted-foreground">Absent</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 bg-orange-100 dark:bg-orange-800 rounded-lg">
                  <Clock className="h-5 w-5 text-orange-600 dark:text-orange-200" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.late}</p>
                  <p className="text-xs text-muted-foreground">Late</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Attendance Grid */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                {selectedClass} - Section {selectedSection}
              </CardTitle>
              <CardDescription>Click on status to cycle through: Present → Absent → Late</CardDescription>
            </CardHeader>
            <CardContent>
              {studentsLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <Skeleton key={i} className="h-24 w-full" />
                  ))}
                </div>
              ) : students.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No students found for this class/section
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  {students.map((student) => {
                    const status = attendanceData[student.id] || student.status || 'present'
                    return (
                      <div
                        key={student.id}
                        className={cn(
                          'p-3 rounded-lg border bg-card transition-all cursor-pointer hover:shadow-md',
                          'border-l-4',
                          status === 'present' && 'border-l-green-500',
                          status === 'absent' && 'border-l-red-500',
                          status === 'late' && 'border-l-orange-500',
                          status === 'half_day' && 'border-l-yellow-500',
                          status === 'excused' && 'border-l-blue-500'
                        )}
                        onClick={() => {
                          const statuses: AttendanceStatus[] = ['present', 'absent', 'late', 'half_day', 'excused']
                          const currentIndex = statuses.indexOf(status)
                          const nextStatus = statuses[(currentIndex + 1) % statuses.length]
                          handleAttendanceChange(student.id, nextStatus)
                        }}
                      >
                        <div className="flex items-start gap-3">
                          <Avatar className="h-10 w-10 shrink-0">
                            <AvatarImage src={student.photoUrl} />
                            <AvatarFallback className="text-xs font-medium">
                              {student.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground line-clamp-1">
                              {student.name}
                            </p>
                            <p className="text-xs text-muted-foreground">Roll {student.rollNumber}</p>
                          </div>
                          <Badge
                            variant={
                              status === 'present' ? 'success' :
                              status === 'absent' ? 'destructive' :
                              status === 'late' ? 'warning' :
                              'secondary'
                            }
                            className="shrink-0 text-xs"
                          >
                            {ATTENDANCE_STATUS_LABELS[status]}
                          </Badge>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              <div className="mt-6 flex justify-between items-center">
                {hasChanges && (
                  <p className="text-sm text-muted-foreground">You have unsaved changes</p>
                )}
                <div className="ml-auto">
                  <Button onClick={handleSaveAttendance} disabled={markAttendance.isPending || !hasChanges}>
                    {markAttendance.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Attendance'
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-base">Attendance Report</CardTitle>
                  <CardDescription>Class-wise attendance summary</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Select value={selectedClass} onValueChange={setSelectedClass}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CLASSES.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={selectedSection} onValueChange={setSelectedSection}>
                    <SelectTrigger className="w-[100px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SECTIONS.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {reportLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : report.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">No report data available</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead className="text-center">Present</TableHead>
                      <TableHead className="text-center">Absent</TableHead>
                      <TableHead className="text-center">Late</TableHead>
                      <TableHead className="text-center">Total</TableHead>
                      <TableHead className="text-center">%</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {report.slice(0, 20).map((r) => (
                      <TableRow key={r.studentId}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{r.studentName}</p>
                            <p className="text-xs text-muted-foreground">{r.admissionNumber}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-center text-green-600">{r.presentDays}</TableCell>
                        <TableCell className="text-center text-red-600">{r.absentDays}</TableCell>
                        <TableCell className="text-center text-yellow-600">{r.lateDays}</TableCell>
                        <TableCell className="text-center">{r.totalDays}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant={r.attendancePercentage >= 75 ? 'success' : 'destructive'}>
                            {r.attendancePercentage}%
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Leave Management Tab */}
        <TabsContent value="leave" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Leave Requests</CardTitle>
              <CardDescription>Approve or reject student leave requests</CardDescription>
            </CardHeader>
            <CardContent>
              {leavesLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                  ))}
                </div>
              ) : leaves.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">No leave requests</p>
              ) : (
                <div className="space-y-4">
                  {leaves.map((leave) => (
                    <div key={leave.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium">{leave.studentName}</p>
                            <Badge variant="outline">{leave.className} - {leave.section}</Badge>
                            <Badge
                              variant={
                                leave.status === 'approved' ? 'success' :
                                leave.status === 'rejected' ? 'destructive' :
                                'secondary'
                              }
                            >
                              {leave.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {LEAVE_TYPE_LABELS[leave.leaveType]} • {leave.startDate} to {leave.endDate}
                          </p>
                          <p className="text-sm">{leave.reason}</p>
                          <p className="text-xs text-muted-foreground mt-2">
                            Applied by {leave.appliedBy}
                          </p>
                        </div>
                        {leave.status === 'pending' && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-green-600"
                              onClick={() => handleLeaveAction(leave.id, 'approved')}
                              disabled={updateLeave.isPending}
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600"
                              onClick={() => handleLeaveAction(leave.id, 'rejected')}
                              disabled={updateLeave.isPending}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        )}
                      </div>
                      {leave.rejectionReason && (
                        <p className="text-sm text-red-600 mt-2">
                          Rejection reason: {leave.rejectionReason}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
