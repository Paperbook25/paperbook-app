export interface Student {
  id: string
  admissionNumber: string
  name: string
  email: string
  phone: string
  dateOfBirth: string
  gender: 'male' | 'female' | 'other'
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
  // New fields
  siblingIds?: string[]
  healthRecord?: StudentHealthRecord
}

export interface StudentFilters {
  search?: string
  class?: string
  section?: string
  status?: string
  page?: number
  limit?: number
}

export interface CreateStudentRequest {
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  gender: 'male' | 'female' | 'other'
  bloodGroup?: string
  class: string
  section: string
  rollNumber?: number
  photoUrl?: string
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
    occupation?: string
  }
}

export interface UpdateStudentRequest {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  dateOfBirth?: string
  gender?: 'male' | 'female' | 'other'
  bloodGroup?: string
  class?: string
  section?: string
  rollNumber?: number
  photoUrl?: string
  address?: {
    street: string
    city: string
    state: string
    pincode: string
  }
  parent?: {
    fatherName: string
    motherName: string
    guardianPhone: string
    guardianEmail: string
    occupation?: string
  }
  status?: 'active' | 'inactive' | 'graduated' | 'transferred'
}

// ==================== TIMELINE ====================

export type TimelineEventType =
  | 'fee_paid'
  | 'attendance_marked'
  | 'book_issued'
  | 'book_returned'
  | 'marks_entered'
  | 'leave_applied'
  | 'document_uploaded'
  | 'profile_updated'
  | 'admission'
  | 'promotion'
  | 'transfer'

export interface TimelineEvent {
  id: string
  type: TimelineEventType
  title: string
  description: string
  timestamp: string
  metadata?: Record<string, string | number>
}

// ==================== DOCUMENTS ====================

export type DocumentType =
  | 'birth_certificate'
  | 'aadhar_card'
  | 'transfer_certificate'
  | 'photo'
  | 'address_proof'
  | 'marksheet'
  | 'medical_certificate'
  | 'caste_certificate'
  | 'income_certificate'
  | 'other'

export interface StudentDocument {
  id: string
  studentId: string
  type: DocumentType
  name: string
  fileName: string
  fileSize: number
  mimeType: string
  url: string
  uploadedAt: string
  uploadedBy: string
  verified: boolean
  verifiedAt?: string
  verifiedBy?: string
}

export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  birth_certificate: 'Birth Certificate',
  aadhar_card: 'Aadhar Card',
  transfer_certificate: 'Transfer Certificate',
  photo: 'Passport Photo',
  address_proof: 'Address Proof',
  marksheet: 'Previous Marksheet',
  medical_certificate: 'Medical Certificate',
  caste_certificate: 'Caste Certificate',
  income_certificate: 'Income Certificate',
  other: 'Other',
}

// ==================== PROMOTION ====================

export interface PromotionRequest {
  studentIds: string[]
  fromClass: string
  toClass: string
  academicYear: string
  newSection?: string
  autoAssignRollNumbers: boolean
}

export interface PromotionResult {
  promoted: number
  failed: number
  details: {
    studentId: string
    studentName: string
    fromClass: string
    toClass: string
    newSection: string
    newRollNumber: number
    success: boolean
    error?: string
  }[]
}

// ==================== SIBLING ====================

export interface SiblingGroup {
  groupId: string
  students: {
    id: string
    name: string
    class: string
    section: string
    rollNumber: number
    photoUrl: string
  }[]
}

// ==================== HEALTH RECORDS ====================

export interface StudentHealthRecord {
  allergies: string[]
  medicalConditions: string[]
  medications: string[]
  emergencyContact: {
    name: string
    phone: string
    relationship: string
  }
  bloodGroup: string
  height?: string
  weight?: string
  visionLeft?: string
  visionRight?: string
  lastCheckupDate?: string
  insuranceProvider?: string
  insurancePolicyNumber?: string
  notes?: string
}

// ==================== ID CARD ====================

export interface IDCardData {
  studentId: string
  name: string
  class: string
  section: string
  rollNumber: number
  admissionNumber: string
  dateOfBirth: string
  bloodGroup: string
  photoUrl: string
  parentName: string
  parentPhone: string
  address: string
  schoolName: string
  schoolLogo: string
  academicYear: string
  validUntil: string
}

// ==================== BULK IMPORT ====================

export interface BulkImportResult {
  total: number
  successful: number
  failed: number
  errors: {
    row: number
    field: string
    message: string
  }[]
}

export interface BulkImportRow {
  name: string
  email: string
  phone: string
  dateOfBirth: string
  gender: string
  class: string
  section: string
  fatherName: string
  motherName: string
  guardianPhone: string
}
