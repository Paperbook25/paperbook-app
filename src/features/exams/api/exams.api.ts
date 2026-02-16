import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api-client'
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

export async function fetchExams(filters: ExamFilters = {}): Promise<{
  data: Exam[]
  meta: { total: number; page: number; limit: number; totalPages: number }
}> {
  const params = new URLSearchParams()
  if (filters.type) params.set('type', filters.type)
  if (filters.status) params.set('status', filters.status)
  if (filters.academicYear) params.set('academicYear', filters.academicYear)
  if (filters.className) params.set('className', filters.className)
  if (filters.search) params.set('search', filters.search)
  if (filters.page) params.set('page', String(filters.page))
  if (filters.limit) params.set('limit', String(filters.limit))

  return apiGet(`${API_BASE}/exams?${params.toString()}`)
}

export async function fetchExam(id: string): Promise<{ data: Exam }> {
  return apiGet(`${API_BASE}/exams/${id}`)
}

export async function createExam(data: CreateExamRequest): Promise<{ data: Exam }> {
  return apiPost(`${API_BASE}/exams`, data)
}

export async function updateExam(id: string, data: UpdateExamRequest): Promise<{ data: Exam }> {
  return apiPut(`${API_BASE}/exams/${id}`, data)
}

export async function deleteExam(id: string): Promise<{ success: boolean }> {
  return apiDelete(`${API_BASE}/exams/${id}`)
}

export async function publishExamResults(id: string): Promise<{ data: Exam }> {
  return apiPost(`${API_BASE}/exams/${id}/publish`)
}

// ==================== MARKS ====================

export async function fetchExamMarks(
  examId: string,
  subjectId?: string,
  classId?: string
): Promise<{ data: StudentMark[] }> {
  const params = new URLSearchParams()
  if (subjectId) params.set('subjectId', subjectId)
  if (classId) params.set('classId', classId)

  return apiGet(`${API_BASE}/exams/${examId}/marks?${params.toString()}`)
}

export async function fetchStudentsForMarksEntry(
  examId: string,
  subjectId: string,
  className: string,
  section: string
): Promise<{ data: MarksEntryStudent[] }> {
  const params = new URLSearchParams({
    subjectId,
    className,
    section,
  })

  return apiGet(`${API_BASE}/exams/${examId}/students?${params.toString()}`)
}

export async function submitMarks(data: SubmitMarksRequest): Promise<{ success: boolean; marksSubmitted: number }> {
  return apiPost(`${API_BASE}/exams/${data.examId}/marks`, data)
}

export async function fetchStudentMarks(studentId: string, academicYear?: string): Promise<{ data: StudentMark[] }> {
  const params = new URLSearchParams()
  if (academicYear) params.set('academicYear', academicYear)

  return apiGet(`${API_BASE}/students/${studentId}/marks?${params.toString()}`)
}

// ==================== REPORT CARDS ====================

export async function fetchReportCards(examId: string, classId?: string): Promise<{ data: ReportCard[] }> {
  const params = new URLSearchParams()
  if (classId) params.set('classId', classId)

  return apiGet(`${API_BASE}/exams/${examId}/report-cards?${params.toString()}`)
}

export async function fetchStudentReportCard(studentId: string, examId?: string): Promise<{ data: ReportCard }> {
  const params = new URLSearchParams()
  if (examId) params.set('examId', examId)

  return apiGet(`${API_BASE}/students/${studentId}/report-card?${params.toString()}`)
}

export async function generateReportCards(
  data: GenerateReportCardsRequest
): Promise<{ success: boolean; generatedCount: number }> {
  return apiPost(`${API_BASE}/report-cards/generate`, data)
}

export async function deleteReportCard(id: string): Promise<{ success: boolean }> {
  return apiDelete(`${API_BASE}/report-cards/${id}`)
}

// ==================== GRADE SCALES ====================

export async function fetchGradeScales(): Promise<{ data: GradeScale[] }> {
  return apiGet(`${API_BASE}/grade-scales`)
}

export async function fetchGradeScale(id: string): Promise<{ data: GradeScale }> {
  return apiGet(`${API_BASE}/grade-scales/${id}`)
}

export async function createGradeScale(data: CreateGradeScaleRequest): Promise<{ data: GradeScale }> {
  return apiPost(`${API_BASE}/grade-scales`, data)
}

export async function updateGradeScale(id: string, data: UpdateGradeScaleRequest): Promise<{ data: GradeScale }> {
  return apiPut(`${API_BASE}/grade-scales/${id}`, data)
}

export async function deleteGradeScale(id: string): Promise<{ success: boolean }> {
  return apiDelete(`${API_BASE}/grade-scales/${id}`)
}

// ==================== EXAM TIMETABLE ====================

export async function fetchExamTimetable(examId: string): Promise<{ data: ExamTimetable }> {
  return apiGet(`${API_BASE}/exams/${examId}/timetable`)
}

export async function createExamSlot(examId: string, data: CreateExamSlotRequest): Promise<{ data: ExamSlot }> {
  return apiPost(`${API_BASE}/exams/${examId}/timetable`, data)
}

// ==================== CLASS ANALYTICS ====================

export async function fetchClassAnalytics(
  examId: string,
  className?: string,
  section?: string
): Promise<{ data: ClassAnalytics }> {
  const params = new URLSearchParams()
  if (className) params.set('class', className)
  if (section) params.set('section', section)
  return apiGet(`${API_BASE}/exams/${examId}/analytics?${params.toString()}`)
}

// ==================== STUDENT PROGRESS ====================

export async function fetchStudentProgress(studentId: string): Promise<{ data: StudentProgress }> {
  return apiGet(`${API_BASE}/students/${studentId}/progress`)
}

// ==================== CO-SCHOLASTIC ====================

export async function fetchCoScholasticRecords(
  filters: { studentId?: string; term?: string; area?: string; page?: number; limit?: number } = {}
): Promise<{ data: CoScholasticRecord[]; pagination: { page: number; limit: number; total: number; totalPages: number } }> {
  const params = new URLSearchParams()
  if (filters.studentId) params.set('studentId', filters.studentId)
  if (filters.term) params.set('term', filters.term)
  if (filters.area && filters.area !== 'all') params.set('area', filters.area)
  if (filters.page) params.set('page', String(filters.page))
  if (filters.limit) params.set('limit', String(filters.limit))
  return apiGet(`${API_BASE}/exams/co-scholastic?${params.toString()}`)
}

export async function submitCoScholastic(data: SubmitCoScholasticRequest): Promise<{ data: CoScholasticRecord[] }> {
  return apiPost(`${API_BASE}/exams/co-scholastic`, data)
}

// ==================== QUESTION PAPERS ====================

export async function fetchQuestionPapers(
  filters: { examId?: string; subjectId?: string; className?: string } = {}
): Promise<{ data: QuestionPaper[] }> {
  const params = new URLSearchParams()
  if (filters.examId) params.set('examId', filters.examId)
  if (filters.subjectId) params.set('subjectId', filters.subjectId)
  if (filters.className) params.set('className', filters.className)
  return apiGet(`${API_BASE}/exams/question-papers?${params.toString()}`)
}

export async function fetchQuestionPaper(id: string): Promise<{ data: QuestionPaper }> {
  return apiGet(`${API_BASE}/exams/question-papers/${id}`)
}

export async function createQuestionPaper(data: CreateQuestionPaperRequest): Promise<{ data: QuestionPaper }> {
  return apiPost(`${API_BASE}/exams/question-papers`, data)
}

export async function deleteQuestionPaper(id: string): Promise<{ success: boolean }> {
  return apiDelete(`${API_BASE}/exams/question-papers/${id}`)
}
