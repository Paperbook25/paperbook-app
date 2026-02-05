import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchMyFees,
  fetchMyChildrenFees,
  fetchMyPayments,
  fetchFeeTypes,
  createFeeType,
  updateFeeType,
  deleteFeeType,
  fetchFeeStructures,
  createFeeStructure,
  updateFeeStructure,
  deleteFeeStructure,
  fetchStudentFees,
  fetchStudentFeesById,
  fetchPayments,
  collectPayment,
  fetchReceipt,
  fetchOutstandingDues,
  fetchOutstandingSummary,
  sendReminders,
  fetchExpenses,
  fetchExpense,
  createExpense,
  updateExpense,
  approveExpense,
  rejectExpense,
  markExpensePaid,
  deleteExpense,
  fetchLedger,
  fetchLedgerBalance,
  fetchCollectionReport,
  fetchDueReport,
  fetchFinancialSummary,
  fetchFinanceStats,
} from '../api/finance.api'
import type {
  CreateFeeTypeRequest,
  UpdateFeeTypeRequest,
  FeeStructureFilters,
  CreateFeeStructureRequest,
  UpdateFeeStructureRequest,
  StudentFeeFilters,
  PaymentFilters,
  CollectPaymentRequest,
  OutstandingFilters,
  SendReminderRequest,
  ExpenseFilters,
  CreateExpenseRequest,
  UpdateExpenseRequest,
  ApproveExpenseRequest,
  RejectExpenseRequest,
  MarkExpensePaidRequest,
  LedgerFilters,
} from '../types/finance.types'

// ==================== QUERY KEYS ====================

export const financeKeys = {
  all: ['finance'] as const,

  // User-scoped
  myFees: () => [...financeKeys.all, 'my-fees'] as const,
  myChildrenFees: () => [...financeKeys.all, 'my-children-fees'] as const,
  myPayments: () => [...financeKeys.all, 'my-payments'] as const,

  // Fee Types
  feeTypes: () => [...financeKeys.all, 'fee-types'] as const,

  // Fee Structures
  feeStructures: () => [...financeKeys.all, 'fee-structures'] as const,
  feeStructuresList: (filters: FeeStructureFilters) =>
    [...financeKeys.feeStructures(), filters] as const,

  // Student Fees
  studentFees: () => [...financeKeys.all, 'student-fees'] as const,
  studentFeesList: (filters: StudentFeeFilters) =>
    [...financeKeys.studentFees(), filters] as const,
  studentFeesById: (studentId: string) =>
    [...financeKeys.studentFees(), 'student', studentId] as const,

  // Payments
  payments: () => [...financeKeys.all, 'payments'] as const,
  paymentsList: (filters: PaymentFilters) =>
    [...financeKeys.payments(), filters] as const,
  receipt: (receiptNumber: string) =>
    [...financeKeys.payments(), 'receipt', receiptNumber] as const,

  // Outstanding
  outstanding: () => [...financeKeys.all, 'outstanding'] as const,
  outstandingList: (filters: OutstandingFilters) =>
    [...financeKeys.outstanding(), filters] as const,
  outstandingSummary: () => [...financeKeys.outstanding(), 'summary'] as const,

  // Expenses
  expenses: () => [...financeKeys.all, 'expenses'] as const,
  expensesList: (filters: ExpenseFilters) =>
    [...financeKeys.expenses(), filters] as const,
  expense: (id: string) => [...financeKeys.expenses(), id] as const,

  // Ledger
  ledger: () => [...financeKeys.all, 'ledger'] as const,
  ledgerList: (filters: LedgerFilters) =>
    [...financeKeys.ledger(), filters] as const,
  ledgerBalance: () => [...financeKeys.ledger(), 'balance'] as const,

  // Reports
  reports: () => [...financeKeys.all, 'reports'] as const,
  collectionReport: (dateFrom: string, dateTo: string) =>
    [...financeKeys.reports(), 'collection', dateFrom, dateTo] as const,
  dueReport: () => [...financeKeys.reports(), 'dues'] as const,
  financialSummary: (academicYear: string) =>
    [...financeKeys.reports(), 'summary', academicYear] as const,

  // Stats
  stats: () => [...financeKeys.all, 'stats'] as const,
}

// ==================== USER-SCOPED HOOKS ====================

export function useMyFees() {
  return useQuery({
    queryKey: financeKeys.myFees(),
    queryFn: fetchMyFees,
  })
}

export function useMyChildrenFees() {
  return useQuery({
    queryKey: financeKeys.myChildrenFees(),
    queryFn: fetchMyChildrenFees,
  })
}

export function useMyPayments() {
  return useQuery({
    queryKey: financeKeys.myPayments(),
    queryFn: fetchMyPayments,
  })
}

// ==================== FEE TYPE HOOKS ====================

export function useFeeTypes() {
  return useQuery({
    queryKey: financeKeys.feeTypes(),
    queryFn: fetchFeeTypes,
  })
}

export function useCreateFeeType() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateFeeTypeRequest) => createFeeType(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: financeKeys.feeTypes() })
    },
  })
}

export function useUpdateFeeType() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateFeeTypeRequest }) =>
      updateFeeType(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: financeKeys.feeTypes() })
    },
  })
}

export function useDeleteFeeType() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteFeeType(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: financeKeys.feeTypes() })
    },
  })
}

// ==================== FEE STRUCTURE HOOKS ====================

export function useFeeStructures(filters: FeeStructureFilters = {}) {
  return useQuery({
    queryKey: financeKeys.feeStructuresList(filters),
    queryFn: () => fetchFeeStructures(filters),
  })
}

export function useCreateFeeStructure() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateFeeStructureRequest) => createFeeStructure(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: financeKeys.feeStructures() })
    },
  })
}

export function useUpdateFeeStructure() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateFeeStructureRequest }) =>
      updateFeeStructure(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: financeKeys.feeStructures() })
    },
  })
}

export function useDeleteFeeStructure() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteFeeStructure(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: financeKeys.feeStructures() })
    },
  })
}

// ==================== STUDENT FEE HOOKS ====================

export function useStudentFees(filters: StudentFeeFilters = {}) {
  return useQuery({
    queryKey: financeKeys.studentFeesList(filters),
    queryFn: () => fetchStudentFees(filters),
  })
}

export function useStudentFeesById(studentId: string) {
  return useQuery({
    queryKey: financeKeys.studentFeesById(studentId),
    queryFn: () => fetchStudentFeesById(studentId),
    enabled: !!studentId,
  })
}

// ==================== PAYMENT HOOKS ====================

export function usePayments(filters: PaymentFilters = {}) {
  return useQuery({
    queryKey: financeKeys.paymentsList(filters),
    queryFn: () => fetchPayments(filters),
  })
}

export function useCollectPayment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CollectPaymentRequest) => collectPayment(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: financeKeys.payments() })
      queryClient.invalidateQueries({ queryKey: financeKeys.studentFees() })
      // Also invalidate specific student fees query for immediate UI update
      if (variables.studentId) {
        queryClient.invalidateQueries({ queryKey: financeKeys.studentFeesById(variables.studentId) })
      }
      queryClient.invalidateQueries({ queryKey: financeKeys.outstanding() })
      queryClient.invalidateQueries({ queryKey: financeKeys.ledger() })
      queryClient.invalidateQueries({ queryKey: financeKeys.stats() })
    },
  })
}

export function useReceipt(receiptNumber: string) {
  return useQuery({
    queryKey: financeKeys.receipt(receiptNumber),
    queryFn: () => fetchReceipt(receiptNumber),
    enabled: !!receiptNumber,
  })
}

// ==================== OUTSTANDING HOOKS ====================

export function useOutstandingDues(filters: OutstandingFilters = {}) {
  return useQuery({
    queryKey: financeKeys.outstandingList(filters),
    queryFn: () => fetchOutstandingDues(filters),
  })
}

export function useOutstandingSummary() {
  return useQuery({
    queryKey: financeKeys.outstandingSummary(),
    queryFn: fetchOutstandingSummary,
  })
}

export function useSendReminders() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: SendReminderRequest) => sendReminders(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: financeKeys.outstanding() })
    },
  })
}

// ==================== EXPENSE HOOKS ====================

export function useExpenses(filters: ExpenseFilters = {}) {
  return useQuery({
    queryKey: financeKeys.expensesList(filters),
    queryFn: () => fetchExpenses(filters),
  })
}

export function useExpense(id: string) {
  return useQuery({
    queryKey: financeKeys.expense(id),
    queryFn: () => fetchExpense(id),
    enabled: !!id,
  })
}

export function useCreateExpense() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateExpenseRequest) => createExpense(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: financeKeys.expenses() })
      queryClient.invalidateQueries({ queryKey: financeKeys.stats() })
    },
  })
}

export function useUpdateExpense() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateExpenseRequest }) =>
      updateExpense(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: financeKeys.expense(variables.id) })
      queryClient.invalidateQueries({ queryKey: financeKeys.expenses() })
    },
  })
}

export function useApproveExpense() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data?: ApproveExpenseRequest }) =>
      approveExpense(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: financeKeys.expense(variables.id) })
      queryClient.invalidateQueries({ queryKey: financeKeys.expenses() })
      queryClient.invalidateQueries({ queryKey: financeKeys.stats() })
    },
  })
}

export function useRejectExpense() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: RejectExpenseRequest }) =>
      rejectExpense(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: financeKeys.expense(variables.id) })
      queryClient.invalidateQueries({ queryKey: financeKeys.expenses() })
      queryClient.invalidateQueries({ queryKey: financeKeys.stats() })
    },
  })
}

export function useMarkExpensePaid() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data?: MarkExpensePaidRequest }) =>
      markExpensePaid(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: financeKeys.expense(variables.id) })
      queryClient.invalidateQueries({ queryKey: financeKeys.expenses() })
      queryClient.invalidateQueries({ queryKey: financeKeys.ledger() })
      queryClient.invalidateQueries({ queryKey: financeKeys.stats() })
    },
  })
}

export function useDeleteExpense() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteExpense(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: financeKeys.expenses() })
      queryClient.invalidateQueries({ queryKey: financeKeys.stats() })
    },
  })
}

// ==================== LEDGER HOOKS ====================

export function useLedger(filters: LedgerFilters = {}) {
  return useQuery({
    queryKey: financeKeys.ledgerList(filters),
    queryFn: () => fetchLedger(filters),
  })
}

export function useLedgerBalance() {
  return useQuery({
    queryKey: financeKeys.ledgerBalance(),
    queryFn: fetchLedgerBalance,
  })
}

// ==================== REPORT HOOKS ====================

export function useCollectionReport(dateFrom: string, dateTo: string) {
  return useQuery({
    queryKey: financeKeys.collectionReport(dateFrom, dateTo),
    queryFn: () => fetchCollectionReport(dateFrom, dateTo),
    enabled: !!dateFrom && !!dateTo,
  })
}

export function useDueReport() {
  return useQuery({
    queryKey: financeKeys.dueReport(),
    queryFn: fetchDueReport,
  })
}

export function useFinancialSummary(academicYear: string) {
  return useQuery({
    queryKey: financeKeys.financialSummary(academicYear),
    queryFn: () => fetchFinancialSummary(academicYear),
    enabled: !!academicYear,
  })
}

export function useFinanceStats() {
  return useQuery({
    queryKey: financeKeys.stats(),
    queryFn: fetchFinanceStats,
  })
}
