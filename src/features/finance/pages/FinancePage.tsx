import { useState } from 'react'
import { Plus, Search, IndianRupee, TrendingUp, AlertCircle, Receipt, FileText, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { PageHeader } from '@/components/layout/PageHeader'
import { cn, formatCurrency, formatDate } from '@/lib/utils'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const feeStructure = [
  { id: 'f1', name: 'Tuition Fee', amount: 50000, frequency: 'Annual', applicable: 'All Classes' },
  { id: 'f2', name: 'Development Fee', amount: 10000, frequency: 'Annual', applicable: 'All Classes' },
  { id: 'f3', name: 'Lab Fee', amount: 5000, frequency: 'Annual', applicable: 'Class 9-12' },
  { id: 'f4', name: 'Library Fee', amount: 2000, frequency: 'Annual', applicable: 'All Classes' },
  { id: 'f5', name: 'Sports Fee', amount: 3000, frequency: 'Annual', applicable: 'All Classes' },
  { id: 'f6', name: 'Computer Fee', amount: 5000, frequency: 'Annual', applicable: 'Class 3-12' },
  { id: 'f7', name: 'Transport Fee', amount: 15000, frequency: 'Annual', applicable: 'Optional' },
]

const recentPayments = Array.from({ length: 10 }, (_, i) => ({
  id: `pay-${i + 1}`,
  studentName: `Student ${i + 1}`,
  class: `Class ${Math.floor(Math.random() * 12) + 1}`,
  amount: Math.floor(Math.random() * 30000) + 10000,
  type: ['Tuition Fee', 'Transport Fee', 'Lab Fee'][Math.floor(Math.random() * 3)],
  date: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
  mode: ['Cash', 'UPI', 'Bank Transfer', 'Cheque'][Math.floor(Math.random() * 4)],
  receiptNo: `RCP${Date.now()}${i}`,
}))

const pendingFees = Array.from({ length: 8 }, (_, i) => ({
  id: `pending-${i + 1}`,
  studentName: `Student ${i + 10}`,
  class: `Class ${Math.floor(Math.random() * 12) + 1}`,
  totalDue: Math.floor(Math.random() * 50000) + 20000,
  dueDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
  lastReminder: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
}))

const monthlyData = [
  { month: 'Apr', collected: 450000, target: 500000 },
  { month: 'May', collected: 520000, target: 500000 },
  { month: 'Jun', collected: 380000, target: 500000 },
  { month: 'Jul', collected: 620000, target: 600000 },
  { month: 'Aug', collected: 550000, target: 600000 },
  { month: 'Sep', collected: 480000, target: 500000 },
  { month: 'Oct', collected: 590000, target: 550000 },
  { month: 'Nov', collected: 510000, target: 500000 },
  { month: 'Dec', collected: 423000, target: 450000 },
]

export function FinancePage() {
  const [search, setSearch] = useState('')

  const stats = {
    totalCollected: 4523000,
    totalPending: 876000,
    thisMonth: 423000,
    collectionRate: 84,
  }

  return (
    <div>
      <PageHeader
        title="Finance"
        description="Manage fees, payments, and financial reports"
        breadcrumbs={[{ label: 'Dashboard', href: '/' }, { label: 'Finance' }]}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Collect Fee
            </Button>
          </div>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <IndianRupee className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{formatCurrency(stats.totalCollected)}</p>
                <p className="text-xs text-muted-foreground">Total Collected</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{formatCurrency(stats.totalPending)}</p>
                <p className="text-xs text-muted-foreground">Pending Fees</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{formatCurrency(stats.thisMonth)}</p>
                <p className="text-xs text-muted-foreground">This Month</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-2xl font-bold">{stats.collectionRate}%</p>
                <Badge variant="success">On Track</Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-1">Collection Rate</p>
              <Progress value={stats.collectionRate} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="collection" className="space-y-4">
        <TabsList>
          <TabsTrigger value="collection">Fee Collection</TabsTrigger>
          <TabsTrigger value="pending">Pending Fees</TabsTrigger>
          <TabsTrigger value="structure">Fee Structure</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="collection" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-3">
            {/* Collection Chart */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-base">Monthly Collection</CardTitle>
                <CardDescription>Fee collection vs target</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis className="text-xs" tickFormatter={(v) => `₹${v / 1000}k`} />
                    <Tooltip
                      formatter={(value: number) => formatCurrency(value)}
                      contentStyle={{
                        backgroundColor: 'var(--background)',
                        border: '1px solid var(--border)',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar dataKey="collected" fill="var(--color-chart-1)" name="Collected" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="target" fill="var(--color-chart-5)" name="Target" radius={[4, 4, 0, 0]} opacity={0.3} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Quick Collection */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Quick Collection</CardTitle>
                <CardDescription>Collect fee by student</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search student..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select fee type" />
                    </SelectTrigger>
                    <SelectContent>
                      {feeStructure.map((fee) => (
                        <SelectItem key={fee.id} value={fee.id}>
                          {fee.name} - {formatCurrency(fee.amount)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Payment mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="upi">UPI</SelectItem>
                      <SelectItem value="bank">Bank Transfer</SelectItem>
                      <SelectItem value="cheque">Cheque</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button className="w-full">
                    <Receipt className="h-4 w-4 mr-2" />
                    Collect & Generate Receipt
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Payments */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recent Payments</CardTitle>
              <CardDescription>Latest fee collections</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Receipt No.</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Fee Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Mode</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-mono text-xs">{payment.receiptNo}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{payment.studentName}</p>
                          <p className="text-xs text-muted-foreground">{payment.class}</p>
                        </div>
                      </TableCell>
                      <TableCell>{payment.type}</TableCell>
                      <TableCell className="font-medium text-green-600">
                        {formatCurrency(payment.amount)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{payment.mode}</Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatDate(payment.date, { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Pending Fee Collection</CardTitle>
              <CardDescription>Students with outstanding fees</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Total Due</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Last Reminder</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingFees.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{item.studentName}</p>
                          <p className="text-xs text-muted-foreground">{item.class}</p>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-red-600">
                        {formatCurrency(item.totalDue)}
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatDate(item.dueDate)}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(item.lastReminder)}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Send Reminder
                          </Button>
                          <Button size="sm">Collect</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="structure" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">Fee Structure</CardTitle>
                <CardDescription>Academic Year 2024-25</CardDescription>
              </div>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Fee Type
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fee Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Frequency</TableHead>
                    <TableHead>Applicable To</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {feeStructure.map((fee) => (
                    <TableRow key={fee.id}>
                      <TableCell className="font-medium">{fee.name}</TableCell>
                      <TableCell>{formatCurrency(fee.amount)}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{fee.frequency}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {fee.applicable}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Financial Reports</CardTitle>
              <CardDescription>Generate and download reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { title: 'Collection Report', desc: 'Daily/Monthly collection summary' },
                  { title: 'Pending Fees Report', desc: 'List of all pending fees' },
                  { title: 'Class-wise Report', desc: 'Fee status by class' },
                ].map((report) => (
                  <Card key={report.title}>
                    <CardContent className="p-4">
                      <FileText className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="font-medium">{report.title}</p>
                      <p className="text-xs text-muted-foreground mb-3">{report.desc}</p>
                      <Button variant="outline" size="sm" className="w-full">
                        <Download className="h-4 w-4 mr-2" />
                        Generate
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
