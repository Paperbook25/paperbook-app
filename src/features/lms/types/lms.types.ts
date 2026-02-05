// ==================== STATUS & TYPE UNIONS ====================

export type CourseStatus = 'draft' | 'published' | 'archived'
export type CourseLevel = 'beginner' | 'intermediate' | 'advanced'
export type LessonType = 'video' | 'live_class' | 'document' | 'quiz' | 'assignment'
export type VideoProvider = 'youtube' | 'vimeo' | 'upload'
export type LiveClassStatus = 'scheduled' | 'live' | 'completed' | 'cancelled'
export type EnrollmentStatus = 'active' | 'completed' | 'dropped'
export type SubmissionStatus = 'not_submitted' | 'submitted' | 'graded'
export type QuizQuestionType = 'mcq' | 'true_false' | 'short_answer'

// ==================== CONSTANTS ====================

export const COURSE_CATEGORIES = [
  'mathematics',
  'science',
  'english',
  'social_studies',
  'computer_science',
  'arts',
  'physical_education',
  'languages',
  'general',
] as const

export type CourseCategory = (typeof COURSE_CATEGORIES)[number]

export const COURSE_CATEGORY_LABELS: Record<CourseCategory, string> = {
  mathematics: 'Mathematics',
  science: 'Science',
  english: 'English',
  social_studies: 'Social Studies',
  computer_science: 'Computer Science',
  arts: 'Arts',
  physical_education: 'Physical Education',
  languages: 'Languages',
  general: 'General',
}

export const COURSE_LEVEL_LABELS: Record<CourseLevel, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
}

export const COURSE_STATUS_LABELS: Record<CourseStatus, string> = {
  draft: 'Draft',
  published: 'Published',
  archived: 'Archived',
}

export const LESSON_TYPE_LABELS: Record<LessonType, string> = {
  video: 'Video',
  live_class: 'Live Class',
  document: 'Document',
  quiz: 'Quiz',
  assignment: 'Assignment',
}

export const LIVE_CLASS_STATUS_LABELS: Record<LiveClassStatus, string> = {
  scheduled: 'Scheduled',
  live: 'Live Now',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

export const ENROLLMENT_STATUS_LABELS: Record<EnrollmentStatus, string> = {
  active: 'Active',
  completed: 'Completed',
  dropped: 'Dropped',
}

export const SUBMISSION_STATUS_LABELS: Record<SubmissionStatus, string> = {
  not_submitted: 'Not Submitted',
  submitted: 'Submitted',
  graded: 'Graded',
}

// ==================== INTERFACES ====================

export interface Instructor {
  id: string
  name: string
  email: string
  avatar: string
  bio: string
  expertise: string[]
  coursesCount: number
  rating: number
}

export interface Course {
  id: string
  title: string
  description: string
  thumbnail: string
  category: CourseCategory
  level: CourseLevel
  instructorId: string
  instructorName: string
  price: number
  status: CourseStatus
  duration: number // hours
  enrollmentCount: number
  rating: number
  tags: string[]
  createdAt: string
  updatedAt: string
}

export interface CourseModule {
  id: string
  courseId: string
  title: string
  description: string
  order: number
  duration: number // minutes
}

export interface Lesson {
  id: string
  moduleId: string
  courseId: string
  title: string
  type: LessonType
  order: number
  duration: number // minutes
  contentUrl: string
  videoProvider?: VideoProvider
  isFree: boolean
}

export interface LiveClass {
  id: string
  courseId: string
  courseName: string
  title: string
  instructorId: string
  instructorName: string
  scheduledAt: string
  duration: number // minutes
  meetingLink: string
  meetingId?: string
  meetingPassword?: string
  status: LiveClassStatus
  attendanceCount: number
  recordingUrl?: string
}

export interface Enrollment {
  id: string
  courseId: string
  courseName: string
  studentId: string
  studentName: string
  enrolledAt: string
  status: EnrollmentStatus
  progress: number // percentage
  lessonsCompleted: number
  totalLessons: number
}

export interface Assignment {
  id: string
  lessonId: string
  courseId: string
  courseName: string
  title: string
  instructions: string
  maxScore: number
  dueDate: string
  submissionCount: number
  createdAt: string
}

export interface AssignmentSubmission {
  id: string
  assignmentId: string
  studentId: string
  studentName: string
  submittedAt: string
  submissionText: string
  attachmentUrl?: string
  score: number | null
  feedback: string
  status: SubmissionStatus
}

export interface QuizQuestion {
  id: string
  question: string
  type: QuizQuestionType
  options: string[]
  correctAnswer: string
  points: number
  explanation?: string
}

export interface Quiz {
  id: string
  lessonId: string
  courseId: string
  courseName: string
  title: string
  description: string
  duration: number // minutes, 0 = no limit
  passingScore: number // percentage
  maxAttempts: number
  questions: QuizQuestion[]
  totalPoints: number
  createdAt: string
}

export interface QuizAttempt {
  id: string
  quizId: string
  quizTitle: string
  studentId: string
  studentName: string
  score: number
  totalPoints: number
  percentage: number
  passed: boolean
  answers: { questionId: string; answer: string; correct: boolean }[]
  submittedAt: string
}

// ==================== STATS ====================

export interface LmsStats {
  totalCourses: number
  publishedCourses: number
  totalStudents: number
  activeEnrollments: number
  liveClassesToday: number
  avgCompletionRate: number
  totalInstructors: number
  totalRevenue: number
}

export interface InstructorStats {
  totalCourses: number
  totalStudents: number
  avgRating: number
  liveClassesThisWeek: number
  pendingGrading: number
}

export interface StudentLmsStats {
  enrolledCourses: number
  completedCourses: number
  avgProgress: number
  upcomingLiveClasses: number
  pendingAssignments: number
  quizzesTaken: number
}

// ==================== FILTER TYPES ====================

export interface CourseFilters {
  search?: string
  category?: CourseCategory
  level?: CourseLevel
  status?: CourseStatus
  instructorId?: string
  page?: number
  limit?: number
}

export interface LiveClassFilters {
  search?: string
  courseId?: string
  instructorId?: string
  status?: LiveClassStatus
  page?: number
  limit?: number
}

export interface EnrollmentFilters {
  search?: string
  courseId?: string
  status?: EnrollmentStatus
  page?: number
  limit?: number
}

// ==================== REQUEST TYPES ====================

export interface CreateCourseRequest {
  title: string
  description: string
  thumbnail?: string
  category: CourseCategory
  level: CourseLevel
  instructorId: string
  price: number
  status: CourseStatus
  tags: string[]
}

export interface UpdateCourseRequest extends Partial<CreateCourseRequest> {}

export interface CreateModuleRequest {
  courseId: string
  title: string
  description: string
  order: number
}

export interface CreateLessonRequest {
  moduleId: string
  courseId: string
  title: string
  type: LessonType
  order: number
  duration: number
  contentUrl: string
  videoProvider?: VideoProvider
  isFree: boolean
}

export interface CreateLiveClassRequest {
  courseId: string
  title: string
  instructorId: string
  scheduledAt: string
  duration: number
  meetingLink: string
  meetingId?: string
  meetingPassword?: string
}

export interface CreateEnrollmentRequest {
  courseId: string
  studentId: string
}

export interface CreateAssignmentRequest {
  lessonId: string
  courseId: string
  title: string
  instructions: string
  maxScore: number
  dueDate: string
}

export interface CreateSubmissionRequest {
  assignmentId: string
  studentId: string
  submissionText: string
  attachmentUrl?: string
}

export interface GradeSubmissionRequest {
  score: number
  feedback: string
}

export interface CreateQuizRequest {
  lessonId: string
  courseId: string
  title: string
  description: string
  duration: number
  passingScore: number
  maxAttempts: number
  questions: Omit<QuizQuestion, 'id'>[]
}

export interface SubmitQuizRequest {
  studentId: string
  answers: { questionId: string; answer: string }[]
}

export interface LessonProgressRequest {
  studentId: string
  enrollmentId: string
  completed: boolean
}
