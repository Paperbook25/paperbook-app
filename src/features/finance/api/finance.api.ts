import { apiGet } from '@/lib/api-client'
import type {
  FeeType,
  CreateFeeTypeRequest,
  UpdateFeeTypeRequest,
  FeeStructure,
  CreateFeeStructureRequest,
  UpdateFeeStructureRequest,
  FeeStructureFilters,
  StudentFee,
  StudentFeeFilters,
  Payment,
  CollectPaymentRequest,
  PaymentFilters,
  Receipt,
  OutstandingDue,
  OutstandingFilters,
  SendReminderRequest,
  Expense,
  CreateExpenseRequest,
  UpdateExpenseRequest,
  ExpenseFilters,
  ApproveExpenseRequest,
  RejectExpenseRequest,
  MarkExpensePaidRequest,
  LedgerEntry,
  LedgerFilters,
  LedgerBalance,
  CollectionReport,
  DueReport,
  FinancialSummary,
  FinanceStats,
} from '../types/finance.types'

// ==================== USER-SCOPED TYPES ====================

export interface FeesSummary {
  totalFees: number
  totalPaid: number
  totalDiscount: number
  totalPending: number
}

export interface MyFeesResponse {
  fees: StudentFee[]
  summary: FeesSummary
}

export interface ChildFeesData {
  studentId: string
  studentName: string
  studentClass: string
  studentSection: string
  fees: StudentFee[]
  summary: FeesSummary
}

interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

const API_BASE = '/api/finance'

// ==================== USER-SCOPED ENDPOINTS ====================

export async function fetchMyFees(): Promise<{ data: MyFeesResponse }> {
  return apiGet(`${API_BASE}/my-fees`)
}

export async function fetchMyChildrenFees(): Promise<{ data: ChildFeesData[] }> {
  return apiGet(`${API_BASE}/my-children-fees`)
}

export async function fetchMyPayments(): Promise<{ data: Payment[] }> {
  return apiGet(`${API_BASE}/my-payments`)
}

// ==================== FEE TYPES ====================

export async function fetchFeeTypes(): Promise<{ data: FeeType[] }> {
  const response = await fetch(`${API_BASE}/fee-types`)
  if (!response.ok) {
    throw new Error('Failed to fetch fee types')
  }
  return response.json()
}

export async function fetchFeeType(id: string): Promise<{ data: FeeType }> {
  const response = await fetch(`${API_BASE}/fee-types/${id}`)
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Fee type not found')
    }
    throw new Error('Failed to fetch fee type')
  }
  return response.json()
}

export async function createFeeType(data: CreateFeeTypeRequest): Promise<{ data: FeeType }> {
  const response = await fetch(`${API_BASE}/fee-types`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error('Failed to create fee type')
  }
  return response.json()
}

export async function updateFeeType(
  id: string,
  data: UpdateFeeTypeRequest
): Promise<{ data: FeeType }> {
  const response = await fetch(`${API_BASE}/fee-types/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error('Failed to update fee type')
  }
  return response.json()
}

export async function deleteFeeType(id: string): Promise<{ success: boolean }> {
  const response = await fetch(`${API_BASE}/fee-types/${id}`, {
    method: 'DELETE',
  })
  if (!response.ok) {
    throw new Error('Failed to delete fee type')
  }
  return response.json()
}

// ==================== FEE STRUCTURES ====================

export async function fetchFeeStructures(
  filters: FeeStructureFilters = {}
): Promise<{ data: FeeStructure[] }> {
  const params = new URLSearchParams()

  if (filters.academicYear) params.set('academicYear', filters.academicYear)
  if (filters.feeTypeId) params.set('feeTypeId', filters.feeTypeId)
  if (filters.className) params.set('className', filters.className)
  if (filters.isActive !== undefined) params.set('isActive', String(filters.isActive))

  const response = await fetch(`${API_BASE}/fee-structures?${params.toString()}`)
  if (!response.ok) {
    throw new Error('Failed to fetch fee structures')
  }
  return response.json()
}

export async function createFeeStructure(
  data: CreateFeeStructureRequest
): Promise<{ data: FeeStructure }> {
  const response = await fetch(`${API_BASE}/fee-structures`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error('Failed to create fee structure')
  }
  return response.json()
}

export async function updateFeeStructure(
  id: string,
  data: UpdateFeeStructureRequest
): Promise<{ data: FeeStructure }> {
  const response = await fetch(`${API_BASE}/fee-structures/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error('Failed to update fee structure')
  }
  return response.json()
}

export async function deleteFeeStructure(id: string): Promise<{ success: boolean }> {
  const response = await fetch(`${API_BASE}/fee-structures/${id}`, {
    method: 'DELETE',
  })
  if (!response.ok) {
    throw new Error('Failed to delete fee structure')
  }
  return response.json()
}

// ==================== STUDENT FEES ====================

export async function fetchStudentFees(
  filters: StudentFeeFilters = {}
): Promise<PaginatedResponse<StudentFee>> {
  const params = new URLSearchParams()

  if (filters.studentId) params.set('studentId', filters.studentId)
  if (filters.academicYear) params.set('academicYear', filters.academicYear)
  if (filters.feeTypeId) params.set('feeTypeId', filters.feeTypeId)
  if (filters.className) params.set('className', filters.className)
  if (filters.section) params.set('section', filters.section)
  if (filters.status && filters.status !== 'all') params.set('status', filters.status)
  if (filters.search) params.set('search', filters.search)
  if (filters.page) params.set('page', String(filters.page))
  if (filters.limit) params.set('limit', String(filters.limit))

  const response = await fetch(`${API_BASE}/student-fees?${params.toString()}`)
  if (!response.ok) {
    throw new Error('Failed to fetch student fees')
  }
  return response.json()
}

export async function fetchStudentFeesById(studentId: string): Promise<{ data: StudentFee[] }> {
  const response = await fetch(`${API_BASE}/students/${studentId}/fees`)
  if (!response.ok) {
    throw new Error('Failed to fetch student fees')
  }
  return response.json()
}

// ==================== PAYMENTS ====================

export async function fetchPayments(
  filters: PaymentFilters = {}
): Promise<PaginatedResponse<Payment>> {
  const params = new URLSearchParams()

  if (filters.studentId) params.set('studentId', filters.studentId)
  if (filters.dateFrom) params.set('dateFrom', filters.dateFrom)
  if (filters.dateTo) params.set('dateTo', filters.dateTo)
  if (filters.paymentMode && filters.paymentMode !== 'all')
    params.set('paymentMode', filters.paymentMode)
  if (filters.search) params.set('search', filters.search)
  if (filters.page) params.set('page', String(filters.page))
  if (filters.limit) params.set('limit', String(filters.limit))

  const response = await fetch(`${API_BASE}/payments?${params.toString()}`)
  if (!response.ok) {
    throw new Error('Failed to fetch payments')
  }
  return response.json()
}

export async function collectPayment(
  data: CollectPaymentRequest
): Promise<{ data: Receipt; payments: Payment[] }> {
  const response = await fetch(`${API_BASE}/payments/collect`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to collect payment')
  }
  return response.json()
}

export async function fetchReceipt(receiptNumber: string): Promise<{ data: Receipt }> {
  const response = await fetch(`${API_BASE}/receipts/${receiptNumber}`)
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Receipt not found')
    }
    throw new Error('Failed to fetch receipt')
  }
  return response.json()
}

// ==================== OUTSTANDING DUES ====================

export async function fetchOutstandingDues(
  filters: OutstandingFilters = {}
): Promise<PaginatedResponse<OutstandingDue>> {
  const params = new URLSearchParams()

  if (filters.className) params.set('className', filters.className)
  if (filters.section) params.set('section', filters.section)
  if (filters.minDaysOverdue) params.set('minDaysOverdue', String(filters.minDaysOverdue))
  if (filters.search) params.set('search', filters.search)
  if (filters.page) params.set('page', String(filters.page))
  if (filters.limit) params.set('limit', String(filters.limit))

  const response = await fetch(`${API_BASE}/outstanding?${params.toString()}`)
  if (!response.ok) {
    throw new Error('Failed to fetch outstanding dues')
  }
  return response.json()
}

export async function fetchOutstandingSummary(): Promise<{
  data: {
    totalOutstanding: number
    totalStudents: number
    averageOverdueDays: number
  }
}> {
  const response = await fetch(`${API_BASE}/outstanding/summary`)
  if (!response.ok) {
    throw new Error('Failed to fetch outstanding summary')
  }
  return response.json()
}

export async function sendReminders(
  data: SendReminderRequest
): Promise<{ success: boolean; count: number }> {
  const response = await fetch(`${API_BASE}/reminders/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error('Failed to send reminders')
  }
  return response.json()
}

// ==================== EXPENSES ====================

export async function fetchExpenses(
  filters: ExpenseFilters = {}
): Promise<PaginatedResponse<Expense>> {
  const params = new URLSearchParams()

  if (filters.category && filters.category !== 'all') params.set('category', filters.category)
  if (filters.status && filters.status !== 'all') params.set('status', filters.status)
  if (filters.dateFrom) params.set('dateFrom', filters.dateFrom)
  if (filters.dateTo) params.set('dateTo', filters.dateTo)
  if (filters.search) params.set('search', filters.search)
  if (filters.page) params.set('page', String(filters.page))
  if (filters.limit) params.set('limit', String(filters.limit))

  const response = await fetch(`${API_BASE}/expenses?${params.toString()}`)
  if (!response.ok) {
    throw new Error('Failed to fetch expenses')
  }
  return response.json()
}

export async function fetchExpense(id: string): Promise<{ data: Expense }> {
  const response = await fetch(`${API_BASE}/expenses/${id}`)
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Expense not found')
    }
    throw new Error('Failed to fetch expense')
  }
  return response.json()
}

export async function createExpense(data: CreateExpenseRequest): Promise<{ data: Expense }> {
  const response = await fetch(`${API_BASE}/expenses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error('Failed to create expense')
  }
  return response.json()
}

export async function updateExpense(
  id: string,
  data: UpdateExpenseRequest
): Promise<{ data: Expense }> {
  const response = await fetch(`${API_BASE}/expenses/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error('Failed to update expense')
  }
  return response.json()
}

export async function approveExpense(
  id: string,
  data: ApproveExpenseRequest = {}
): Promise<{ data: Expense }> {
  const response = await fetch(`${API_BASE}/expenses/${id}/approve`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error('Failed to approve expense')
  }
  return response.json()
}

export async function rejectExpense(
  id: string,
  data: RejectExpenseRequest
): Promise<{ data: Expense }> {
  const response = await fetch(`${API_BASE}/expenses/${id}/reject`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error('Failed to reject expense')
  }
  return response.json()
}

export async function markExpensePaid(
  id: string,
  data: MarkExpensePaidRequest = {}
): Promise<{ data: Expense }> {
  const response = await fetch(`${API_BASE}/expenses/${id}/mark-paid`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error('Failed to mark expense as paid')
  }
  return response.json()
}

export async function deleteExpense(id: string): Promise<{ success: boolean }> {
  const response = await fetch(`${API_BASE}/expenses/${id}`, {
    method: 'DELETE',
  })
  if (!response.ok) {
    throw new Error('Failed to delete expense')
  }
  return response.json()
}

// ==================== LEDGER ====================

export async function fetchLedger(
  filters: LedgerFilters = {}
): Promise<PaginatedResponse<LedgerEntry>> {
  const params = new URLSearchParams()

  if (filters.type && filters.type !== 'all') params.set('type', filters.type)
  if (filters.dateFrom) params.set('dateFrom', filters.dateFrom)
  if (filters.dateTo) params.set('dateTo', filters.dateTo)
  if (filters.page) params.set('page', String(filters.page))
  if (filters.limit) params.set('limit', String(filters.limit))

  const response = await fetch(`${API_BASE}/ledger?${params.toString()}`)
  if (!response.ok) {
    throw new Error('Failed to fetch ledger')
  }
  return response.json()
}

export async function fetchLedgerBalance(): Promise<{ data: LedgerBalance }> {
  const response = await fetch(`${API_BASE}/ledger/balance`)
  if (!response.ok) {
    throw new Error('Failed to fetch ledger balance')
  }
  return response.json()
}

// ==================== REPORTS ====================

export async function fetchCollectionReport(
  dateFrom: string,
  dateTo: string
): Promise<{ data: CollectionReport }> {
  const params = new URLSearchParams()
  params.set('dateFrom', dateFrom)
  params.set('dateTo', dateTo)

  const response = await fetch(`${API_BASE}/reports/collection?${params.toString()}`)
  if (!response.ok) {
    throw new Error('Failed to fetch collection report')
  }
  return response.json()
}

export async function fetchDueReport(): Promise<{ data: DueReport }> {
  const response = await fetch(`${API_BASE}/reports/dues`)
  if (!response.ok) {
    throw new Error('Failed to fetch due report')
  }
  return response.json()
}

export async function fetchFinancialSummary(
  academicYear: string
): Promise<{ data: FinancialSummary }> {
  const response = await fetch(`${API_BASE}/reports/summary?academicYear=${academicYear}`)
  if (!response.ok) {
    throw new Error('Failed to fetch financial summary')
  }
  return response.json()
}

export async function fetchFinanceStats(): Promise<{ data: FinanceStats }> {
  const response = await fetch(`${API_BASE}/stats`)
  if (!response.ok) {
    throw new Error('Failed to fetch finance stats')
  }
  return response.json()
}
