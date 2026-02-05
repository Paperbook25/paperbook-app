// ==================== FEE TYPE ENUMS ====================

export type FeeCategory =
  | 'tuition'
  | 'development'
  | 'lab'
  | 'library'
  | 'sports'
  | 'computer'
  | 'transport'
  | 'examination'
  | 'other'

export type FeeFrequency = 'monthly' | 'quarterly' | 'half_yearly' | 'annual' | 'one_time'

export type PaymentMode = 'cash' | 'upi' | 'bank_transfer' | 'cheque' | 'dd' | 'online'

export type PaymentStatus = 'pending' | 'partial' | 'paid' | 'overdue' | 'waived'

export type ExpenseCategory =
  | 'salary'
  | 'utilities'
  | 'maintenance'
  | 'supplies'
  | 'infrastructure'
  | 'events'
  | 'other'

export type ExpenseStatus = 'pending_approval' | 'approved' | 'rejected' | 'paid'

export type LedgerEntryType = 'credit' | 'debit'

// ==================== FEE TYPE ====================

export interface FeeType {
  id: string
  name: string
  category: FeeCategory
  description?: string
  isActive: boolean
  createdAt: string
}

export interface CreateFeeTypeRequest {
  name: string
  category: FeeCategory
  description?: string
}

export interface UpdateFeeTypeRequest extends Partial<CreateFeeTypeRequest> {
  isActive?: boolean
}

// ==================== FEE STRUCTURE ====================

export interface FeeStructure {
  id: string
  feeTypeId: string
  feeTypeName: string
  academicYear: string
  applicableClasses: string[]
  amount: number
  frequency: FeeFrequency
  dueDay: number // Day of month when fee is due
  isOptional: boolean
  isActive: boolean
  createdAt: string
}

export interface CreateFeeStructureRequest {
  feeTypeId: string
  academicYear: string
  applicableClasses: string[]
  amount: number
  frequency: FeeFrequency
  dueDay?: number
  isOptional?: boolean
}

export interface UpdateFeeStructureRequest extends Partial<CreateFeeStructureRequest> {
  isActive?: boolean
}

export interface FeeStructureFilters {
  academicYear?: string
  feeTypeId?: string
  className?: string
  isActive?: boolean
}

// ==================== STUDENT FEE ====================

export interface StudentFee {
  id: string
  studentId: string
  studentName: string
  studentClass: string
  studentSection: string
  admissionNumber: string
  feeStructureId: string
  feeTypeId: string
  feeTypeName: string
  academicYear: string
  totalAmount: number
  paidAmount: number
  discountAmount: number
  dueDate: string
  status: PaymentStatus
  createdAt: string
}

export interface StudentFeeFilters {
  studentId?: string
  academicYear?: string
  feeTypeId?: string
  className?: string
  section?: string
  status?: PaymentStatus | 'all'
  search?: string
  page?: number
  limit?: number
}

// ==================== PAYMENT ====================

export interface Payment {
  id: string
  receiptNumber: string
  studentId: string
  studentName: string
  studentClass: string
  studentSection: string
  admissionNumber: string
  studentFeeId: string
  feeTypeName: string
  amount: number
  paymentMode: PaymentMode
  transactionRef?: string
  remarks?: string
  collectedBy: string
  collectedAt: string
}

export interface CollectPaymentRequest {
  studentId: string
  payments: {
    studentFeeId: string
    amount: number
  }[]
  paymentMode: PaymentMode
  transactionRef?: string
  remarks?: string
}

export interface PaymentFilters {
  studentId?: string
  dateFrom?: string
  dateTo?: string
  paymentMode?: PaymentMode | 'all'
  search?: string
  page?: number
  limit?: number
}

// ==================== RECEIPT ====================

export interface Receipt {
  id: string
  receiptNumber: string
  studentId: string
  studentName: string
  studentClass: string
  studentSection: string
  admissionNumber: string
  payments: {
    feeTypeName: string
    amount: number
  }[]
  totalAmount: number
  paymentMode: PaymentMode
  transactionRef?: string
  remarks?: string
  generatedBy: string
  generatedAt: string
}

// ==================== OUTSTANDING DUES ====================

export interface OutstandingDue {
  id: string
  studentId: string
  studentName: string
  studentClass: string
  studentSection: string
  admissionNumber: string
  parentPhone: string
  parentEmail: string
  totalDue: number
  daysOverdue: number
  oldestDueDate: string
  feeBreakdown: {
    feeTypeName: string
    amount: number
    dueDate: string
  }[]
  lastReminderSentAt?: string
}

export interface OutstandingFilters {
  className?: string
  section?: string
  minDaysOverdue?: number
  search?: string
  page?: number
  limit?: number
}

export interface SendReminderRequest {
  studentIds: string[]
  method: 'sms' | 'email' | 'both'
  message?: string
}

// ==================== EXPENSE ====================

export interface Expense {
  id: string
  expenseNumber: string
  category: ExpenseCategory
  description: string
  amount: number
  vendorName?: string
  invoiceNumber?: string
  invoiceDate?: string
  status: ExpenseStatus
  requestedBy: string
  requestedAt: string
  approvedBy?: string
  approvedAt?: string
  rejectedBy?: string
  rejectedAt?: string
  rejectionReason?: string
  paidAt?: string
  paidBy?: string
  paymentRef?: string
}

export interface CreateExpenseRequest {
  category: ExpenseCategory
  description: string
  amount: number
  vendorName?: string
  invoiceNumber?: string
  invoiceDate?: string
}

export interface UpdateExpenseRequest extends Partial<CreateExpenseRequest> {}

export interface ExpenseFilters {
  category?: ExpenseCategory | 'all'
  status?: ExpenseStatus | 'all'
  dateFrom?: string
  dateTo?: string
  search?: string
  page?: number
  limit?: number
}

export interface ApproveExpenseRequest {
  remarks?: string
}

export interface RejectExpenseRequest {
  reason: string
}

export interface MarkExpensePaidRequest {
  paymentRef?: string
}

// ==================== LEDGER ====================

export interface LedgerEntry {
  id: string
  date: string
  type: LedgerEntryType
  category: string
  referenceId: string
  referenceNumber: string
  description: string
  amount: number
  balance: number
}

export interface LedgerFilters {
  type?: LedgerEntryType | 'all'
  dateFrom?: string
  dateTo?: string
  page?: number
  limit?: number
}

export interface LedgerBalance {
  openingBalance: number
  totalCredits: number
  totalDebits: number
  closingBalance: number
  asOfDate: string
}

// ==================== REPORTS ====================

export interface CollectionReport {
  dateRange: { from: string; to: string }
  totalCollected: number
  byPaymentMode: Record<PaymentMode, number>
  byFeeType: { feeTypeName: string; amount: number }[]
  byClass: { className: string; amount: number }[]
  dailyCollections: { date: string; amount: number }[]
}

export interface DueReport {
  totalOutstanding: number
  totalStudentsWithDues: number
  byClass: { className: string; amount: number; count: number }[]
  byAgeingBucket: { bucket: string; amount: number; count: number }[]
  topDefaulters: OutstandingDue[]
}

export interface FinancialSummary {
  academicYear: string
  totalFeeExpected: number
  totalCollected: number
  totalPending: number
  totalExpenses: number
  netBalance: number
  collectionRate: number
  monthlyTrend: { month: string; collected: number; expenses: number }[]
}

// ==================== STATS ====================

export interface FinanceStats {
  totalCollected: number
  totalPending: number
  thisMonthCollection: number
  collectionRate: number
  pendingExpenseApprovals: number
  overdueStudentsCount: number
}

// ==================== CONSTANTS ====================

export const FEE_CATEGORIES: FeeCategory[] = [
  'tuition',
  'development',
  'lab',
  'library',
  'sports',
  'computer',
  'transport',
  'examination',
  'other',
]

export const FEE_CATEGORY_LABELS: Record<FeeCategory, string> = {
  tuition: 'Tuition Fee',
  development: 'Development Fee',
  lab: 'Lab Fee',
  library: 'Library Fee',
  sports: 'Sports Fee',
  computer: 'Computer Fee',
  transport: 'Transport Fee',
  examination: 'Examination Fee',
  other: 'Other',
}

export const FEE_FREQUENCIES: FeeFrequency[] = [
  'monthly',
  'quarterly',
  'half_yearly',
  'annual',
  'one_time',
]

export const FEE_FREQUENCY_LABELS: Record<FeeFrequency, string> = {
  monthly: 'Monthly',
  quarterly: 'Quarterly',
  half_yearly: 'Half Yearly',
  annual: 'Annual',
  one_time: 'One Time',
}

export const PAYMENT_MODES: PaymentMode[] = [
  'cash',
  'upi',
  'bank_transfer',
  'cheque',
  'dd',
  'online',
]

export const PAYMENT_MODE_LABELS: Record<PaymentMode, string> = {
  cash: 'Cash',
  upi: 'UPI',
  bank_transfer: 'Bank Transfer',
  cheque: 'Cheque',
  dd: 'Demand Draft',
  online: 'Online',
}

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  pending: 'Pending',
  partial: 'Partial',
  paid: 'Paid',
  overdue: 'Overdue',
  waived: 'Waived',
}

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  'salary',
  'utilities',
  'maintenance',
  'supplies',
  'infrastructure',
  'events',
  'other',
]

export const EXPENSE_CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  salary: 'Salary',
  utilities: 'Utilities',
  maintenance: 'Maintenance',
  supplies: 'Supplies',
  infrastructure: 'Infrastructure',
  events: 'Events',
  other: 'Other',
}

export const EXPENSE_STATUS_LABELS: Record<ExpenseStatus, string> = {
  pending_approval: 'Pending Approval',
  approved: 'Approved',
  rejected: 'Rejected',
  paid: 'Paid',
}

// ==================== INSTALLMENT PLANS / EMI ====================

export interface InstallmentPlan {
  id: string
  name: string
  feeStructureId: string
  feeTypeName: string
  totalAmount: number
  numberOfInstallments: number
  installments: Installment[]
  isActive: boolean
  academicYear: string
  applicableClasses: string[]
  createdAt: string
}

export interface Installment {
  id: string
  installmentNumber: number
  amount: number
  dueDate: string
  status: PaymentStatus
  paidAmount: number
  paidDate?: string
}

export interface CreateInstallmentPlanRequest {
  feeStructureId: string
  name: string
  numberOfInstallments: number
  installmentDates: string[]
}

// ==================== DISCOUNT & SCHOLARSHIP RULES ====================

export type DiscountType = 'percentage' | 'fixed_amount'
export type DiscountApplicability = 'sibling' | 'scholarship' | 'merit' | 'staff_ward' | 'early_bird' | 'custom'

export interface DiscountRule {
  id: string
  name: string
  type: DiscountType
  value: number
  applicability: DiscountApplicability
  applicableFeeTypes: string[]
  applicableClasses: string[]
  maxDiscount?: number
  minPercentage?: number
  isActive: boolean
  academicYear: string
  description?: string
  createdAt: string
}

export interface CreateDiscountRuleRequest {
  name: string
  type: DiscountType
  value: number
  applicability: DiscountApplicability
  applicableFeeTypes: string[]
  applicableClasses: string[]
  maxDiscount?: number
  minPercentage?: number
  description?: string
}

export interface AppliedDiscount {
  id: string
  studentId: string
  studentName: string
  studentClass: string
  discountRuleId: string
  discountRuleName: string
  feeTypeName: string
  originalAmount: number
  discountAmount: number
  finalAmount: number
  appliedAt: string
  appliedBy: string
}

// ==================== FEE CONCESSION WORKFLOW ====================

export type ConcessionStatus = 'pending' | 'approved' | 'rejected' | 'expired'

export interface ConcessionRequest {
  id: string
  studentId: string
  studentName: string
  studentClass: string
  section: string
  admissionNumber: string
  parentName: string
  feeTypes: string[]
  concessionType: DiscountType
  concessionValue: number
  reason: string
  supportingDocuments?: string[]
  status: ConcessionStatus
  requestedBy: string
  requestedAt: string
  approvedBy?: string
  approvedAt?: string
  rejectedBy?: string
  rejectedAt?: string
  rejectionReason?: string
  validFrom: string
  validTo: string
  totalConcessionAmount: number
}

export interface CreateConcessionRequest {
  studentId: string
  feeTypes: string[]
  concessionType: DiscountType
  concessionValue: number
  reason: string
  validFrom: string
  validTo: string
}

export interface UpdateConcessionRequest {
  status: ConcessionStatus
  rejectionReason?: string
}

// ==================== AUTO-REMINDER ESCALATION ====================

export type ReminderChannel = 'sms' | 'email' | 'whatsapp'

export interface ReminderEscalationRule {
  id: string
  name: string
  daysAfterDue: number
  channel: ReminderChannel
  recipient: 'parent' | 'student' | 'principal'
  messageTemplate: string
  isActive: boolean
}

export interface ReminderEscalationConfig {
  enabled: boolean
  rules: ReminderEscalationRule[]
}

export interface ReminderLog {
  id: string
  studentId: string
  studentName: string
  studentClass: string
  channel: ReminderChannel
  recipient: string
  message: string
  escalationLevel: number
  daysOverdue: number
  sentAt: string
  status: 'sent' | 'delivered' | 'failed'
  amount: number
}

export interface UpdateEscalationConfigRequest {
  enabled: boolean
  rules: Omit<ReminderEscalationRule, 'id'>[]
}

// ==================== ONLINE PAYMENT PORTAL ====================

export interface OnlinePaymentConfig {
  gateway: 'razorpay' | 'paytm' | 'stripe' | 'none'
  isEnabled: boolean
  testMode: boolean
  merchantId?: string
  apiKey?: string
}

export interface OnlinePaymentOrder {
  id: string
  orderId: string
  studentId: string
  studentName: string
  amount: number
  feeIds: string[]
  gateway: string
  status: 'created' | 'processing' | 'completed' | 'failed'
  paymentLink?: string
  transactionId?: string
  createdAt: string
  completedAt?: string
}

export interface CreatePaymentOrderRequest {
  studentId: string
  feeIds: string[]
  gateway: string
}

// ==================== PARENT FINANCIAL DASHBOARD ====================

export interface ParentFeeDashboard {
  children: ChildFeeOverview[]
  totalPending: number
  totalPaid: number
  upcomingDues: UpcomingDue[]
  recentPayments: Payment[]
  downloadableReceipts: ReceiptSummary[]
}

export interface ChildFeeOverview {
  studentId: string
  studentName: string
  className: string
  section: string
  totalFees: number
  paidAmount: number
  pendingAmount: number
  discountAmount: number
  paymentPercentage: number
  fees: StudentFee[]
}

export interface UpcomingDue {
  feeTypeName: string
  studentName: string
  amount: number
  dueDate: string
  daysUntilDue: number
}

export interface ReceiptSummary {
  receiptNumber: string
  date: string
  amount: number
  studentName: string
}

// ==================== CONSTANTS ====================

export const DISCOUNT_TYPE_LABELS: Record<DiscountType, string> = {
  percentage: 'Percentage',
  fixed_amount: 'Fixed Amount',
}

export const DISCOUNT_APPLICABILITY_LABELS: Record<DiscountApplicability, string> = {
  sibling: 'Sibling Discount',
  scholarship: 'Scholarship',
  merit: 'Merit Based',
  staff_ward: 'Staff Ward',
  early_bird: 'Early Bird',
  custom: 'Custom',
}

export const CONCESSION_STATUS_LABELS: Record<ConcessionStatus, string> = {
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
  expired: 'Expired',
}

export const REMINDER_CHANNEL_LABELS: Record<ReminderChannel, string> = {
  sms: 'SMS',
  email: 'Email',
  whatsapp: 'WhatsApp',
}

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

export const FEES_PER_PAGE = 10
export const PAYMENTS_PER_PAGE = 10
export const EXPENSES_PER_PAGE = 10
export const LEDGER_PER_PAGE = 20
