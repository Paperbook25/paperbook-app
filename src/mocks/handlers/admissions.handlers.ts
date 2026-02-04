import { http, HttpResponse, delay } from 'msw'
import { applications, filterApplications, applicationStats } from '../data/admissions.data'
import type {
  Application,
  ApplicationDocument,
  ApplicationNote,
  ApplicationStatus,
  CreateApplicationRequest,
  StatusChange,
  UpdateApplicationRequest,
} from '@/features/admissions/types/admission.types'

// Helper to generate IDs
function generateId(): string {
  return Math.random().toString(36).substring(2, 9) + Date.now().toString(36)
}

// Helper to generate application number
function generateApplicationNumber(): string {
  const year = new Date().getFullYear()
  const count = applications.length + 1
  return `APP${year}${String(count).padStart(4, '0')}`
}

export const admissionsHandlers = [
  // Get all applications with filters and pagination
  http.get('/api/admissions', async ({ request }) => {
    await delay(300)
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '10')
    const search = url.searchParams.get('search') || ''
    const status = url.searchParams.get('status') as ApplicationStatus | 'all' | null
    const classFilter = url.searchParams.get('class')
    const dateFrom = url.searchParams.get('dateFrom')
    const dateTo = url.searchParams.get('dateTo')

    const filtered = filterApplications({
      search: search || undefined,
      status: status || undefined,
      class: classFilter || undefined,
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
    })

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

  // Get application stats
  http.get('/api/admissions/stats', async () => {
    await delay(200)
    return HttpResponse.json({ data: applicationStats })
  }),

  // Get single application by ID
  http.get('/api/admissions/:id', async ({ params }) => {
    await delay(200)
    const application = applications.find((a) => a.id === params.id)

    if (!application) {
      return HttpResponse.json({ error: 'Application not found' }, { status: 404 })
    }

    return HttpResponse.json({ data: application })
  }),

  // Create new application
  http.post('/api/admissions', async ({ request }) => {
    await delay(400)
    const body = (await request.json()) as CreateApplicationRequest

    const newApplication: Application = {
      id: generateId(),
      applicationNumber: generateApplicationNumber(),
      status: 'applied',

      // Student Info
      studentName: body.studentName,
      dateOfBirth: body.dateOfBirth,
      gender: body.gender,
      photoUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${body.studentName.replace(/\s/g, '')}&backgroundColor=b6e3f4,c0aede,d1d4f9`,

      // Contact Info
      email: body.email,
      phone: body.phone,
      address: body.address,

      // Academic Info
      applyingForClass: body.applyingForClass,
      previousSchool: body.previousSchool,
      previousClass: body.previousClass,
      previousMarks: body.previousMarks,

      // Parent Info
      fatherName: body.fatherName,
      motherName: body.motherName,
      guardianPhone: body.guardianPhone,
      guardianEmail: body.guardianEmail,
      guardianOccupation: body.guardianOccupation,

      // Application Details
      appliedDate: new Date().toISOString(),

      // Documents
      documents: [],

      // Timeline
      statusHistory: [
        {
          id: generateId(),
          fromStatus: null,
          toStatus: 'applied',
          changedAt: new Date().toISOString(),
          changedBy: 'System',
          note: 'Application submitted',
        },
      ],
      notes: [],

      // Metadata
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    applications.unshift(newApplication)

    return HttpResponse.json({ data: newApplication }, { status: 201 })
  }),

  // Update application
  http.put('/api/admissions/:id', async ({ params, request }) => {
    await delay(300)
    const applicationIndex = applications.findIndex((a) => a.id === params.id)

    if (applicationIndex === -1) {
      return HttpResponse.json({ error: 'Application not found' }, { status: 404 })
    }

    const body = (await request.json()) as UpdateApplicationRequest
    const updatedApplication = {
      ...applications[applicationIndex],
      ...body,
      updatedAt: new Date().toISOString(),
    }

    applications[applicationIndex] = updatedApplication

    return HttpResponse.json({ data: updatedApplication })
  }),

  // Update application status
  http.patch('/api/admissions/:id/status', async ({ params, request }) => {
    await delay(300)
    const applicationIndex = applications.findIndex((a) => a.id === params.id)

    if (applicationIndex === -1) {
      return HttpResponse.json({ error: 'Application not found' }, { status: 404 })
    }

    const body = (await request.json()) as { status: ApplicationStatus; note?: string }
    const application = applications[applicationIndex]

    const statusChange: StatusChange = {
      id: generateId(),
      fromStatus: application.status,
      toStatus: body.status,
      changedAt: new Date().toISOString(),
      changedBy: 'Current User', // In real app, would come from auth context
      note: body.note,
    }

    const updatedApplication: Application = {
      ...application,
      status: body.status,
      statusHistory: [...application.statusHistory, statusChange],
      updatedAt: new Date().toISOString(),
    }

    applications[applicationIndex] = updatedApplication

    return HttpResponse.json({ data: updatedApplication })
  }),

  // Add document to application
  http.post('/api/admissions/:id/documents', async ({ params, request }) => {
    await delay(400)
    const applicationIndex = applications.findIndex((a) => a.id === params.id)

    if (applicationIndex === -1) {
      return HttpResponse.json({ error: 'Application not found' }, { status: 404 })
    }

    const body = (await request.json()) as { type: string; name: string; url: string }

    const newDocument: ApplicationDocument = {
      id: generateId(),
      type: body.type as ApplicationDocument['type'],
      name: body.name,
      url: body.url,
      uploadedAt: new Date().toISOString(),
      status: 'pending',
    }

    const application = applications[applicationIndex]
    const updatedApplication: Application = {
      ...application,
      documents: [...application.documents, newDocument],
      updatedAt: new Date().toISOString(),
    }

    applications[applicationIndex] = updatedApplication

    return HttpResponse.json({ data: newDocument }, { status: 201 })
  }),

  // Verify/reject document
  http.patch('/api/admissions/:id/documents/:docId', async ({ params, request }) => {
    await delay(300)
    const applicationIndex = applications.findIndex((a) => a.id === params.id)

    if (applicationIndex === -1) {
      return HttpResponse.json({ error: 'Application not found' }, { status: 404 })
    }

    const body = (await request.json()) as { status: 'verified' | 'rejected'; rejectionReason?: string }
    const application = applications[applicationIndex]
    const docIndex = application.documents.findIndex((d) => d.id === params.docId)

    if (docIndex === -1) {
      return HttpResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    const updatedDocument: ApplicationDocument = {
      ...application.documents[docIndex],
      status: body.status,
      verifiedBy: body.status === 'verified' ? 'Current User' : undefined,
      verifiedAt: body.status === 'verified' ? new Date().toISOString() : undefined,
      rejectionReason: body.rejectionReason,
    }

    const updatedDocuments = [...application.documents]
    updatedDocuments[docIndex] = updatedDocument

    const updatedApplication: Application = {
      ...application,
      documents: updatedDocuments,
      updatedAt: new Date().toISOString(),
    }

    applications[applicationIndex] = updatedApplication

    return HttpResponse.json({ data: updatedDocument })
  }),

  // Add note to application
  http.post('/api/admissions/:id/notes', async ({ params, request }) => {
    await delay(300)
    const applicationIndex = applications.findIndex((a) => a.id === params.id)

    if (applicationIndex === -1) {
      return HttpResponse.json({ error: 'Application not found' }, { status: 404 })
    }

    const body = (await request.json()) as { content: string }

    const newNote: ApplicationNote = {
      id: generateId(),
      content: body.content,
      createdAt: new Date().toISOString(),
      createdBy: 'current-user-id', // In real app, would come from auth context
      createdByName: 'Current User',
    }

    const application = applications[applicationIndex]
    const updatedApplication: Application = {
      ...application,
      notes: [newNote, ...application.notes],
      updatedAt: new Date().toISOString(),
    }

    applications[applicationIndex] = updatedApplication

    return HttpResponse.json({ data: newNote }, { status: 201 })
  }),

  // Schedule interview
  http.patch('/api/admissions/:id/interview', async ({ params, request }) => {
    await delay(300)
    const applicationIndex = applications.findIndex((a) => a.id === params.id)

    if (applicationIndex === -1) {
      return HttpResponse.json({ error: 'Application not found' }, { status: 404 })
    }

    const body = (await request.json()) as { interviewDate: string }
    const application = applications[applicationIndex]

    const updatedApplication: Application = {
      ...application,
      interviewDate: body.interviewDate,
      updatedAt: new Date().toISOString(),
    }

    applications[applicationIndex] = updatedApplication

    return HttpResponse.json({ data: updatedApplication })
  }),

  // Schedule entrance exam
  http.patch('/api/admissions/:id/entrance-exam', async ({ params, request }) => {
    await delay(300)
    const applicationIndex = applications.findIndex((a) => a.id === params.id)

    if (applicationIndex === -1) {
      return HttpResponse.json({ error: 'Application not found' }, { status: 404 })
    }

    const body = (await request.json()) as { entranceExamDate: string }
    const application = applications[applicationIndex]

    const updatedApplication: Application = {
      ...application,
      entranceExamDate: body.entranceExamDate,
      updatedAt: new Date().toISOString(),
    }

    applications[applicationIndex] = updatedApplication

    return HttpResponse.json({ data: updatedApplication })
  }),

  // Delete application
  http.delete('/api/admissions/:id', async ({ params }) => {
    await delay(300)
    const applicationIndex = applications.findIndex((a) => a.id === params.id)

    if (applicationIndex === -1) {
      return HttpResponse.json({ error: 'Application not found' }, { status: 404 })
    }

    applications.splice(applicationIndex, 1)

    return HttpResponse.json({ success: true })
  }),
]
