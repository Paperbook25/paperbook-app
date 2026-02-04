import { useState } from 'react'
import { Check, X, Clock, Calendar, Users, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/layout/PageHeader'
import { cn, getInitials } from '@/lib/utils'

const CLASSES = ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10']
const SECTIONS = ['A', 'B', 'C', 'D']

// Mock students for attendance
const mockStudents = Array.from({ length: 45 }, (_, i) => ({
  id: `student-${i + 1}`,
  name: `Student ${i + 1}`,
  rollNumber: i + 1,
  photoUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=Student${i + 1}`,
  status: Math.random() > 0.1 ? 'present' : Math.random() > 0.5 ? 'absent' : 'late',
}))

type AttendanceStatus = 'present' | 'absent' | 'late' | 'unmarked'

export function AttendancePage() {
  const [selectedClass, setSelectedClass] = useState('Class 10')
  const [selectedSection, setSelectedSection] = useState('A')
  const [selectedDate] = useState(new Date().toISOString().split('T')[0])
  const [attendanceData, setAttendanceData] = useState<Record<string, AttendanceStatus>>(
    mockStudents.reduce((acc, s) => ({ ...acc, [s.id]: s.status as AttendanceStatus }), {})
  )

  const handleAttendanceChange = (studentId: string, status: AttendanceStatus) => {
    setAttendanceData((prev) => ({ ...prev, [studentId]: status }))
  }

  const handleMarkAll = (status: AttendanceStatus) => {
    const newData = mockStudents.reduce((acc, s) => ({ ...acc, [s.id]: status }), {})
    setAttendanceData(newData)
  }

  const stats = {
    total: mockStudents.length,
    present: Object.values(attendanceData).filter((s) => s === 'present').length,
    absent: Object.values(attendanceData).filter((s) => s === 'absent').length,
    late: Object.values(attendanceData).filter((s) => s === 'late').length,
  }

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

      <Tabs defaultValue="mark" className="space-y-4">
        <TabsList>
          <TabsTrigger value="mark">Mark Attendance</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="leave">Leave Management</TabsTrigger>
        </TabsList>

        <TabsContent value="mark" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-4 items-end">
                <div>
                  <label className="text-sm font-medium mb-1 block">Date</label>
                  <input
                    type="date"
                    value={selectedDate}
                    className="h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                    readOnly
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
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
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
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
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
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-xs text-muted-foreground">Total</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                  <Check className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.present}</p>
                  <p className="text-xs text-muted-foreground">Present</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                  <X className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.absent}</p>
                  <p className="text-xs text-muted-foreground">Absent</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                  <Clock className="h-5 w-5 text-orange-600" />
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
              <CardDescription>Click on status to change</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {mockStudents.map((student) => (
                  <div
                    key={student.id}
                    className={cn(
                      'p-3 rounded-lg border transition-colors cursor-pointer',
                      attendanceData[student.id] === 'present' && 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800',
                      attendanceData[student.id] === 'absent' && 'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800',
                      attendanceData[student.id] === 'late' && 'bg-orange-50 border-orange-200 dark:bg-orange-950 dark:border-orange-800'
                    )}
                    onClick={() => {
                      const statuses: AttendanceStatus[] = ['present', 'absent', 'late']
                      const currentIndex = statuses.indexOf(attendanceData[student.id])
                      const nextStatus = statuses[(currentIndex + 1) % statuses.length]
                      handleAttendanceChange(student.id, nextStatus)
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={student.photoUrl} />
                        <AvatarFallback className="text-xs">{student.rollNumber}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{student.name}</p>
                        <p className="text-xs text-muted-foreground">Roll {student.rollNumber}</p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        attendanceData[student.id] === 'present'
                          ? 'success'
                          : attendanceData[student.id] === 'absent'
                          ? 'destructive'
                          : 'warning'
                      }
                      className="w-full justify-center"
                    >
                      {attendanceData[student.id].charAt(0).toUpperCase() + attendanceData[student.id].slice(1)}
                    </Badge>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-end">
                <Button>Save Attendance</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Attendance Reports</CardTitle>
              <CardDescription>View and download attendance reports</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Reports feature coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leave" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Leave Requests</CardTitle>
              <CardDescription>Manage student and staff leave requests</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Leave management feature coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
