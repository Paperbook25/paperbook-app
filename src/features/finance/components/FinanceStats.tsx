import { IndianRupee, AlertCircle, TrendingUp, Clock, FileWarning, Users } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { useFinanceStats } from '../hooks/useFinance'
import { formatCurrency } from '@/lib/utils'

export function FinanceStats() {
  const { data, isLoading, error } = useFinanceStats()

  if (error) {
    return null
  }

  const stats = data?.data

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!stats) return null

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {/* Total Collected */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-800 rounded-lg">
              <IndianRupee className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{formatCurrency(stats.totalCollected)}</p>
              <p className="text-xs text-muted-foreground">Total Collected</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pending Fees */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 dark:bg-red-800 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{formatCurrency(stats.totalPending)}</p>
              <p className="text-xs text-muted-foreground">Pending Fees</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* This Month Collection */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg">
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{formatCurrency(stats.thisMonthCollection)}</p>
              <p className="text-xs text-muted-foreground">This Month</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Collection Rate */}
      <Card>
        <CardContent className="p-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-2xl font-bold">{stats.collectionRate}%</p>
              <Badge variant={stats.collectionRate >= 80 ? 'success' : stats.collectionRate >= 60 ? 'warning' : 'destructive'}>
                {stats.collectionRate >= 80 ? 'On Track' : stats.collectionRate >= 60 ? 'Needs Attention' : 'Critical'}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mb-1">Collection Rate</p>
            <Progress value={stats.collectionRate} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Additional Stats Row */}
      <Card className="col-span-2 md:col-span-2">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-800 rounded-lg">
                <Clock className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-lg font-bold">{stats.pendingExpenseApprovals}</p>
                <p className="text-xs text-muted-foreground">Pending Expense Approvals</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-800 rounded-lg">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-lg font-bold">{stats.overdueStudentsCount}</p>
                <p className="text-xs text-muted-foreground">Students with Overdue Fees</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
