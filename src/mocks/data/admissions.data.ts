import { faker } from '@faker-js/faker'
import type {
  Application,
  ApplicationDocument,
  ApplicationNote,
  ApplicationStatus,
  DocumentStatus,
  DocumentType,
  StatusChange,
} from '@/features/admissions/types/admission.types'

const CLASSES = [
  'Nursery',
  'LKG',
  'UKG',
  'Class 1',
  'Class 2',
  'Class 3',
  'Class 4',
  'Class 5',
  'Class 6',
  'Class 7',
  'Class 8',
  'Class 9',
  'Class 10',
  'Class 11',
  'Class 12',
]

const INDIAN_STATES = [
  'Maharashtra',
  'Karnataka',
  'Tamil Nadu',
  'Delhi',
  'Gujarat',
  'Rajasthan',
  'Uttar Pradesh',
  'West Bengal',
  'Kerala',
  'Telangana',
]

const SCHOOLS = [
  'Delhi Public School',
  'Kendriya Vidyalaya',
  'Ryan International School',
  'DAV Public School',
  'Army Public School',
  'St. Xavier\'s School',
  'Modern School',
  'Bal Bharati Public School',
  'Springdales School',
  'Sanskriti School',
]

const STAFF_NAMES = [
  'Mrs. Sharma',
  'Mr. Gupta',
  'Ms. Patel',
  'Mr. Singh',
  'Mrs. Reddy',
  'Mr. Kumar',
  'Ms. Verma',
  'Mr. Joshi',
]

const DOCUMENT_TYPES: DocumentType[] = [
  'birth_certificate',
  'previous_marksheet',
  'transfer_certificate',
  'address_proof',
  'photo',
  'parent_id',
]

// Status flow probabilities based on realistic admission process
const STATUS_WEIGHTS: { value: ApplicationStatus; weight: number }[] = [
  { value: 'applied', weight: 15 },
  { value: 'under_review', weight: 12 },
  { value: 'document_verification', weight: 10 },
  { value: 'entrance_exam', weight: 8 },
  { value: 'interview', weight: 10 },
  { value: 'approved', weight: 18 },
  { value: 'rejected', weight: 8 },
  { value: 'enrolled', weight: 15 },
  { value: 'withdrawn', weight: 4 },
]

function generateApplicationNumber(year: number, index: number): string {
  return `APP${year}${String(index).padStart(4, '0')}`
}

function generateDocuments(status: ApplicationStatus): ApplicationDocument[] {
  const hasDocuments = ['document_verification', 'entrance_exam', 'interview', 'approved', 'enrolled'].includes(status)

  if (!hasDocuments && faker.datatype.boolean(0.3)) {
    return []
  }

  const docCount = faker.number.int({ min: 2, max: 6 })
  const selectedTypes = faker.helpers.arrayElements(DOCUMENT_TYPES, docCount)

  return selectedTypes.map((type) => {
    const uploadedAt = faker.date.recent({ days: 30 }).toISOString()
    const isVerified = ['approved', 'enrolled'].includes(status) || faker.datatype.boolean(0.6)
    const docStatus: DocumentStatus = isVerified
      ? 'verified'
      : faker.datatype.boolean(0.1) ? 'rejected' : 'pending'

    return {
      id: faker.string.uuid(),
      type,
      name: `${type.replace(/_/g, ' ')}_${faker.string.alphanumeric(8)}.pdf`,
      url: `/documents/${faker.string.uuid()}.pdf`,
      uploadedAt,
      status: docStatus,
      verifiedBy: docStatus === 'verified' ? faker.helpers.arrayElement(STAFF_NAMES) : undefined,
      verifiedAt: docStatus === 'verified' ? faker.date.recent({ days: 7 }).toISOString() : undefined,
      rejectionReason: docStatus === 'rejected' ? 'Document not clear. Please upload a better quality scan.' : undefined,
    }
  })
}

function generateStatusHistory(currentStatus: ApplicationStatus, appliedDate: Date): StatusChange[] {
  const statusFlow: ApplicationStatus[] = [
    'applied',
    'under_review',
    'document_verification',
    'entrance_exam',
    'interview',
    'approved',
    'enrolled',
  ]

  const currentIndex = statusFlow.indexOf(currentStatus)
  const history: StatusChange[] = []

  // Start with applied
  let currentDate = new Date(appliedDate)
  history.push({
    id: faker.string.uuid(),
    fromStatus: null,
    toStatus: 'applied',
    changedAt: currentDate.toISOString(),
    changedBy: 'System',
    note: 'Application submitted online',
  })

  // Handle special cases
  if (currentStatus === 'rejected') {
    const rejectAt = faker.number.int({ min: 1, max: 3 })
    for (let i = 1; i <= rejectAt && i < statusFlow.length; i++) {
      currentDate = new Date(currentDate.getTime() + faker.number.int({ min: 1, max: 5 }) * 24 * 60 * 60 * 1000)
      history.push({
        id: faker.string.uuid(),
        fromStatus: statusFlow[i - 1],
        toStatus: statusFlow[i],
        changedAt: currentDate.toISOString(),
        changedBy: faker.helpers.arrayElement(STAFF_NAMES),
      })
    }
    currentDate = new Date(currentDate.getTime() + faker.number.int({ min: 1, max: 3 }) * 24 * 60 * 60 * 1000)
    history.push({
      id: faker.string.uuid(),
      fromStatus: history[history.length - 1].toStatus,
      toStatus: 'rejected',
      changedAt: currentDate.toISOString(),
      changedBy: faker.helpers.arrayElement(STAFF_NAMES),
      note: faker.helpers.arrayElement([
        'Does not meet admission criteria',
        'Failed entrance examination',
        'Documents verification failed',
        'Incomplete application',
      ]),
    })
    return history
  }

  if (currentStatus === 'withdrawn') {
    const withdrawAt = faker.number.int({ min: 1, max: 4 })
    for (let i = 1; i <= withdrawAt && i < statusFlow.length; i++) {
      currentDate = new Date(currentDate.getTime() + faker.number.int({ min: 1, max: 5 }) * 24 * 60 * 60 * 1000)
      history.push({
        id: faker.string.uuid(),
        fromStatus: statusFlow[i - 1],
        toStatus: statusFlow[i],
        changedAt: currentDate.toISOString(),
        changedBy: faker.helpers.arrayElement(STAFF_NAMES),
      })
    }
    currentDate = new Date(currentDate.getTime() + faker.number.int({ min: 1, max: 3 }) * 24 * 60 * 60 * 1000)
    history.push({
      id: faker.string.uuid(),
      fromStatus: history[history.length - 1].toStatus,
      toStatus: 'withdrawn',
      changedAt: currentDate.toISOString(),
      changedBy: 'Applicant',
      note: 'Application withdrawn by parent/guardian',
    })
    return history
  }

  // Normal flow
  for (let i = 1; i <= currentIndex; i++) {
    currentDate = new Date(currentDate.getTime() + faker.number.int({ min: 1, max: 5 }) * 24 * 60 * 60 * 1000)
    history.push({
      id: faker.string.uuid(),
      fromStatus: statusFlow[i - 1],
      toStatus: statusFlow[i],
      changedAt: currentDate.toISOString(),
      changedBy: faker.helpers.arrayElement(STAFF_NAMES),
    })
  }

  return history
}

function generateNotes(status: ApplicationStatus): ApplicationNote[] {
  if (faker.datatype.boolean(0.4)) {
    return []
  }

  const noteCount = faker.number.int({ min: 1, max: 3 })
  const notes: ApplicationNote[] = []

  const sampleNotes = [
    'Parents seem very keen on academic focus',
    'Sibling already studying in Class 5',
    'Father is a doctor, mother is a teacher',
    'Requested for morning batch if possible',
    'Good performance in previous school',
    'Referred by current parent Mr. Sharma',
    'Needs to submit TC from previous school',
    'Interview scheduled with principal',
    'Excellent communication skills observed',
    'Sports achievements noted - district level',
  ]

  for (let i = 0; i < noteCount; i++) {
    const staffName = faker.helpers.arrayElement(STAFF_NAMES)
    notes.push({
      id: faker.string.uuid(),
      content: faker.helpers.arrayElement(sampleNotes),
      createdAt: faker.date.recent({ days: 20 }).toISOString(),
      createdBy: faker.string.uuid(),
      createdByName: staffName,
    })
  }

  return notes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

function createApplication(index: number): Application {
  const firstName = faker.person.firstName()
  const lastName = faker.person.lastName()
  const gender = faker.helpers.arrayElement(['male', 'female']) as 'male' | 'female'
  const appliedDate = faker.date.recent({ days: 60 })
  const status = faker.helpers.weightedArrayElement(STATUS_WEIGHTS) as ApplicationStatus

  const applyingForClass = faker.helpers.arrayElement(CLASSES)
  const previousClassIndex = CLASSES.indexOf(applyingForClass) - 1
  const previousClass = previousClassIndex >= 0 ? CLASSES[previousClassIndex] : 'Pre-School'

  const hasEntranceExam = ['entrance_exam', 'interview', 'approved', 'enrolled'].includes(status)
  const hasInterview = ['interview', 'approved', 'enrolled'].includes(status)

  return {
    id: faker.string.uuid(),
    applicationNumber: generateApplicationNumber(appliedDate.getFullYear(), index + 1),
    status,

    // Student Info
    studentName: `${firstName} ${lastName}`,
    dateOfBirth: faker.date.birthdate({ min: 3, max: 17, mode: 'age' }).toISOString(),
    gender,
    photoUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${firstName}${lastName}&backgroundColor=b6e3f4,c0aede,d1d4f9`,

    // Contact Info
    email: faker.internet.email({ firstName, lastName }).toLowerCase(),
    phone: `+91 ${faker.string.numeric(10)}`,
    address: {
      street: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.helpers.arrayElement(INDIAN_STATES),
      pincode: faker.string.numeric(6),
    },

    // Academic Info
    applyingForClass,
    previousSchool: faker.helpers.arrayElement(SCHOOLS),
    previousClass,
    previousMarks: faker.number.int({ min: 45, max: 98 }),

    // Parent Info
    fatherName: faker.person.fullName({ sex: 'male' }),
    motherName: faker.person.fullName({ sex: 'female' }),
    guardianPhone: `+91 ${faker.string.numeric(10)}`,
    guardianEmail: faker.internet.email(),
    guardianOccupation: faker.person.jobTitle(),

    // Application Details
    appliedDate: appliedDate.toISOString(),
    entranceExamDate: hasEntranceExam ? faker.date.recent({ days: 20 }).toISOString() : undefined,
    entranceExamScore: hasEntranceExam ? faker.number.int({ min: 40, max: 100 }) : undefined,
    interviewDate: hasInterview ? faker.date.recent({ days: 10 }).toISOString() : undefined,
    interviewScore: hasInterview ? faker.number.int({ min: 1, max: 10 }) : undefined,
    interviewNotes: hasInterview ? faker.helpers.arrayElement([
      'Good communication skills. Parents supportive.',
      'Student is enthusiastic about learning.',
      'Strong academic background.',
      'Well-mannered and confident.',
    ]) : undefined,

    // Documents
    documents: generateDocuments(status),

    // Timeline
    statusHistory: generateStatusHistory(status, appliedDate),
    notes: generateNotes(status),

    // Metadata
    createdAt: appliedDate.toISOString(),
    updatedAt: faker.date.recent({ days: 5 }).toISOString(),
  }
}

// Generate 55 applications
export const applications: Application[] = Array.from({ length: 55 }, (_, i) => createApplication(i))
  .sort((a, b) => new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime())

// Helper to get stats
export const applicationStats = {
  total: applications.length,
  byStatus: applications.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1
    return acc
  }, {} as Record<ApplicationStatus, number>),
  byClass: CLASSES.reduce((acc, cls) => {
    acc[cls] = applications.filter((a) => a.applyingForClass === cls).length
    return acc
  }, {} as Record<string, number>),
  thisMonth: applications.filter((a) => {
    const appliedDate = new Date(a.appliedDate)
    const now = new Date()
    return appliedDate.getMonth() === now.getMonth() && appliedDate.getFullYear() === now.getFullYear()
  }).length,
  pendingReview: applications.filter((a) => ['applied', 'under_review'].includes(a.status)).length,
}

// Helper function to find application by ID
export function findApplicationById(id: string): Application | undefined {
  return applications.find((a) => a.id === id)
}

// Helper function to filter applications
export function filterApplications(filters: {
  search?: string
  status?: ApplicationStatus | 'all'
  class?: string
  dateFrom?: string
  dateTo?: string
}): Application[] {
  let filtered = [...applications]

  if (filters.search) {
    const searchLower = filters.search.toLowerCase()
    filtered = filtered.filter(
      (a) =>
        a.studentName.toLowerCase().includes(searchLower) ||
        a.email.toLowerCase().includes(searchLower) ||
        a.applicationNumber.toLowerCase().includes(searchLower) ||
        a.fatherName.toLowerCase().includes(searchLower) ||
        a.motherName.toLowerCase().includes(searchLower)
    )
  }

  if (filters.status && filters.status !== 'all') {
    filtered = filtered.filter((a) => a.status === filters.status)
  }

  if (filters.class) {
    filtered = filtered.filter((a) => a.applyingForClass === filters.class)
  }

  if (filters.dateFrom) {
    filtered = filtered.filter((a) => new Date(a.appliedDate) >= new Date(filters.dateFrom!))
  }

  if (filters.dateTo) {
    filtered = filtered.filter((a) => new Date(a.appliedDate) <= new Date(filters.dateTo!))
  }

  return filtered
}
