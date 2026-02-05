import { setupWorker } from 'msw/browser'
import { http, HttpResponse, delay } from 'msw'
import { students, type Student } from './data/students.data'
import { staff } from './data/staff.data'
import { dashboardStats, feeCollectionData, attendanceData, announcements, upcomingEvents, recentActivities, quickStats, classWiseStudents } from './data/dashboard.data'
import { admissionsHandlers } from './handlers/admissions.handlers'
import { staffHandlers } from './handlers/staff.handlers'
import { libraryHandlers } from './handlers/library.handlers'
import { financeHandlers } from './handlers/finance.handlers'
import { settingsHandlers } from './handlers/settings.handlers'
import { integrationsHandlers } from './handlers/integrations.handlers'
import { examsHandlers } from './handlers/exams.handlers'
import { attendanceHandlers } from './handlers/attendance.handlers'
import { applications } from './data/admissions.data'
import { getUserContext, isParent } from './utils/auth-context'
import { studentFees } from './data/finance.data'
import { issuedBooks } from './data/library.data'
import { generateStudentAttendanceView } from './data/attendance.data'

const handlers = [
  // Dashboard
  http.get('/api/dashboard/stats', async () => {
    await delay(200)
    return HttpResponse.json({ data: dashboardStats })
  }),

  http.get('/api/dashboard/fee-collection', async () => {
    await delay(200)
    return HttpResponse.json({ data: feeCollectionData })
  }),

  http.get('/api/dashboard/attendance', async () => {
    await delay(200)
    return HttpResponse.json({ data: attendanceData })
  }),

  http.get('/api/dashboard/class-wise-students', async () => {
    await delay(200)
    return HttpResponse.json({ data: classWiseStudents })
  }),

  http.get('/api/dashboard/announcements', async () => {
    await delay(200)
    return HttpResponse.json({ data: announcements })
  }),

  http.get('/api/dashboard/events', async () => {
    await delay(200)
    return HttpResponse.json({ data: upcomingEvents })
  }),

  http.get('/api/dashboard/activities', async () => {
    await delay(200)
    return HttpResponse.json({ data: recentActivities })
  }),

  http.get('/api/dashboard/quick-stats', async () => {
    await delay(200)
    return HttpResponse.json({ data: quickStats })
  }),

  // ==================== USER-SCOPED ====================

  // Get parent's children with aggregated stats
  http.get('/api/users/my-children', async ({ request }) => {
    await delay(300)

    const context = getUserContext(request)

    if (!context || !isParent(context)) {
      return HttpResponse.json({ error: 'Unauthorized - Parent access required' }, { status: 403 })
    }

    if (!context.childIds || context.childIds.length === 0) {
      return HttpResponse.json({ error: 'No children linked to account' }, { status: 404 })
    }

    // Build children data with aggregated stats
    const children = context.childIds.map((childId) => {
      // Find student in students array or generate mock data
      const student = students.find((s) => s.id === childId)

      // Get attendance data
      const attendanceData = generateStudentAttendanceView(childId)

      // Get fees data
      const fees = studentFees.filter((sf) => sf.studentId === childId)
      const totalFees = fees.reduce((sum, f) => sum + f.totalAmount, 0)
      const totalPaid = fees.reduce((sum, f) => sum + f.paidAmount, 0)
      const totalDiscount = fees.reduce((sum, f) => sum + f.discountAmount, 0)
      const pendingFees = totalFees - totalPaid - totalDiscount

      // Get library books count
      const libraryBooks = issuedBooks.filter(
        (ib) => ib.studentId === childId && ib.status !== 'returned'
      ).length

      return {
        id: childId,
        name: student?.name || `Student ${childId}`,
        class: student?.class || 'Class 10',
        section: student?.section || 'A',
        rollNumber: student?.rollNumber || 1,
        avatar: student?.photoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${childId}`,
        attendance: {
          percentage: attendanceData.summary.attendancePercentage,
          presentDays: attendanceData.summary.presentDays,
          absentDays: attendanceData.summary.absentDays,
          totalDays: attendanceData.summary.totalDays,
        },
        pendingFees,
        libraryBooks,
      }
    })

    return HttpResponse.json({ data: children })
  }),

  // Students
  http.get('/api/students', async ({ request }) => {
    await delay(300)
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '10')
    const search = url.searchParams.get('search') || ''
    const classFilter = url.searchParams.get('class')
    const section = url.searchParams.get('section')
    const status = url.searchParams.get('status')

    let filtered = [...students]

    if (search) {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter(
        (s) =>
          s.name.toLowerCase().includes(searchLower) ||
          s.admissionNumber.toLowerCase().includes(searchLower) ||
          s.email.toLowerCase().includes(searchLower)
      )
    }

    if (classFilter) {
      filtered = filtered.filter((s) => s.class === classFilter)
    }

    if (section) {
      filtered = filtered.filter((s) => s.section === section)
    }

    if (status) {
      filtered = filtered.filter((s) => s.status === status)
    }

    const total = filtered.length
    const start = (page - 1) * limit
    const paginatedData = filtered.slice(start, start + limit)

    return HttpResponse.json({
      data: paginatedData,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })
  }),

  http.get('/api/students/:id', async ({ params }) => {
    await delay(200)
    const student = students.find((s) => s.id === params.id)

    if (!student) {
      return HttpResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    return HttpResponse.json({ data: student })
  }),

  // Create student (used by enrollment)
  http.post('/api/students', async ({ request }) => {
    await delay(400)
    const body = await request.json() as Partial<Student> & { firstName?: string; lastName?: string }

    const now = new Date()
    const admissionYear = now.getFullYear()
    const count = students.length + 1

    // Support both name and firstName/lastName patterns
    const name = body.name || (body.firstName && body.lastName ? `${body.firstName} ${body.lastName}` : '')

    const newStudent: Student = {
      id: Math.random().toString(36).substring(2, 9) + Date.now().toString(36),
      admissionNumber: `ADM${admissionYear}${String(count).padStart(4, '0')}`,
      name,
      email: body.email || '',
      phone: body.phone || '',
      dateOfBirth: body.dateOfBirth || '',
      gender: body.gender || 'male',
      bloodGroup: body.bloodGroup || 'O+',
      class: body.class || '',
      section: body.section || 'A',
      rollNumber: body.rollNumber || 1,
      admissionDate: now.toISOString(),
      photoUrl: body.photoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${name.replace(/\s/g, '')}`,
      address: body.address || { street: '', city: '', state: '', pincode: '' },
      parent: body.parent || { fatherName: '', motherName: '', guardianPhone: '', guardianEmail: '', occupation: '' },
      status: 'active',
    }

    students.unshift(newStudent)

    return HttpResponse.json({ data: newStudent }, { status: 201 })
  }),

  // Update student
  http.put('/api/students/:id', async ({ params, request }) => {
    await delay(300)
    const studentIndex = students.findIndex((s) => s.id === params.id)

    if (studentIndex === -1) {
      return HttpResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    const body = await request.json() as Partial<Student> & { firstName?: string; lastName?: string }
    const existingStudent = students[studentIndex]

    // Support both name and firstName/lastName patterns
    let name = existingStudent.name
    if (body.name) {
      name = body.name
    } else if (body.firstName && body.lastName) {
      name = `${body.firstName} ${body.lastName}`
    }

    const updatedStudent: Student = {
      ...existingStudent,
      ...body,
      name,
      photoUrl: body.photoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${name.replace(/\s/g, '')}`,
    }

    students[studentIndex] = updatedStudent

    return HttpResponse.json({ data: updatedStudent })
  }),

  // Delete student
  http.delete('/api/students/:id', async ({ params }) => {
    await delay(300)
    const studentIndex = students.findIndex((s) => s.id === params.id)

    if (studentIndex === -1) {
      return HttpResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    students.splice(studentIndex, 1)

    return HttpResponse.json({ success: true })
  }),

  // Enroll student from application
  http.post('/api/students/enroll', async ({ request }) => {
    await delay(500)
    const body = await request.json() as {
      applicationId: string
      section: string
      rollNumber: number
      bloodGroup: string
    }

    // Find the application
    const applicationIndex = applications.findIndex((a) => a.id === body.applicationId)
    if (applicationIndex === -1) {
      return HttpResponse.json({ error: 'Application not found' }, { status: 404 })
    }

    const application = applications[applicationIndex]

    // Check if already enrolled
    if (application.status === 'enrolled') {
      return HttpResponse.json({ error: 'Application already enrolled' }, { status: 400 })
    }

    // Create the student
    const now = new Date()
    const admissionYear = now.getFullYear()
    const count = students.length + 1

    const newStudent: Student = {
      id: Math.random().toString(36).substring(2, 9) + Date.now().toString(36),
      admissionNumber: `ADM${admissionYear}${String(count).padStart(4, '0')}`,
      name: application.studentName,
      email: application.email,
      phone: application.phone,
      dateOfBirth: application.dateOfBirth,
      gender: application.gender,
      bloodGroup: body.bloodGroup,
      class: application.applyingForClass,
      section: body.section,
      rollNumber: body.rollNumber,
      admissionDate: now.toISOString(),
      photoUrl: application.photoUrl,
      address: application.address,
      parent: {
        fatherName: application.fatherName,
        motherName: application.motherName,
        guardianPhone: application.guardianPhone,
        guardianEmail: application.guardianEmail,
        occupation: application.guardianOccupation,
      },
      status: 'active',
    }

    students.unshift(newStudent)

    // Update application status to enrolled
    const updatedApplication = {
      ...application,
      status: 'enrolled' as const,
      enrolledStudentId: newStudent.id,
      statusHistory: [
        ...application.statusHistory,
        {
          id: Math.random().toString(36).substring(2, 9),
          fromStatus: application.status,
          toStatus: 'enrolled' as const,
          changedAt: now.toISOString(),
          changedBy: 'Current User',
          note: `Student enrolled with roll number ${body.rollNumber} in Section ${body.section}`,
        },
      ],
      updatedAt: now.toISOString(),
    }

    applications[applicationIndex] = updatedApplication

    return HttpResponse.json({
      student: newStudent,
      application: updatedApplication
    }, { status: 201 })
  }),

  // Get next roll number for a class/section
  http.get('/api/students/next-roll-number', async ({ request }) => {
    await delay(200)
    const url = new URL(request.url)
    const className = url.searchParams.get('class') || ''
    const section = url.searchParams.get('section') || ''

    // Find the highest roll number in this class/section
    const classStudents = students.filter(
      (s) => s.class === className && s.section === section
    )

    const maxRollNumber = classStudents.reduce(
      (max, s) => Math.max(max, s.rollNumber),
      0
    )

    return HttpResponse.json({ nextRollNumber: maxRollNumber + 1 })
  }),

  // Staff
  http.get('/api/staff', async ({ request }) => {
    await delay(300)
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '10')
    const search = url.searchParams.get('search') || ''
    const department = url.searchParams.get('department')
    const status = url.searchParams.get('status')

    let filtered = [...staff]

    if (search) {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter(
        (s) =>
          s.name.toLowerCase().includes(searchLower) ||
          s.employeeId.toLowerCase().includes(searchLower) ||
          s.email.toLowerCase().includes(searchLower)
      )
    }

    if (department) {
      filtered = filtered.filter((s) => s.department === department)
    }

    if (status) {
      filtered = filtered.filter((s) => s.status === status)
    }

    const total = filtered.length
    const start = (page - 1) * limit
    const paginatedData = filtered.slice(start, start + limit)

    return HttpResponse.json({
      data: paginatedData,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })
  }),

  http.get('/api/staff/:id', async ({ params }) => {
    await delay(200)
    const member = staff.find((s) => s.id === params.id)

    if (!member) {
      return HttpResponse.json({ error: 'Staff member not found' }, { status: 404 })
    }

    return HttpResponse.json({ data: member })
  }),
]

export const worker = setupWorker(...handlers, ...admissionsHandlers, ...staffHandlers, ...libraryHandlers, ...financeHandlers, ...settingsHandlers, ...integrationsHandlers, ...examsHandlers, ...attendanceHandlers)
