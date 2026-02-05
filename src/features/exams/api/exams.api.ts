import { apiGet } from '@/lib/api-client'
import type {
  Exam,
  CreateExamRequest,
  UpdateExamRequest,
  ExamFilters,
  StudentMark,
  SubmitMarksRequest,
  ReportCard,
  GenerateReportCardsRequest,
  GradeScale,
  CreateGradeScaleRequest,
  UpdateGradeScaleRequest,
  MarksEntryStudent,
  ExamTimetable,
  ExamSlot,
  CreateExamSlotRequest,
  ClassAnalytics,
  StudentProgress,
  CoScholasticRecord,
  SubmitCoScholasticRequest,
  QuestionPaper,
  CreateQuestionPaperRequest,
} from '../types/exams.types'

const API_BASE = '/api'

// ==================== USER-SCOPED TYPES ====================

export interface ExamMarksGroup {
  examId: string
  examName: string
  marks: StudentMark[]
}

export interface ChildMarksData {
  studentId: string
  studentName: string
  studentClass: string
  studentSection: string
  exams: ExamMarksGroup[]
}

// ==================== USER-SCOPED ENDPOINTS ====================

export async function fetchMyMarks(academicYear?: string): Promise<{ data: ExamMarksGroup[] }> {
  const params = new URLSearchParams()
  if (academicYear) params.set('academicYear', academicYear)
  return apiGet(`${API_BASE}/exams/my-marks?${params.toString()}`)
}

export async function fetchMyChildrenMarks(academicYear?: string): Promise<{ data: ChildMarksData[] }> {
  const params = new URLSearchParams()
  if (academicYear) params.set('academicYear', academicYear)
  return apiGet(`${API_BASE}/exams/my-children-marks?${params.toString()}`)
}

export async function fetchMyReportCard(examId?: string): Promise<{ data: ReportCard }> {
  const params = new URLSearchParams()
  if (examId) params.set('examId', examId)
  return apiGet(`${API_BASE}/exams/my-report-card?${params.toString()}`)
}

// ==================== EXAMS ====================

export async function fetchExams(filters: ExamFilters = {}) {
  const params = new URLSearchParams()
  if (filters.type) params.set('type', filters.type)
  if (filters.status) params.set('status', filters.status)
  if (filters.academicYear) params.set('academicYear', filters.academicYear)
  if (filters.className) params.set('className', filters.className)
  if (filters.search) params.set('search', filters.search)
  if (filters.page) params.set('page', String(filters.page))
  if (filters.limit) params.set('limit', String(filters.limit))

  const response = await fetch(`${API_BASE}/exams?${params.toString()}`)
  if (!response.ok) throw new Error('Failed to fetch exams')
  return response.json() as Promise<{
    data: Exam[]
    meta: { total: number; page: number; limit: number; totalPages: number }
  }>
}

export async function fetchExam(id: string) {
  const response = await fetch(`${API_BASE}/exams/${id}`)
  if (!response.ok) throw new Error('Failed to fetch exam')
  return response.json() as Promise<{ data: Exam }>
}

export async function createExam(data: CreateExamRequest) {
  const response = await fetch(`${API_BASE}/exams`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error('Failed to create exam')
  return response.json() as Promise<{ data: Exam }>
}

export async function updateExam(id: string, data: UpdateExamRequest) {
  const response = await fetch(`${API_BASE}/exams/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error('Failed to update exam')
  return response.json() as Promise<{ data: Exam }>
}

export async function deleteExam(id: string) {
  const response = await fetch(`${API_BASE}/exams/${id}`, {
    method: 'DELETE',
  })
  if (!response.ok) throw new Error('Failed to delete exam')
  return response.json() as Promise<{ success: boolean }>
}

export async function publishExamResults(id: string) {
  const response = await fetch(`${API_BASE}/exams/${id}/publish`, {
    method: 'POST',
  })
  if (!response.ok) throw new Error('Failed to publish results')
  return response.json() as Promise<{ data: Exam }>
}

// ==================== MARKS ====================

export async function fetchExamMarks(examId: string, subjectId?: string, classId?: string) {
  const params = new URLSearchParams()
  if (subjectId) params.set('subjectId', subjectId)
  if (classId) params.set('classId', classId)

  const response = await fetch(`${API_BASE}/exams/${examId}/marks?${params.toString()}`)
  if (!response.ok) throw new Error('Failed to fetch marks')
  return response.json() as Promise<{ data: StudentMark[] }>
}

export async function fetchStudentsForMarksEntry(examId: string, subjectId: string, className: string, section: string) {
  const params = new URLSearchParams({
    subjectId,
    className,
    section,
  })

  const response = await fetch(`${API_BASE}/exams/${examId}/students?${params.toString()}`)
  if (!response.ok) throw new Error('Failed to fetch students')
  return response.json() as Promise<{ data: MarksEntryStudent[] }>
}

export async function submitMarks(data: SubmitMarksRequest) {
  const response = await fetch(`${API_BASE}/exams/${data.examId}/marks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error('Failed to submit marks')
  return response.json() as Promise<{ success: boolean; marksSubmitted: number }>
}

export async function fetchStudentMarks(studentId: string, academicYear?: string) {
  const params = new URLSearchParams()
  if (academicYear) params.set('academicYear', academicYear)

  const response = await fetch(`${API_BASE}/students/${studentId}/marks?${params.toString()}`)
  if (!response.ok) throw new Error('Failed to fetch student marks')
  return response.json() as Promise<{ data: StudentMark[] }>
}

// ==================== REPORT CARDS ====================

export async function fetchReportCards(examId: string, classId?: string) {
  const params = new URLSearchParams()
  if (classId) params.set('classId', classId)

  const response = await fetch(`${API_BASE}/exams/${examId}/report-cards?${params.toString()}`)
  if (!response.ok) throw new Error('Failed to fetch report cards')
  return response.json() as Promise<{ data: ReportCard[] }>
}

export async function fetchStudentReportCard(studentId: string, examId?: string) {
  const params = new URLSearchParams()
  if (examId) params.set('examId', examId)

  const response = await fetch(`${API_BASE}/students/${studentId}/report-card?${params.toString()}`)
  if (!response.ok) throw new Error('Failed to fetch report card')
  return response.json() as Promise<{ data: ReportCard }>
}

export async function generateReportCards(data: GenerateReportCardsRequest) {
  const response = await fetch(`${API_BASE}/report-cards/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error('Failed to generate report cards')
  return response.json() as Promise<{ success: boolean; generatedCount: number }>
}

// ==================== GRADE SCALES ====================

export async function fetchGradeScales() {
  const response = await fetch(`${API_BASE}/grade-scales`)
  if (!response.ok) throw new Error('Failed to fetch grade scales')
  return response.json() as Promise<{ data: GradeScale[] }>
}

export async function fetchGradeScale(id: string) {
  const response = await fetch(`${API_BASE}/grade-scales/${id}`)
  if (!response.ok) throw new Error('Failed to fetch grade scale')
  return response.json() as Promise<{ data: GradeScale }>
}

export async function createGradeScale(data: CreateGradeScaleRequest) {
  const response = await fetch(`${API_BASE}/grade-scales`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error('Failed to create grade scale')
  return response.json() as Promise<{ data: GradeScale }>
}

export async function updateGradeScale(id: string, data: UpdateGradeScaleRequest) {
  const response = await fetch(`${API_BASE}/grade-scales/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error('Failed to update grade scale')
  return response.json() as Promise<{ data: GradeScale }>
}

export async function deleteGradeScale(id: string) {
  const response = await fetch(`${API_BASE}/grade-scales/${id}`, {
    method: 'DELETE',
  })
  if (!response.ok) throw new Error('Failed to delete grade scale')
  return response.json() as Promise<{ success: boolean }>
}

// ==================== EXAM TIMETABLE ====================

export async function fetchExamTimetable(examId: string): Promise<{ data: ExamTimetable }> {
  const response = await fetch(`${API_BASE}/exams/${examId}/timetable`)
  if (!response.ok) throw new Error('Failed to fetch timetable')
  return response.json()
}

export async function createExamSlot(examId: string, data: CreateExamSlotRequest): Promise<{ data: ExamSlot }> {
  const response = await fetch(`${API_BASE}/exams/${examId}/timetable`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error('Failed to create exam slot')
  return response.json()
}

// ==================== CLASS ANALYTICS ====================

export async function fetchClassAnalytics(examId: string, className?: string, section?: string): Promise<{ data: ClassAnalytics }> {
  const params = new URLSearchParams()
  if (className) params.set('class', className)
  if (section) params.set('section', section)
  const response = await fetch(`${API_BASE}/exams/${examId}/analytics?${params.toString()}`)
  if (!response.ok) throw new Error('Failed to fetch analytics')
  return response.json()
}

// ==================== STUDENT PROGRESS ====================

export async function fetchStudentProgress(studentId: string): Promise<{ data: StudentProgress }> {
  const response = await fetch(`${API_BASE}/students/${studentId}/progress`)
  if (!response.ok) throw new Error('Failed to fetch student progress')
  return response.json()
}

// ==================== CO-SCHOLASTIC ====================

export async function fetchCoScholasticRecords(filters: { studentId?: string; term?: string; area?: string; page?: number; limit?: number } = {}): Promise<{ data: CoScholasticRecord[]; pagination: { page: number; limit: number; total: number; totalPages: number } }> {
  const params = new URLSearchParams()
  if (filters.studentId) params.set('studentId', filters.studentId)
  if (filters.term) params.set('term', filters.term)
  if (filters.area && filters.area !== 'all') params.set('area', filters.area)
  if (filters.page) params.set('page', String(filters.page))
  if (filters.limit) params.set('limit', String(filters.limit))
  const response = await fetch(`${API_BASE}/exams/co-scholastic?${params.toString()}`)
  if (!response.ok) throw new Error('Failed to fetch co-scholastic records')
  return response.json()
}

export async function submitCoScholastic(data: SubmitCoScholasticRequest): Promise<{ data: CoScholasticRecord[] }> {
  const response = await fetch(`${API_BASE}/exams/co-scholastic`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error('Failed to submit co-scholastic records')
  return response.json()
}

// ==================== QUESTION PAPERS ====================

export async function fetchQuestionPapers(filters: { examId?: string; subjectId?: string; className?: string } = {}): Promise<{ data: QuestionPaper[] }> {
  const params = new URLSearchParams()
  if (filters.examId) params.set('examId', filters.examId)
  if (filters.subjectId) params.set('subjectId', filters.subjectId)
  if (filters.className) params.set('className', filters.className)
  const response = await fetch(`${API_BASE}/exams/question-papers?${params.toString()}`)
  if (!response.ok) throw new Error('Failed to fetch question papers')
  return response.json()
}

export async function fetchQuestionPaper(id: string): Promise<{ data: QuestionPaper }> {
  const response = await fetch(`${API_BASE}/exams/question-papers/${id}`)
  if (!response.ok) throw new Error('Failed to fetch question paper')
  return response.json()
}

export async function createQuestionPaper(data: CreateQuestionPaperRequest): Promise<{ data: QuestionPaper }> {
  const response = await fetch(`${API_BASE}/exams/question-papers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error('Failed to create question paper')
  return response.json()
}

export async function deleteQuestionPaper(id: string): Promise<{ success: boolean }> {
  const response = await fetch(`${API_BASE}/exams/question-papers/${id}`, { method: 'DELETE' })
  if (!response.ok) throw new Error('Failed to delete question paper')
  return response.json()
}
