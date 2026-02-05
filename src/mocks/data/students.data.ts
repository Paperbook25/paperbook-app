import { faker } from '@faker-js/faker'
import type {
  TimelineEvent,
  TimelineEventType,
  StudentDocument,
  DocumentType,
  StudentHealthRecord,
} from '@/features/students/types/student.types'

export interface Student {
  id: string
  admissionNumber: string
  name: string
  email: string
  phone: string
  dateOfBirth: string
  gender: 'male' | 'female'
  bloodGroup: string
  class: string
  section: string
  rollNumber: number
  admissionDate: string
  photoUrl: string
  address: {
    street: string
    city: string
    state: string
    pincode: string
  }
  parent: {
    fatherName: string
    motherName: string
    guardianPhone: string
    guardianEmail: string
    occupation: string
  }
  status: 'active' | 'inactive' | 'graduated' | 'transferred'
  siblingIds?: string[]
  healthRecord?: StudentHealthRecord
}

const CLASSES = ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12']
const SECTIONS = ['A', 'B', 'C', 'D']
const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
const INDIAN_STATES = ['Maharashtra', 'Karnataka', 'Tamil Nadu', 'Delhi', 'Gujarat', 'Rajasthan', 'Uttar Pradesh', 'West Bengal', 'Kerala', 'Telangana']

function createStudent(): Student {
  const firstName = faker.person.firstName()
  const lastName = faker.person.lastName()
  const admissionYear = faker.date.past({ years: 5 }).getFullYear()
  const gender = faker.helpers.arrayElement(['male', 'female']) as 'male' | 'female'

  return {
    id: faker.string.uuid(),
    admissionNumber: `ADM${admissionYear}${faker.string.numeric(4)}`,
    name: `${firstName} ${lastName}`,
    email: faker.internet.email({ firstName, lastName }).toLowerCase(),
    phone: `+91 ${faker.string.numeric(10)}`,
    dateOfBirth: faker.date.birthdate({ min: 5, max: 18, mode: 'age' }).toISOString(),
    gender,
    bloodGroup: faker.helpers.arrayElement(BLOOD_GROUPS),
    class: faker.helpers.arrayElement(CLASSES),
    section: faker.helpers.arrayElement(SECTIONS),
    rollNumber: faker.number.int({ min: 1, max: 50 }),
    admissionDate: faker.date.past({ years: 3 }).toISOString(),
    photoUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${firstName}${lastName}`,
    address: {
      street: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.helpers.arrayElement(INDIAN_STATES),
      pincode: faker.string.numeric(6),
    },
    parent: {
      fatherName: faker.person.fullName({ sex: 'male' }),
      motherName: faker.person.fullName({ sex: 'female' }),
      guardianPhone: `+91 ${faker.string.numeric(10)}`,
      guardianEmail: faker.internet.email(),
      occupation: faker.person.jobTitle(),
    },
    status: faker.helpers.weightedArrayElement([
      { value: 'active', weight: 85 },
      { value: 'inactive', weight: 5 },
      { value: 'graduated', weight: 8 },
      { value: 'transferred', weight: 2 },
    ]) as Student['status'],
  }
}

// Generate 150 students
export const students: Student[] = Array.from({ length: 150 }, createStudent)

// ==================== SIBLING LINKING ====================

// Link some students as siblings (share same last name and parent)
const siblingPairs: [number, number][] = []
for (let i = 0; i < 15; i++) {
  const a = i * 2
  const b = i * 2 + 1
  if (a < students.length && b < students.length) {
    const lastName = students[a].name.split(' ')[1]
    students[b] = {
      ...students[b],
      name: `${students[b].name.split(' ')[0]} ${lastName}`,
      parent: { ...students[a].parent },
    }
    students[a].siblingIds = [students[b].id]
    students[b].siblingIds = [students[a].id]
    siblingPairs.push([a, b])
  }
}

// ==================== HEALTH RECORDS ====================

const ALLERGIES = ['Peanuts', 'Dust', 'Pollen', 'Milk', 'Eggs', 'Shellfish', 'Penicillin', 'Latex']
const CONDITIONS = ['Asthma', 'Diabetes Type 1', 'Epilepsy', 'ADHD', 'Scoliosis', 'Eczema']
const MEDICATIONS = ['Inhaler (Salbutamol)', 'EpiPen', 'Insulin', 'Ritalin', 'Cetirizine']
const RELATIONSHIPS = ['Father', 'Mother', 'Uncle', 'Aunt', 'Grandparent', 'Guardian']

// Assign health records to ~40% of students
students.forEach((student) => {
  if (faker.datatype.boolean(0.4)) {
    student.healthRecord = {
      allergies: faker.helpers.arrayElements(ALLERGIES, { min: 0, max: 3 }),
      medicalConditions: faker.helpers.arrayElements(CONDITIONS, { min: 0, max: 2 }),
      medications: faker.helpers.arrayElements(MEDICATIONS, { min: 0, max: 2 }),
      emergencyContact: {
        name: student.parent.fatherName,
        phone: student.parent.guardianPhone,
        relationship: faker.helpers.arrayElement(RELATIONSHIPS),
      },
      bloodGroup: student.bloodGroup,
      height: `${faker.number.int({ min: 100, max: 180 })} cm`,
      weight: `${faker.number.int({ min: 20, max: 80 })} kg`,
      visionLeft: faker.helpers.arrayElement(['6/6', '6/9', '6/12', '6/18']),
      visionRight: faker.helpers.arrayElement(['6/6', '6/9', '6/12', '6/18']),
      lastCheckupDate: faker.date.recent({ days: 180 }).toISOString(),
      notes: faker.datatype.boolean(0.3) ? 'Regular checkup required every 6 months' : undefined,
    }
  }
})

// ==================== STUDENT DOCUMENTS ====================

const DOC_TYPES: DocumentType[] = ['birth_certificate', 'aadhar_card', 'transfer_certificate', 'photo', 'address_proof', 'marksheet']
const MIME_TYPES = ['application/pdf', 'image/jpeg', 'image/png']

function generateStudentDocuments(studentId: string): StudentDocument[] {
  const numDocs = faker.number.int({ min: 2, max: 6 })
  const selectedTypes = faker.helpers.arrayElements(DOC_TYPES, numDocs)
  return selectedTypes.map((type) => ({
    id: faker.string.uuid(),
    studentId,
    type,
    name: type.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    fileName: `${type}_${studentId.slice(0, 8)}.${faker.helpers.arrayElement(['pdf', 'jpg', 'png'])}`,
    fileSize: faker.number.int({ min: 50000, max: 5000000 }),
    mimeType: faker.helpers.arrayElement(MIME_TYPES),
    url: `/uploads/documents/${studentId}/${type}.pdf`,
    uploadedAt: faker.date.recent({ days: 90 }).toISOString(),
    uploadedBy: 'Admin User',
    verified: faker.datatype.boolean(0.7),
    verifiedAt: faker.datatype.boolean(0.7) ? faker.date.recent({ days: 60 }).toISOString() : undefined,
    verifiedBy: faker.datatype.boolean(0.7) ? 'Principal' : undefined,
  }))
}

// Store documents for all students
export const studentDocuments: StudentDocument[] = students.flatMap((s) =>
  generateStudentDocuments(s.id)
)

// ==================== TIMELINE EVENTS ====================

const TIMELINE_EVENT_TEMPLATES: { type: TimelineEventType; titles: string[]; descriptions: string[] }[] = [
  { type: 'fee_paid', titles: ['Fee Payment Received'], descriptions: ['Tuition fee paid via UPI', 'Annual fee paid via bank transfer', 'Exam fee collected in cash'] },
  { type: 'attendance_marked', titles: ['Attendance Marked'], descriptions: ['Present for the day', 'Marked absent', 'Late arrival - reached at 9:15 AM'] },
  { type: 'book_issued', titles: ['Library Book Issued'], descriptions: ['Issued "Introduction to Physics"', 'Issued "Mathematics - Class 10"', 'Issued "English Literature"'] },
  { type: 'book_returned', titles: ['Library Book Returned'], descriptions: ['Returned "Introduction to Physics"', 'Returned "History of India"'] },
  { type: 'marks_entered', titles: ['Exam Marks Entered'], descriptions: ['Unit Test 1 marks: 85/100 in Math', 'Half Yearly marks entered', 'Class Test marks: 42/50 in Science'] },
  { type: 'leave_applied', titles: ['Leave Application'], descriptions: ['Sick leave applied for 2 days', 'Family emergency leave for 3 days', 'Medical leave for 1 day'] },
  { type: 'document_uploaded', titles: ['Document Uploaded'], descriptions: ['Birth certificate uploaded', 'Aadhar card uploaded', 'Transfer certificate uploaded'] },
  { type: 'profile_updated', titles: ['Profile Updated'], descriptions: ['Contact number updated', 'Address updated', 'Emergency contact updated'] },
  { type: 'admission', titles: ['Admission Completed'], descriptions: ['Student admitted to the school'] },
]

function generateTimeline(studentId: string): TimelineEvent[] {
  const events: TimelineEvent[] = []
  const numEvents = faker.number.int({ min: 8, max: 20 })

  for (let i = 0; i < numEvents; i++) {
    const template = faker.helpers.arrayElement(TIMELINE_EVENT_TEMPLATES)
    events.push({
      id: faker.string.uuid(),
      type: template.type,
      title: faker.helpers.arrayElement(template.titles),
      description: faker.helpers.arrayElement(template.descriptions),
      timestamp: faker.date.recent({ days: 90 }).toISOString(),
    })
  }

  return events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}

// Cache timelines
const timelineCache = new Map<string, TimelineEvent[]>()

export function getStudentTimeline(studentId: string): TimelineEvent[] {
  if (!timelineCache.has(studentId)) {
    timelineCache.set(studentId, generateTimeline(studentId))
  }
  return timelineCache.get(studentId)!
}

// ==================== PROMOTION HELPERS ====================

export function getNextClass(currentClass: string): string | null {
  const index = CLASSES.indexOf(currentClass)
  if (index === -1 || index >= CLASSES.length - 1) return null
  return CLASSES[index + 1]
}

export { CLASSES, SECTIONS }

// ==================== STATS ====================

export const studentStats = {
  total: students.length,
  active: students.filter((s) => s.status === 'active').length,
  byClass: CLASSES.reduce((acc, cls) => {
    acc[cls] = students.filter((s) => s.class === cls).length
    return acc
  }, {} as Record<string, number>),
  byGender: {
    male: students.filter((s) => s.gender === 'male').length,
    female: students.filter((s) => s.gender === 'female').length,
  },
}
