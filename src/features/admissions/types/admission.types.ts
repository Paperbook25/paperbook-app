import type { Address } from '@/types/common.types'

export type ApplicationStatus =
  | 'applied'
  | 'under_review'
  | 'document_verification'
  | 'entrance_exam'
  | 'interview'
  | 'approved'
  | 'waitlisted'
  | 'rejected'
  | 'enrolled'
  | 'withdrawn'

export type DocumentType =
  | 'birth_certificate'
  | 'previous_marksheet'
  | 'transfer_certificate'
  | 'address_proof'
  | 'photo'
  | 'parent_id'
  | 'medical_certificate'
  | 'other'

export type DocumentStatus = 'pending' | 'verified' | 'rejected'

export interface ApplicationDocument {
  id: string
  type: DocumentType
  name: string
  url: string
  uploadedAt: string
  status: DocumentStatus
  verifiedBy?: string
  verifiedAt?: string
  rejectionReason?: string
}

export interface StatusChange {
  id: string
  fromStatus: ApplicationStatus | null
  toStatus: ApplicationStatus
  changedAt: string
  changedBy: string
  note?: string
}

export interface ApplicationNote {
  id: string
  content: string
  createdAt: string
  createdBy: string
  createdByName: string
}

export interface Application {
  id: string
  applicationNumber: string
  status: ApplicationStatus

  // Student Info
  studentName: string
  dateOfBirth: string
  gender: 'male' | 'female'
  photoUrl: string

  // Contact Info
  email: string
  phone: string
  address: Address

  // Academic Info
  applyingForClass: string
  applyingForSection?: string
  previousSchool: string
  previousClass: string
  previousMarks: number

  // Parent Info
  fatherName: string
  motherName: string
  guardianPhone: string
  guardianEmail: string
  guardianOccupation: string

  // Application Details
  appliedDate: string
  entranceExamDate?: string
  entranceExamScore?: number
  interviewDate?: string
  interviewScore?: number
  interviewNotes?: string

  // Documents
  documents: ApplicationDocument[]

  // Timeline
  statusHistory: StatusChange[]
  notes: ApplicationNote[]

  // Enrollment reference (only set when status is 'enrolled')
  enrolledStudentId?: string

  // Source tracking
  source?: 'website' | 'referral' | 'advertisement' | 'walk_in' | 'social_media' | 'other'
  referredBy?: string

  // Payment tracking
  admissionFeeStatus?: 'pending' | 'partial' | 'paid' | 'waived'
  admissionFeeAmount?: number
  admissionFeePaid?: number

  // Waitlist
  waitlistPosition?: number

  // Metadata
  createdAt: string
  updatedAt: string
}

// API Request/Response types
export interface CreateApplicationRequest {
  studentName: string
  dateOfBirth: string
  gender: 'male' | 'female'
  email: string
  phone: string
  address: Address
  applyingForClass: string
  previousSchool: string
  previousClass: string
  previousMarks: number
  fatherName: string
  motherName: string
  guardianPhone: string
  guardianEmail: string
  guardianOccupation: string
}

export interface UpdateApplicationRequest extends Partial<CreateApplicationRequest> {
  applyingForSection?: string
  entranceExamDate?: string
  entranceExamScore?: number
  interviewDate?: string
  interviewScore?: number
  interviewNotes?: string
}

export interface UpdateStatusRequest {
  status: ApplicationStatus
  note?: string
}

export interface AddDocumentRequest {
  type: DocumentType
  name: string
  url: string
}

export interface AddNoteRequest {
  content: string
}

export interface ApplicationFilters {
  search?: string
  status?: ApplicationStatus | 'all'
  class?: string
  dateFrom?: string
  dateTo?: string
}

// Status configuration for pipeline view
export interface StatusConfig {
  value: ApplicationStatus
  label: string
  color: string
  bgColor: string
  description: string
  allowedTransitions: ApplicationStatus[]
}

export const APPLICATION_STATUSES: StatusConfig[] = [
  {
    value: 'applied',
    label: 'Applied',
    color: 'text-blue-700',
    bgColor: 'bg-blue-100',
    description: 'New application received',
    allowedTransitions: ['under_review', 'rejected', 'withdrawn'],
  },
  {
    value: 'under_review',
    label: 'Under Review',
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-100',
    description: 'Application being reviewed',
    allowedTransitions: ['document_verification', 'rejected', 'withdrawn'],
  },
  {
    value: 'document_verification',
    label: 'Document Verification',
    color: 'text-orange-700',
    bgColor: 'bg-orange-100',
    description: 'Verifying submitted documents',
    allowedTransitions: ['entrance_exam', 'interview', 'rejected', 'withdrawn'],
  },
  {
    value: 'entrance_exam',
    label: 'Entrance Exam',
    color: 'text-purple-700',
    bgColor: 'bg-purple-100',
    description: 'Scheduled for entrance exam',
    allowedTransitions: ['interview', 'approved', 'rejected', 'withdrawn'],
  },
  {
    value: 'interview',
    label: 'Interview',
    color: 'text-indigo-700',
    bgColor: 'bg-indigo-100',
    description: 'Scheduled for interview',
    allowedTransitions: ['approved', 'waitlisted', 'rejected', 'withdrawn'],
  },
  {
    value: 'approved',
    label: 'Approved',
    color: 'text-green-700',
    bgColor: 'bg-green-100',
    description: 'Application approved',
    allowedTransitions: ['enrolled', 'withdrawn'],
  },
  {
    value: 'waitlisted',
    label: 'Waitlisted',
    color: 'text-amber-700',
    bgColor: 'bg-amber-100',
    description: 'Added to waitlist',
    allowedTransitions: ['approved', 'rejected', 'withdrawn'],
  },
  {
    value: 'rejected',
    label: 'Rejected',
    color: 'text-red-700',
    bgColor: 'bg-red-100',
    description: 'Application rejected',
    allowedTransitions: [],
  },
  {
    value: 'enrolled',
    label: 'Enrolled',
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-100',
    description: 'Student enrolled',
    allowedTransitions: [],
  },
  {
    value: 'withdrawn',
    label: 'Withdrawn',
    color: 'text-gray-700',
    bgColor: 'bg-gray-100',
    description: 'Application withdrawn',
    allowedTransitions: [],
  },
]

export const DOCUMENT_TYPES: { value: DocumentType; label: string; required: boolean }[] = [
  { value: 'birth_certificate', label: 'Birth Certificate', required: true },
  { value: 'previous_marksheet', label: 'Previous Marksheet', required: true },
  { value: 'transfer_certificate', label: 'Transfer Certificate', required: false },
  { value: 'address_proof', label: 'Address Proof', required: true },
  { value: 'photo', label: 'Passport Photo', required: true },
  { value: 'parent_id', label: 'Parent ID Proof', required: true },
  { value: 'medical_certificate', label: 'Medical Certificate', required: false },
  { value: 'other', label: 'Other Documents', required: false },
]

export const CLASSES = [
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

export function getStatusConfig(status: ApplicationStatus): StatusConfig {
  return APPLICATION_STATUSES.find((s) => s.value === status) || APPLICATION_STATUSES[0]
}

export function canTransitionTo(currentStatus: ApplicationStatus, targetStatus: ApplicationStatus): boolean {
  const config = getStatusConfig(currentStatus)
  return config.allowedTransitions.includes(targetStatus)
}

// ==================== WAITLIST TYPES ====================

export interface WaitlistEntry {
  id: string
  applicationId: string
  studentName: string
  applyingForClass: string
  position: number
  addedAt: string
  previousMarks: number
  entranceExamScore?: number
  status: 'waiting' | 'offered' | 'expired'
  offeredAt?: string
  expiresAt?: string
}

export interface ClassCapacity {
  class: string
  section: string
  totalSeats: number
  filledSeats: number
  availableSeats: number
  waitlistCount: number
}

// ==================== ENTRANCE TEST TYPES ====================

export interface EntranceExamSchedule {
  id: string
  class: string
  examDate: string
  examTime: string
  venue: string
  duration: number // in minutes
  totalMarks: number
  passingMarks: number
  subjects: string[]
  registeredCount: number
  completedCount: number
  status: 'upcoming' | 'in_progress' | 'completed' | 'cancelled'
}

export interface ExamResult {
  applicationId: string
  studentName: string
  examScheduleId: string
  marksObtained: number
  totalMarks: number
  percentage: number
  grade: string
  subjectWiseMarks: { subject: string; marks: number; total: number }[]
  result: 'pass' | 'fail'
  rank?: number
}

export interface ScheduleExamRequest {
  class: string
  examDate: string
  examTime: string
  venue: string
  duration: number
  totalMarks: number
  passingMarks: number
  subjects: string[]
}

export interface RecordExamScoreRequest {
  applicationId: string
  marksObtained: number
  subjectWiseMarks: { subject: string; marks: number; total: number }[]
}

// ==================== COMMUNICATION TYPES ====================

export type CommunicationType = 'email' | 'sms' | 'whatsapp'
export type CommunicationTrigger =
  | 'application_received'
  | 'status_change'
  | 'exam_scheduled'
  | 'interview_scheduled'
  | 'approved'
  | 'rejected'
  | 'waitlisted'
  | 'payment_due'
  | 'custom'

export interface CommunicationLog {
  id: string
  applicationId: string
  studentName: string
  type: CommunicationType
  trigger: CommunicationTrigger
  recipient: string
  subject: string
  message: string
  sentAt: string
  status: 'sent' | 'delivered' | 'failed' | 'pending'
  sentBy: string
}

export interface CommunicationTemplate {
  id: string
  name: string
  trigger: CommunicationTrigger
  type: CommunicationType
  subject: string
  body: string
  isActive: boolean
  variables: string[] // e.g., {{studentName}}, {{status}}
}

export interface SendCommunicationRequest {
  applicationIds: string[]
  templateId?: string
  type: CommunicationType
  subject: string
  message: string
}

// ==================== ADMISSION FEE TYPES ====================

export interface AdmissionFee {
  id: string
  class: string
  feeType: string
  amount: number
  isRequired: boolean
}

export interface AdmissionPayment {
  id: string
  applicationId: string
  studentName: string
  class: string
  totalAmount: number
  paidAmount: number
  status: 'pending' | 'partial' | 'paid' | 'waived'
  paymentDate?: string
  paymentMethod?: string
  transactionId?: string
  receiptNumber?: string
  feeBreakdown: { feeType: string; amount: number; paid: boolean }[]
  generatedAt: string
  dueDate: string
}

export interface RecordPaymentRequest {
  applicationId: string
  amount: number
  paymentMethod: string
  transactionId?: string
}

// ==================== ANALYTICS TYPES ====================

export interface AdmissionAnalytics {
  conversionFunnel: { stage: string; count: number; percentage: number }[]
  monthlyTrend: { month: string; applications: number; approvals: number; rejections: number }[]
  classDistribution: { class: string; applications: number; approved: number; enrolled: number }[]
  sourceDistribution: { source: string; count: number; percentage: number }[]
  avgProcessingDays: number
  approvalRate: number
  rejectionRate: number
  withdrawalRate: number
  avgExamScore: number
  topPerformers: { name: string; class: string; score: number }[]
}

// ==================== COMMUNICATION TRIGGER LABELS ====================

export const COMMUNICATION_TRIGGER_LABELS: Record<CommunicationTrigger, string> = {
  application_received: 'Application Received',
  status_change: 'Status Change',
  exam_scheduled: 'Exam Scheduled',
  interview_scheduled: 'Interview Scheduled',
  approved: 'Approved',
  rejected: 'Rejected',
  waitlisted: 'Waitlisted',
  payment_due: 'Payment Due',
  custom: 'Custom Message',
}
