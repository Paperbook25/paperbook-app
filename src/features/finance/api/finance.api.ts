import { apiGet, apiPost, apiPut, apiPatch, apiDelete } from '@/lib/api-client'
import type { PaginatedResponse } from '@/types/common.types'
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
  InstallmentPlan,
  CreateInstallmentPlanRequest,
  DiscountRule,
  CreateDiscountRuleRequest,
  AppliedDiscount,
  ConcessionRequest,
  CreateConcessionRequest,
  ReminderEscalationConfig,
  UpdateEscalationConfigRequest,
  ReminderLog,
  OnlinePaymentConfig,
  OnlinePaymentOrder,
  CreatePaymentOrderRequest,
  ParentFeeDashboard,
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
  return apiGet<{ data: FeeType[] }>(`${API_BASE}/fee-types`)
}

export async function fetchFeeType(id: string): Promise<{ data: FeeType }> {
  return apiGet<{ data: FeeType }>(`${API_BASE}/fee-types/${id}`)
}

export async function createFeeType(data: CreateFeeTypeRequest): Promise<{ data: FeeType }> {
  return apiPost<{ data: FeeType }>(`${API_BASE}/fee-types`, data)
}

export async function updateFeeType(
  id: string,
  data: UpdateFeeTypeRequest
): Promise<{ data: FeeType }> {
  return apiPut<{ data: FeeType }>(`${API_BASE}/fee-types/${id}`, data)
}

export async function deleteFeeType(id: string): Promise<{ success: boolean }> {
  return apiDelete<{ success: boolean }>(`${API_BASE}/fee-types/${id}`)
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

  return apiGet<{ data: FeeStructure[] }>(`${API_BASE}/fee-structures?${params.toString()}`)
}

export async function createFeeStructure(
  data: CreateFeeStructureRequest
): Promise<{ data: FeeStructure }> {
  return apiPost<{ data: FeeStructure }>(`${API_BASE}/fee-structures`, data)
}

export async function updateFeeStructure(
  id: string,
  data: UpdateFeeStructureRequest
): Promise<{ data: FeeStructure }> {
  return apiPut<{ data: FeeStructure }>(`${API_BASE}/fee-structures/${id}`, data)
}

export async function deleteFeeStructure(id: string): Promise<{ success: boolean }> {
  return apiDelete<{ success: boolean }>(`${API_BASE}/fee-structures/${id}`)
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

  return apiGet<PaginatedResponse<StudentFee>>(`${API_BASE}/student-fees?${params.toString()}`)
}

export async function fetchStudentFeesById(studentId: string): Promise<{ data: StudentFee[] }> {
  return apiGet<{ data: StudentFee[] }>(`${API_BASE}/students/${studentId}/fees`)
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

  return apiGet<PaginatedResponse<Payment>>(`${API_BASE}/payments?${params.toString()}`)
}

export async function collectPayment(
  data: CollectPaymentRequest
): Promise<{ data: Receipt; payments: Payment[] }> {
  return apiPost<{ data: Receipt; payments: Payment[] }>(`${API_BASE}/payments/collect`, data)
}

export async function fetchReceipt(receiptNumber: string): Promise<{ data: Receipt }> {
  return apiGet<{ data: Receipt }>(`${API_BASE}/receipts/${receiptNumber}`)
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

  return apiGet<PaginatedResponse<OutstandingDue>>(`${API_BASE}/outstanding?${params.toString()}`)
}

export async function fetchOutstandingSummary(): Promise<{
  data: {
    totalOutstanding: number
    totalStudents: number
    averageOverdueDays: number
  }
}> {
  return apiGet<{
    data: {
      totalOutstanding: number
      totalStudents: number
      averageOverdueDays: number
    }
  }>(`${API_BASE}/outstanding/summary`)
}

export async function sendReminders(
  data: SendReminderRequest
): Promise<{ success: boolean; count: number }> {
  return apiPost<{ success: boolean; count: number }>(`${API_BASE}/reminders/send`, data)
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

  return apiGet<PaginatedResponse<Expense>>(`${API_BASE}/expenses?${params.toString()}`)
}

export async function fetchExpense(id: string): Promise<{ data: Expense }> {
  return apiGet<{ data: Expense }>(`${API_BASE}/expenses/${id}`)
}

export async function createExpense(data: CreateExpenseRequest): Promise<{ data: Expense }> {
  return apiPost<{ data: Expense }>(`${API_BASE}/expenses`, data)
}

export async function updateExpense(
  id: string,
  data: UpdateExpenseRequest
): Promise<{ data: Expense }> {
  return apiPut<{ data: Expense }>(`${API_BASE}/expenses/${id}`, data)
}

export async function approveExpense(
  id: string,
  data: ApproveExpenseRequest = {}
): Promise<{ data: Expense }> {
  return apiPatch<{ data: Expense }>(`${API_BASE}/expenses/${id}/approve`, data)
}

export async function rejectExpense(
  id: string,
  data: RejectExpenseRequest
): Promise<{ data: Expense }> {
  return apiPatch<{ data: Expense }>(`${API_BASE}/expenses/${id}/reject`, data)
}

export async function markExpensePaid(
  id: string,
  data: MarkExpensePaidRequest = {}
): Promise<{ data: Expense }> {
  return apiPatch<{ data: Expense }>(`${API_BASE}/expenses/${id}/mark-paid`, data)
}

export async function deleteExpense(id: string): Promise<{ success: boolean }> {
  return apiDelete<{ success: boolean }>(`${API_BASE}/expenses/${id}`)
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

  return apiGet<PaginatedResponse<LedgerEntry>>(`${API_BASE}/ledger?${params.toString()}`)
}

export async function fetchLedgerBalance(): Promise<{ data: LedgerBalance }> {
  return apiGet<{ data: LedgerBalance }>(`${API_BASE}/ledger/balance`)
}

// ==================== REPORTS ====================

export async function fetchCollectionReport(
  dateFrom: string,
  dateTo: string
): Promise<{ data: CollectionReport }> {
  const params = new URLSearchParams()
  params.set('dateFrom', dateFrom)
  params.set('dateTo', dateTo)

  return apiGet<{ data: CollectionReport }>(`${API_BASE}/reports/collection?${params.toString()}`)
}

export async function fetchDueReport(): Promise<{ data: DueReport }> {
  return apiGet<{ data: DueReport }>(`${API_BASE}/reports/dues`)
}

export async function fetchFinancialSummary(
  academicYear: string
): Promise<{ data: FinancialSummary }> {
  return apiGet<{ data: FinancialSummary }>(`${API_BASE}/reports/summary?academicYear=${academicYear}`)
}

export async function fetchFinanceStats(): Promise<{ data: FinanceStats }> {
  return apiGet<{ data: FinanceStats }>(`${API_BASE}/stats`)
}

// ==================== INSTALLMENT PLANS ====================

export async function fetchInstallmentPlans(
  academicYear?: string
): Promise<{ data: InstallmentPlan[] }> {
  const params = new URLSearchParams()
  if (academicYear) params.set('academicYear', academicYear)

  return apiGet<{ data: InstallmentPlan[] }>(`${API_BASE}/installment-plans?${params.toString()}`)
}

export async function fetchInstallmentPlan(id: string): Promise<{ data: InstallmentPlan }> {
  return apiGet<{ data: InstallmentPlan }>(`${API_BASE}/installment-plans/${id}`)
}

export async function createInstallmentPlan(
  data: CreateInstallmentPlanRequest
): Promise<{ data: InstallmentPlan }> {
  return apiPost<{ data: InstallmentPlan }>(`${API_BASE}/installment-plans`, data)
}

export async function toggleInstallmentPlan(id: string): Promise<{ data: InstallmentPlan }> {
  return apiPatch<{ data: InstallmentPlan }>(`${API_BASE}/installment-plans/${id}/toggle`)
}

export async function deleteInstallmentPlan(id: string): Promise<{ success: boolean }> {
  return apiDelete<{ success: boolean }>(`${API_BASE}/installment-plans/${id}`)
}

// ==================== DISCOUNT RULES ====================

export async function fetchDiscountRules(): Promise<{ data: DiscountRule[] }> {
  return apiGet<{ data: DiscountRule[] }>(`${API_BASE}/discount-rules`)
}

export async function createDiscountRule(
  data: CreateDiscountRuleRequest
): Promise<{ data: DiscountRule }> {
  return apiPost<{ data: DiscountRule }>(`${API_BASE}/discount-rules`, data)
}

export async function updateDiscountRule(
  id: string,
  data: Partial<CreateDiscountRuleRequest>
): Promise<{ data: DiscountRule }> {
  return apiPut<{ data: DiscountRule }>(`${API_BASE}/discount-rules/${id}`, data)
}

export async function toggleDiscountRule(id: string): Promise<{ data: DiscountRule }> {
  return apiPatch<{ data: DiscountRule }>(`${API_BASE}/discount-rules/${id}/toggle`)
}

export async function deleteDiscountRule(id: string): Promise<{ success: boolean }> {
  return apiDelete<{ success: boolean }>(`${API_BASE}/discount-rules/${id}`)
}

export async function fetchAppliedDiscounts(
  filters: { studentId?: string; ruleId?: string } = {}
): Promise<{ data: AppliedDiscount[] }> {
  const params = new URLSearchParams()
  if (filters.studentId) params.set('studentId', filters.studentId)
  if (filters.ruleId) params.set('ruleId', filters.ruleId)

  return apiGet<{ data: AppliedDiscount[] }>(`${API_BASE}/applied-discounts?${params.toString()}`)
}

// ==================== CONCESSION REQUESTS ====================

export async function fetchConcessionRequests(
  status?: string
): Promise<{ data: ConcessionRequest[] }> {
  const params = new URLSearchParams()
  if (status && status !== 'all') params.set('status', status)

  return apiGet<{ data: ConcessionRequest[] }>(`${API_BASE}/concessions?${params.toString()}`)
}

export async function createConcessionRequest(
  data: CreateConcessionRequest
): Promise<{ data: ConcessionRequest }> {
  return apiPost<{ data: ConcessionRequest }>(`${API_BASE}/concessions`, data)
}

export async function approveConcession(id: string): Promise<{ data: ConcessionRequest }> {
  return apiPatch<{ data: ConcessionRequest }>(`${API_BASE}/concessions/${id}/approve`)
}

export async function rejectConcession(
  id: string,
  reason: string
): Promise<{ data: ConcessionRequest }> {
  return apiPatch<{ data: ConcessionRequest }>(`${API_BASE}/concessions/${id}/reject`, { reason })
}

// ==================== ESCALATION CONFIG ====================

export async function fetchEscalationConfig(): Promise<{ data: ReminderEscalationConfig }> {
  return apiGet<{ data: ReminderEscalationConfig }>(`${API_BASE}/escalation-config`)
}

export async function updateEscalationConfig(
  data: UpdateEscalationConfigRequest
): Promise<{ data: ReminderEscalationConfig }> {
  return apiPut<{ data: ReminderEscalationConfig }>(`${API_BASE}/escalation-config`, data)
}

export async function fetchReminderLogs(
  filters: { channel?: string; status?: string; page?: number; limit?: number } = {}
): Promise<PaginatedResponse<ReminderLog>> {
  const params = new URLSearchParams()
  if (filters.channel && filters.channel !== 'all') params.set('channel', filters.channel)
  if (filters.status && filters.status !== 'all') params.set('status', filters.status)
  if (filters.page) params.set('page', String(filters.page))
  if (filters.limit) params.set('limit', String(filters.limit))

  return apiGet<PaginatedResponse<ReminderLog>>(`${API_BASE}/reminder-logs?${params.toString()}`)
}

// ==================== ONLINE PAYMENT ====================

export async function fetchOnlinePaymentConfig(): Promise<{ data: OnlinePaymentConfig }> {
  return apiGet<{ data: OnlinePaymentConfig }>(`${API_BASE}/online-payment/config`)
}

export async function updateOnlinePaymentConfig(
  data: Partial<OnlinePaymentConfig>
): Promise<{ data: OnlinePaymentConfig }> {
  return apiPut<{ data: OnlinePaymentConfig }>(`${API_BASE}/online-payment/config`, data)
}

export async function fetchOnlinePaymentOrders(
  filters: { status?: string; page?: number; limit?: number } = {}
): Promise<PaginatedResponse<OnlinePaymentOrder>> {
  const params = new URLSearchParams()
  if (filters.status && filters.status !== 'all') params.set('status', filters.status)
  if (filters.page) params.set('page', String(filters.page))
  if (filters.limit) params.set('limit', String(filters.limit))

  return apiGet<PaginatedResponse<OnlinePaymentOrder>>(`${API_BASE}/online-payment/orders?${params.toString()}`)
}

export async function createPaymentOrder(
  data: CreatePaymentOrderRequest
): Promise<{ data: OnlinePaymentOrder }> {
  return apiPost<{ data: OnlinePaymentOrder }>(`${API_BASE}/online-payment/orders`, data)
}

// ==================== PARENT DASHBOARD ====================

export async function fetchParentFeeDashboard(): Promise<{ data: ParentFeeDashboard }> {
  return apiGet<{ data: ParentFeeDashboard }>(`${API_BASE}/parent-dashboard`)
}
