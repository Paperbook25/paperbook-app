import { http, HttpResponse, delay } from 'msw'
import { students, studentDocuments, getStudentTimeline, getNextClass, CLASSES, SECTIONS } from '../data/students.data'
import type { StudentDocument } from '@/features/students/types/student.types'

function generateId(): string {
  return Math.random().toString(36).substring(2, 9) + Date.now().toString(36)
}

export const studentsHandlers = [
  // ==================== TIMELINE ====================

  http.get('/api/students/:id/timeline', async ({ params }) => {
    await delay(300)
    const student = students.find((s) => s.id === params.id)
    if (!student) {
      return HttpResponse.json({ error: 'Student not found' }, { status: 404 })
    }
    const timeline = getStudentTimeline(params.id as string)
    return HttpResponse.json({ data: timeline })
  }),

  // ==================== DOCUMENTS ====================

  http.get('/api/students/:id/documents', async ({ params }) => {
    await delay(300)
    const docs = studentDocuments.filter((d) => d.studentId === params.id)
    return HttpResponse.json({ data: docs })
  }),

  http.post('/api/students/:id/documents', async ({ params, request }) => {
    await delay(400)
    const body = await request.json() as {
      type: string
      name: string
      fileName: string
      fileSize: number
      mimeType: string
    }

    const newDoc: StudentDocument = {
      id: generateId(),
      studentId: params.id as string,
      type: body.type as StudentDocument['type'],
      name: body.name,
      fileName: body.fileName,
      fileSize: body.fileSize,
      mimeType: body.mimeType,
      url: `/uploads/documents/${params.id}/${body.fileName}`,
      uploadedAt: new Date().toISOString(),
      uploadedBy: 'Current User',
      verified: false,
    }

    studentDocuments.push(newDoc)
    return HttpResponse.json({ data: newDoc }, { status: 201 })
  }),

  http.delete('/api/students/:studentId/documents/:docId', async ({ params }) => {
    await delay(300)
    const index = studentDocuments.findIndex((d) => d.id === params.docId && d.studentId === params.studentId)
    if (index === -1) {
      return HttpResponse.json({ error: 'Document not found' }, { status: 404 })
    }
    studentDocuments.splice(index, 1)
    return HttpResponse.json({ success: true })
  }),

  http.patch('/api/students/:studentId/documents/:docId/verify', async ({ params }) => {
    await delay(300)
    const doc = studentDocuments.find((d) => d.id === params.docId && d.studentId === params.studentId)
    if (!doc) {
      return HttpResponse.json({ error: 'Document not found' }, { status: 404 })
    }
    doc.verified = true
    doc.verifiedAt = new Date().toISOString()
    doc.verifiedBy = 'Current User'
    return HttpResponse.json({ data: doc })
  }),

  // ==================== PROMOTION ====================

  http.post('/api/students/promote', async ({ request }) => {
    await delay(600)
    const body = await request.json() as {
      studentIds: string[]
      fromClass: string
      toClass: string
      academicYear: string
      newSection?: string
      autoAssignRollNumbers: boolean
    }

    const details: {
      studentId: string
      studentName: string
      fromClass: string
      toClass: string
      newSection: string
      newRollNumber: number
      success: boolean
      error?: string
    }[] = []

    let rollCounter = 1

    for (const studentId of body.studentIds) {
      const student = students.find((s) => s.id === studentId)
      if (!student) {
        details.push({
          studentId,
          studentName: 'Unknown',
          fromClass: body.fromClass,
          toClass: body.toClass,
          newSection: body.newSection || 'A',
          newRollNumber: 0,
          success: false,
          error: 'Student not found',
        })
        continue
      }

      if (student.class !== body.fromClass) {
        details.push({
          studentId,
          studentName: student.name,
          fromClass: body.fromClass,
          toClass: body.toClass,
          newSection: body.newSection || student.section,
          newRollNumber: 0,
          success: false,
          error: `Student is in ${student.class}, not ${body.fromClass}`,
        })
        continue
      }

      const newSection = body.newSection || student.section
      const newRoll = body.autoAssignRollNumbers ? rollCounter++ : student.rollNumber

      student.class = body.toClass
      student.section = newSection
      student.rollNumber = newRoll

      details.push({
        studentId,
        studentName: student.name,
        fromClass: body.fromClass,
        toClass: body.toClass,
        newSection,
        newRollNumber: newRoll,
        success: true,
      })
    }

    return HttpResponse.json({
      data: {
        promoted: details.filter((d) => d.success).length,
        failed: details.filter((d) => !d.success).length,
        details,
      },
    })
  }),

  // ==================== SIBLING LINKING ====================

  http.get('/api/students/:id/siblings', async ({ params }) => {
    await delay(200)
    const student = students.find((s) => s.id === params.id)
    if (!student) {
      return HttpResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    const siblingIds = student.siblingIds || []
    const siblings = siblingIds
      .map((sid) => students.find((s) => s.id === sid))
      .filter(Boolean)
      .map((s) => ({
        id: s!.id,
        name: s!.name,
        class: s!.class,
        section: s!.section,
        rollNumber: s!.rollNumber,
        photoUrl: s!.photoUrl,
      }))

    return HttpResponse.json({ data: siblings })
  }),

  http.post('/api/students/:id/siblings', async ({ params, request }) => {
    await delay(300)
    const body = await request.json() as { siblingId: string }
    const student = students.find((s) => s.id === params.id)
    const sibling = students.find((s) => s.id === body.siblingId)

    if (!student || !sibling) {
      return HttpResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    if (!student.siblingIds) student.siblingIds = []
    if (!sibling.siblingIds) sibling.siblingIds = []

    if (!student.siblingIds.includes(body.siblingId)) {
      student.siblingIds.push(body.siblingId)
    }
    if (!sibling.siblingIds.includes(params.id as string)) {
      sibling.siblingIds.push(params.id as string)
    }

    return HttpResponse.json({ success: true })
  }),

  http.delete('/api/students/:id/siblings/:siblingId', async ({ params }) => {
    await delay(300)
    const student = students.find((s) => s.id === params.id)
    const sibling = students.find((s) => s.id === params.siblingId)

    if (student?.siblingIds) {
      student.siblingIds = student.siblingIds.filter((id) => id !== params.siblingId)
    }
    if (sibling?.siblingIds) {
      sibling.siblingIds = sibling.siblingIds.filter((id) => id !== params.id)
    }

    return HttpResponse.json({ success: true })
  }),

  // ==================== HEALTH RECORDS ====================

  http.get('/api/students/:id/health', async ({ params }) => {
    await delay(200)
    const student = students.find((s) => s.id === params.id)
    if (!student) {
      return HttpResponse.json({ error: 'Student not found' }, { status: 404 })
    }
    return HttpResponse.json({ data: student.healthRecord || null })
  }),

  http.put('/api/students/:id/health', async ({ params, request }) => {
    await delay(300)
    const student = students.find((s) => s.id === params.id)
    if (!student) {
      return HttpResponse.json({ error: 'Student not found' }, { status: 404 })
    }
    const body = await request.json() as any
    student.healthRecord = body
    return HttpResponse.json({ data: student.healthRecord })
  }),

  // ==================== ID CARD ====================

  http.get('/api/students/:id/id-card', async ({ params }) => {
    await delay(300)
    const student = students.find((s) => s.id === params.id)
    if (!student) {
      return HttpResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    return HttpResponse.json({
      data: {
        studentId: student.id,
        name: student.name,
        class: student.class,
        section: student.section,
        rollNumber: student.rollNumber,
        admissionNumber: student.admissionNumber,
        dateOfBirth: student.dateOfBirth,
        bloodGroup: student.bloodGroup,
        photoUrl: student.photoUrl,
        parentName: student.parent.fatherName,
        parentPhone: student.parent.guardianPhone,
        address: `${student.address.street}, ${student.address.city}`,
        schoolName: 'Paperbook International School',
        schoolLogo: '/logo.svg',
        academicYear: '2024-25',
        validUntil: '2025-03-31',
      },
    })
  }),

  // ==================== BULK IMPORT ====================

  http.post('/api/students/bulk-import', async ({ request }) => {
    await delay(800)
    const body = await request.json() as { rows: any[] }
    const results = {
      total: body.rows.length,
      successful: 0,
      failed: 0,
      errors: [] as { row: number; field: string; message: string }[],
    }

    for (let i = 0; i < body.rows.length; i++) {
      const row = body.rows[i]

      // Validate required fields
      if (!row.name) {
        results.errors.push({ row: i + 1, field: 'name', message: 'Name is required' })
        results.failed++
        continue
      }
      if (!row.class) {
        results.errors.push({ row: i + 1, field: 'class', message: 'Class is required' })
        results.failed++
        continue
      }
      if (!row.section) {
        results.errors.push({ row: i + 1, field: 'section', message: 'Section is required' })
        results.failed++
        continue
      }

      const now = new Date()
      const count = students.length + 1
      const newStudent = {
        id: generateId(),
        admissionNumber: `ADM${now.getFullYear()}${String(count).padStart(4, '0')}`,
        name: row.name,
        email: row.email || '',
        phone: row.phone || '',
        dateOfBirth: row.dateOfBirth || '',
        gender: (row.gender?.toLowerCase() || 'male') as 'male' | 'female',
        bloodGroup: row.bloodGroup || 'O+',
        class: row.class,
        section: row.section,
        rollNumber: row.rollNumber || students.filter((s) => s.class === row.class && s.section === row.section).length + 1,
        admissionDate: now.toISOString(),
        photoUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${row.name.replace(/\s/g, '')}`,
        address: { street: row.street || '', city: row.city || '', state: row.state || '', pincode: row.pincode || '' },
        parent: {
          fatherName: row.fatherName || '',
          motherName: row.motherName || '',
          guardianPhone: row.guardianPhone || '',
          guardianEmail: row.guardianEmail || '',
          occupation: row.occupation || '',
        },
        status: 'active' as const,
      }

      students.push(newStudent)
      results.successful++
    }

    return HttpResponse.json({ data: results })
  }),

  // ==================== MESSAGING ====================

  http.post('/api/students/:id/message-parent', async ({ request }) => {
    await delay(500)
    const body = await request.json() as {
      channel: 'sms' | 'email' | 'whatsapp' | 'all'
      subject?: string
      message: string
    }

    const sentVia = body.channel === 'all'
      ? ['sms', 'email', 'whatsapp']
      : [body.channel]

    return HttpResponse.json({
      data: {
        success: true,
        sentVia,
      },
    })
  }),

  // ==================== BULK EXPORT ====================

  http.get('/api/students/export', async ({ request }) => {
    await delay(500)
    const url = new URL(request.url)
    const classFilter = url.searchParams.get('class')
    const sectionFilter = url.searchParams.get('section')

    let filtered = students.filter((s) => s.status === 'active')
    if (classFilter) filtered = filtered.filter((s) => s.class === classFilter)
    if (sectionFilter) filtered = filtered.filter((s) => s.section === sectionFilter)

    const exportData = filtered.map((s) => ({
      admissionNumber: s.admissionNumber,
      name: s.name,
      email: s.email,
      phone: s.phone,
      dateOfBirth: s.dateOfBirth,
      gender: s.gender,
      bloodGroup: s.bloodGroup,
      class: s.class,
      section: s.section,
      rollNumber: s.rollNumber,
      fatherName: s.parent.fatherName,
      motherName: s.parent.motherName,
      guardianPhone: s.parent.guardianPhone,
      guardianEmail: s.parent.guardianEmail,
      address: `${s.address.street}, ${s.address.city}, ${s.address.state} - ${s.address.pincode}`,
      status: s.status,
    }))

    return HttpResponse.json({ data: exportData })
  }),
]
