import type { Address } from '@/types/common.types'

export type ApplicationStatus =
  | 'applied'
  | 'under_review'
  | 'document_verification'
  | 'entrance_exam'
  | 'interview'
  | 'approved'
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
    allowedTransitions: ['approved', 'rejected', 'withdrawn'],
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
