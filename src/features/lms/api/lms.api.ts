import type {
  Course,
  CourseModule,
  Lesson,
  LiveClass,
  Enrollment,
  Assignment,
  AssignmentSubmission,
  Quiz,
  QuizAttempt,
  Instructor,
  LmsStats,
  CourseFilters,
  LiveClassFilters,
  EnrollmentFilters,
  CreateCourseRequest,
  UpdateCourseRequest,
  CreateModuleRequest,
  CreateLessonRequest,
  CreateLiveClassRequest,
  CreateEnrollmentRequest,
  CreateAssignmentRequest,
  CreateSubmissionRequest,
  GradeSubmissionRequest,
  CreateQuizRequest,
  SubmitQuizRequest,
  LessonProgressRequest,
} from '../types/lms.types'
import type { PaginatedResponse } from '@/types/common.types'

const BASE = '/api/lms'

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options)
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

// ==================== STATS ====================

export async function fetchLmsStats() {
  return fetchJson<{ data: LmsStats }>(`${BASE}/stats`)
}

export async function fetchInstructors() {
  return fetchJson<{ data: Instructor[] }>(`${BASE}/instructors`)
}

// ==================== COURSES ====================

export async function fetchCourses(params?: CourseFilters) {
  const qs = new URLSearchParams()
  if (params?.search) qs.set('search', params.search)
  if (params?.category) qs.set('category', params.category)
  if (params?.level) qs.set('level', params.level)
  if (params?.status) qs.set('status', params.status)
  if (params?.instructorId) qs.set('instructorId', params.instructorId)
  if (params?.page) qs.set('page', String(params.page))
  if (params?.limit) qs.set('limit', String(params.limit))
  return fetchJson<PaginatedResponse<Course>>(`${BASE}/courses?${qs}`)
}

export async function fetchCourse(id: string) {
  return fetchJson<{ data: Course }>(`${BASE}/courses/${id}`)
}

export async function createCourse(data: CreateCourseRequest) {
  return fetchJson<{ data: Course }>(`${BASE}/courses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

export async function updateCourse(id: string, data: UpdateCourseRequest) {
  return fetchJson<{ data: Course }>(`${BASE}/courses/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

export async function deleteCourse(id: string) {
  return fetchJson<{ success: boolean }>(`${BASE}/courses/${id}`, { method: 'DELETE' })
}

// ==================== MODULES ====================

export async function fetchCourseModules(courseId: string) {
  return fetchJson<{ data: CourseModule[] }>(`${BASE}/courses/${courseId}/modules`)
}

export async function createModule(data: CreateModuleRequest) {
  return fetchJson<{ data: CourseModule }>(`${BASE}/modules`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

export async function updateModule(id: string, data: Partial<CourseModule>) {
  return fetchJson<{ data: CourseModule }>(`${BASE}/modules/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

export async function deleteModule(id: string) {
  return fetchJson<{ success: boolean }>(`${BASE}/modules/${id}`, { method: 'DELETE' })
}

// ==================== LESSONS ====================

export async function fetchModuleLessons(moduleId: string) {
  return fetchJson<{ data: Lesson[] }>(`${BASE}/modules/${moduleId}/lessons`)
}

export async function createLesson(data: CreateLessonRequest) {
  return fetchJson<{ data: Lesson }>(`${BASE}/lessons`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

export async function updateLesson(id: string, data: Partial<Lesson>) {
  return fetchJson<{ data: Lesson }>(`${BASE}/lessons/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

export async function deleteLesson(id: string) {
  return fetchJson<{ success: boolean }>(`${BASE}/lessons/${id}`, { method: 'DELETE' })
}

// ==================== LIVE CLASSES ====================

export async function fetchLiveClasses(params?: LiveClassFilters) {
  const qs = new URLSearchParams()
  if (params?.search) qs.set('search', params.search)
  if (params?.courseId) qs.set('courseId', params.courseId)
  if (params?.instructorId) qs.set('instructorId', params.instructorId)
  if (params?.status) qs.set('status', params.status)
  if (params?.page) qs.set('page', String(params.page))
  if (params?.limit) qs.set('limit', String(params.limit))
  return fetchJson<PaginatedResponse<LiveClass>>(`${BASE}/live-classes?${qs}`)
}

export async function fetchLiveClass(id: string) {
  return fetchJson<{ data: LiveClass }>(`${BASE}/live-classes/${id}`)
}

export async function createLiveClass(data: CreateLiveClassRequest) {
  return fetchJson<{ data: LiveClass }>(`${BASE}/live-classes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

export async function updateLiveClass(id: string, data: Partial<LiveClass>) {
  return fetchJson<{ data: LiveClass }>(`${BASE}/live-classes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

export async function deleteLiveClass(id: string) {
  return fetchJson<{ success: boolean }>(`${BASE}/live-classes/${id}`, { method: 'DELETE' })
}

// ==================== ENROLLMENTS ====================

export async function fetchEnrollments(params?: EnrollmentFilters) {
  const qs = new URLSearchParams()
  if (params?.search) qs.set('search', params.search)
  if (params?.courseId) qs.set('courseId', params.courseId)
  if (params?.status) qs.set('status', params.status)
  if (params?.page) qs.set('page', String(params.page))
  if (params?.limit) qs.set('limit', String(params.limit))
  return fetchJson<PaginatedResponse<Enrollment>>(`${BASE}/enrollments?${qs}`)
}

export async function createEnrollment(data: CreateEnrollmentRequest) {
  return fetchJson<{ data: Enrollment }>(`${BASE}/enrollments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

export async function updateEnrollment(id: string, data: Partial<Enrollment>) {
  return fetchJson<{ data: Enrollment }>(`${BASE}/enrollments/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

export async function fetchEnrollmentProgress(id: string) {
  return fetchJson<{ data: { enrollmentId: string; completedLessonIds: string[] } }>(`${BASE}/enrollments/${id}/progress`)
}

// ==================== ASSIGNMENTS ====================

export async function fetchAssignments(params?: { courseId?: string; search?: string }) {
  const qs = new URLSearchParams()
  if (params?.courseId) qs.set('courseId', params.courseId)
  if (params?.search) qs.set('search', params.search)
  return fetchJson<{ data: Assignment[] }>(`${BASE}/assignments?${qs}`)
}

export async function fetchAssignment(id: string) {
  return fetchJson<{ data: Assignment }>(`${BASE}/assignments/${id}`)
}

export async function createAssignment(data: CreateAssignmentRequest) {
  return fetchJson<{ data: Assignment }>(`${BASE}/assignments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

export async function updateAssignment(id: string, data: Partial<Assignment>) {
  return fetchJson<{ data: Assignment }>(`${BASE}/assignments/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

export async function deleteAssignment(id: string) {
  return fetchJson<{ success: boolean }>(`${BASE}/assignments/${id}`, { method: 'DELETE' })
}

export async function fetchSubmissions(assignmentId: string) {
  return fetchJson<{ data: AssignmentSubmission[] }>(`${BASE}/assignments/${assignmentId}/submissions`)
}

export async function createSubmission(data: CreateSubmissionRequest) {
  return fetchJson<{ data: AssignmentSubmission }>(`${BASE}/submissions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

export async function gradeSubmission(id: string, data: GradeSubmissionRequest) {
  return fetchJson<{ data: AssignmentSubmission }>(`${BASE}/submissions/${id}/grade`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

// ==================== QUIZZES ====================

export async function fetchQuizzes(params?: { courseId?: string; search?: string }) {
  const qs = new URLSearchParams()
  if (params?.courseId) qs.set('courseId', params.courseId)
  if (params?.search) qs.set('search', params.search)
  return fetchJson<{ data: Quiz[] }>(`${BASE}/quizzes?${qs}`)
}

export async function fetchQuiz(id: string) {
  return fetchJson<{ data: Quiz }>(`${BASE}/quizzes/${id}`)
}

export async function createQuiz(data: CreateQuizRequest) {
  return fetchJson<{ data: Quiz }>(`${BASE}/quizzes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

export async function updateQuiz(id: string, data: Partial<Quiz>) {
  return fetchJson<{ data: Quiz }>(`${BASE}/quizzes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

export async function deleteQuiz(id: string) {
  return fetchJson<{ success: boolean }>(`${BASE}/quizzes/${id}`, { method: 'DELETE' })
}

export async function submitQuiz(quizId: string, data: SubmitQuizRequest) {
  return fetchJson<{ data: QuizAttempt }>(`${BASE}/quizzes/${quizId}/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

export async function fetchQuizAttempts(quizId: string) {
  return fetchJson<{ data: QuizAttempt[] }>(`${BASE}/quizzes/${quizId}/attempts`)
}

// ==================== LESSON PROGRESS ====================

export async function updateLessonProgress(lessonId: string, data: LessonProgressRequest) {
  return fetchJson<{ data: { lessonId: string; completed: boolean } }>(`${BASE}/lessons/${lessonId}/progress`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}
