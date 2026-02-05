// ==================== EXAM TYPE ENUMS ====================

export type ExamType = 'unit_test' | 'mid_term' | 'quarterly' | 'half_yearly' | 'annual' | 'practical'

export type ExamStatus = 'scheduled' | 'ongoing' | 'completed' | 'results_published'

export type SubjectType = 'theory' | 'practical' | 'both'

// ==================== SUBJECT ====================

export interface Subject {
  id: string
  name: string
  code: string
  type: SubjectType
  maxMarks: number
  passingMarks: number
}

// ==================== EXAM ====================

export interface Exam {
  id: string
  name: string
  type: ExamType
  academicYear: string
  term: string
  applicableClasses: string[]
  subjects: Subject[]
  startDate: string
  endDate: string
  status: ExamStatus
  createdAt: string
  updatedAt: string
}

export interface CreateExamRequest {
  name: string
  type: ExamType
  academicYear: string
  term: string
  applicableClasses: string[]
  subjects: Omit<Subject, 'id'>[]
  startDate: string
  endDate: string
}

export interface UpdateExamRequest {
  name?: string
  type?: ExamType
  applicableClasses?: string[]
  subjects?: Omit<Subject, 'id'>[]
  startDate?: string
  endDate?: string
  status?: ExamStatus
}

export interface ExamFilters {
  type?: ExamType
  status?: ExamStatus
  academicYear?: string
  className?: string
  search?: string
  page?: number
  limit?: number
}

// ==================== STUDENT MARKS ====================

export interface StudentMark {
  id: string
  examId: string
  studentId: string
  studentName: string
  studentClass: string
  studentSection: string
  admissionNumber: string
  subjectId: string
  subjectName: string
  marksObtained: number
  maxMarks: number
  grade?: string
  isAbsent: boolean
  remarks?: string
  createdAt: string
  updatedAt: string
}

export interface SubmitMarksRequest {
  examId: string
  subjectId: string
  marks: {
    studentId: string
    marksObtained: number
    isAbsent: boolean
    remarks?: string
  }[]
}

export interface MarksEntryStudent {
  id: string
  name: string
  admissionNumber: string
  class: string
  section: string
  rollNumber: number
  marksObtained?: number
  isAbsent?: boolean
  remarks?: string
}

// ==================== REPORT CARD ====================

export interface ReportCardSubject {
  subjectName: string
  subjectCode: string
  maxMarks: number
  marksObtained: number
  grade: string
  gradePoint?: number
  remarks?: string
}

export interface ReportCard {
  id: string
  studentId: string
  studentName: string
  studentClass: string
  studentSection: string
  admissionNumber: string
  rollNumber: number
  academicYear: string
  term: string
  examName: string
  subjects: ReportCardSubject[]
  totalMarks: number
  totalObtained: number
  percentage: number
  grade: string
  rank?: number
  attendance?: {
    totalDays: number
    presentDays: number
    percentage: number
  }
  remarks?: string
  generatedAt: string
}

export interface GenerateReportCardsRequest {
  examId: string
  classId?: string
  studentIds?: string[]
}

// ==================== GRADE SCALE ====================

export interface GradeRange {
  minPercentage: number
  maxPercentage: number
  grade: string
  gradePoint?: number
  description?: string
}

export interface GradeScale {
  id: string
  name: string
  isDefault: boolean
  ranges: GradeRange[]
  createdAt: string
  updatedAt: string
}

export interface CreateGradeScaleRequest {
  name: string
  ranges: Omit<GradeRange, 'id'>[]
  isDefault?: boolean
}

export interface UpdateGradeScaleRequest {
  name?: string
  ranges?: Omit<GradeRange, 'id'>[]
  isDefault?: boolean
}

// ==================== CONSTANTS ====================

export const EXAM_TYPES: ExamType[] = [
  'unit_test',
  'mid_term',
  'quarterly',
  'half_yearly',
  'annual',
  'practical',
]

export const EXAM_TYPE_LABELS: Record<ExamType, string> = {
  unit_test: 'Unit Test',
  mid_term: 'Mid Term',
  quarterly: 'Quarterly',
  half_yearly: 'Half Yearly',
  annual: 'Annual',
  practical: 'Practical',
}

export const EXAM_STATUS_LABELS: Record<ExamStatus, string> = {
  scheduled: 'Scheduled',
  ongoing: 'Ongoing',
  completed: 'Completed',
  results_published: 'Results Published',
}

export const SUBJECT_TYPE_LABELS: Record<SubjectType, string> = {
  theory: 'Theory',
  practical: 'Practical',
  both: 'Theory + Practical',
}

export const TERMS = ['Term 1', 'Term 2', 'Term 3']

export const ACADEMIC_YEARS = ['2024-25', '2023-24', '2022-23']

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

export const SECTIONS = ['A', 'B', 'C', 'D']

export const DEFAULT_SUBJECTS: Omit<Subject, 'id'>[] = [
  { name: 'English', code: 'ENG', type: 'theory', maxMarks: 100, passingMarks: 35 },
  { name: 'Hindi', code: 'HIN', type: 'theory', maxMarks: 100, passingMarks: 35 },
  { name: 'Mathematics', code: 'MATH', type: 'theory', maxMarks: 100, passingMarks: 35 },
  { name: 'Science', code: 'SCI', type: 'both', maxMarks: 100, passingMarks: 35 },
  { name: 'Social Studies', code: 'SST', type: 'theory', maxMarks: 100, passingMarks: 35 },
  { name: 'Computer Science', code: 'CS', type: 'both', maxMarks: 100, passingMarks: 35 },
  { name: 'Physical Education', code: 'PE', type: 'practical', maxMarks: 100, passingMarks: 35 },
]

export const DEFAULT_GRADE_SCALE: GradeRange[] = [
  { minPercentage: 90, maxPercentage: 100, grade: 'A+', gradePoint: 10, description: 'Outstanding' },
  { minPercentage: 80, maxPercentage: 89.99, grade: 'A', gradePoint: 9, description: 'Excellent' },
  { minPercentage: 70, maxPercentage: 79.99, grade: 'B+', gradePoint: 8, description: 'Very Good' },
  { minPercentage: 60, maxPercentage: 69.99, grade: 'B', gradePoint: 7, description: 'Good' },
  { minPercentage: 50, maxPercentage: 59.99, grade: 'C+', gradePoint: 6, description: 'Above Average' },
  { minPercentage: 40, maxPercentage: 49.99, grade: 'C', gradePoint: 5, description: 'Average' },
  { minPercentage: 33, maxPercentage: 39.99, grade: 'D', gradePoint: 4, description: 'Pass' },
  { minPercentage: 0, maxPercentage: 32.99, grade: 'F', gradePoint: 0, description: 'Fail' },
]

export const EXAMS_PER_PAGE = 10
export const MARKS_PER_PAGE = 50

// ==================== EXAM TIMETABLE ====================

export interface ExamSlot {
  id: string
  examId: string
  subjectId: string
  subjectName: string
  subjectCode: string
  date: string
  startTime: string
  endTime: string
  room: string
  invigilator: string
  applicableClasses: string[]
}

export interface ExamTimetable {
  examId: string
  examName: string
  slots: ExamSlot[]
}

export interface CreateExamSlotRequest {
  examId: string
  subjectId: string
  date: string
  startTime: string
  endTime: string
  room: string
  invigilator: string
  applicableClasses: string[]
}

// ==================== MARKS ANALYTICS ====================

export interface SubjectAnalytics {
  subjectId: string
  subjectName: string
  totalStudents: number
  appeared: number
  absent: number
  passed: number
  failed: number
  passPercentage: number
  average: number
  highest: number
  lowest: number
  median: number
  toppers: { studentId: string; studentName: string; marks: number }[]
}

export interface ClassAnalytics {
  className: string
  section: string
  totalStudents: number
  classAverage: number
  passPercentage: number
  gradeDistribution: { grade: string; count: number }[]
  subjectWise: SubjectAnalytics[]
  toppers: { rank: number; studentId: string; studentName: string; percentage: number; grade: string }[]
}

// ==================== PROGRESS TRACKING ====================

export interface TermProgress {
  term: string
  examName: string
  examId: string
  percentage: number
  grade: string
  rank?: number
  subjectWise: { subjectName: string; marks: number; maxMarks: number; percentage: number }[]
}

export interface StudentProgress {
  studentId: string
  studentName: string
  studentClass: string
  studentSection: string
  terms: TermProgress[]
  overallTrend: 'improving' | 'declining' | 'stable'
  improvementPercentage: number
}

// ==================== CO-SCHOLASTIC (CCE/CBSE) ====================

export type CoScholasticArea = 'art' | 'music' | 'dance' | 'sports' | 'yoga' | 'discipline' | 'work_education' | 'health_education'
export type CoScholasticGrade = 'A' | 'B' | 'C'

export interface CoScholasticRecord {
  id: string
  studentId: string
  studentName: string
  studentClass: string
  studentSection: string
  academicYear: string
  term: string
  area: CoScholasticArea
  grade: CoScholasticGrade
  remarks: string
  assessedBy: string
  assessedAt: string
}

export interface SubmitCoScholasticRequest {
  studentId: string
  term: string
  records: { area: CoScholasticArea; grade: CoScholasticGrade; remarks: string }[]
}

export const CO_SCHOLASTIC_AREA_LABELS: Record<CoScholasticArea, string> = {
  art: 'Art & Craft',
  music: 'Music',
  dance: 'Dance',
  sports: 'Sports & Games',
  yoga: 'Yoga',
  discipline: 'Discipline',
  work_education: 'Work Education',
  health_education: 'Health & Physical Education',
}

export const CO_SCHOLASTIC_GRADE_LABELS: Record<CoScholasticGrade, string> = {
  A: 'Outstanding',
  B: 'Very Good',
  C: 'Fair',
}

// ==================== QUESTION PAPER MANAGEMENT ====================

export type PaperDifficulty = 'easy' | 'medium' | 'hard'

export interface QuestionPaper {
  id: string
  examId?: string
  examName?: string
  subjectId: string
  subjectName: string
  subjectCode: string
  className: string
  academicYear: string
  term: string
  totalMarks: number
  duration: string
  difficulty: PaperDifficulty
  sections: PaperSection[]
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface PaperSection {
  name: string
  instructions: string
  questionCount: number
  marksPerQuestion: number
  totalMarks: number
}

export interface CreateQuestionPaperRequest {
  examId?: string
  subjectId: string
  subjectName: string
  subjectCode: string
  className: string
  academicYear: string
  term: string
  totalMarks: number
  duration: string
  difficulty: PaperDifficulty
  sections: PaperSection[]
}

export const PAPER_DIFFICULTY_LABELS: Record<PaperDifficulty, string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
}
