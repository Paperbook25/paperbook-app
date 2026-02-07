import { useState } from 'react'
import { Plus, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/layout/PageHeader'

// Import all finance components
import { FinanceStats } from '../components/FinanceStats'
import { FeeTypeList } from '../components/FeeTypeList'
import { FeeStructureTable } from '../components/FeeStructureTable'
import { PaymentCollectionForm } from '../components/PaymentCollectionForm'
import { RecentPaymentsTable } from '../components/RecentPaymentsTable'
import { OutstandingDuesTable } from '../components/OutstandingDuesTable'
import { ExpenseList } from '../components/ExpenseList'
import { LedgerTable } from '../components/LedgerTable'
import { BalanceSummaryCard } from '../components/BalanceSummaryCard'
import { CollectionReportView } from '../components/CollectionReportView'
import { DueReportView } from '../components/DueReportView'

export function FinancePage() {
  const [activeTab, setActiveTab] = useState('collection')

  return (
    <div className="space-y-6">
      <PageHeader
        title="Finance"
        description="Manage fees, payments, expenses, and financial reports"
        breadcrumbs={[{ label: 'Dashboard', href: '/' }, { label: 'Finance' }]}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        }
      />

      {/* Stats Overview */}
      <FinanceStats />

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
          <TabsTrigger value="collection">Collection</TabsTrigger>
          <TabsTrigger value="outstanding">Outstanding</TabsTrigger>
          <TabsTrigger value="fee-management">Fee Setup</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="ledger">Ledger</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        {/* Fee Collection Tab */}
        <TabsContent value="collection" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <PaymentCollectionForm />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Recent Payments</h3>
            <RecentPaymentsTable />
          </div>
        </TabsContent>

        {/* Outstanding Dues Tab */}
        <TabsContent value="outstanding" className="space-y-4">
          <OutstandingDuesTable />
        </TabsContent>

        {/* Fee Management Tab */}
        <TabsContent value="fee-management" className="space-y-6">
          <Tabs defaultValue="types" className="space-y-4">
            <TabsList>
              <TabsTrigger value="types">Fee Types</TabsTrigger>
              <TabsTrigger value="structures">Fee Structures</TabsTrigger>
            </TabsList>
            <TabsContent value="types">
              <FeeTypeList />
            </TabsContent>
            <TabsContent value="structures">
              <FeeStructureTable />
            </TabsContent>
          </Tabs>
        </TabsContent>

        {/* Expenses Tab */}
        <TabsContent value="expenses" className="space-y-4">
          <ExpenseList />
        </TabsContent>

        {/* Ledger Tab */}
        <TabsContent value="ledger" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-4">
            <div className="lg:col-span-1">
              <BalanceSummaryCard />
            </div>
            <div className="lg:col-span-3">
              <LedgerTable />
            </div>
          </div>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-6">
          <Tabs defaultValue="collection-report" className="space-y-4">
            <TabsList>
              <TabsTrigger value="collection-report">Collection Report</TabsTrigger>
              <TabsTrigger value="due-report">Outstanding Report</TabsTrigger>
            </TabsList>
            <TabsContent value="collection-report">
              <CollectionReportView />
            </TabsContent>
            <TabsContent value="due-report">
              <DueReportView />
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>
    </div>
  )
}
