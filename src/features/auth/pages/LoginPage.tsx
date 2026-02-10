import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuthStore } from '@/stores/useAuthStore'
import type { Role } from '@/types/common.types'
import { demoStudent } from '@/mocks/data/students.data'
import { demoTeacher } from '@/mocks/data/staff.data'

// Staff accounts
const staffAccounts = [
  { role: 'admin' as Role, name: 'Admin User', email: 'admin@paperbook.in', label: 'Admin' },
  { role: 'principal' as Role, name: 'Dr. Sharma', email: 'principal@paperbook.in', label: 'Principal' },
  { role: 'teacher' as Role, name: demoTeacher.name, email: 'teacher@paperbook.in', label: 'Teacher', staffId: demoTeacher.id },
  { role: 'accountant' as Role, name: 'Rahul Accounts', email: 'accounts@paperbook.in', label: 'Accountant' },
  { role: 'librarian' as Role, name: 'Meera Librarian', email: 'librarian@paperbook.in', label: 'Librarian' },
  { role: 'transport_manager' as Role, name: 'Vijay Transport', email: 'transport@paperbook.in', label: 'Transport' },
]

// Student & Parent accounts - use real IDs from mock data
const userAccounts = [
  { role: 'student' as Role, name: demoStudent.name, email: 'student@paperbook.in', label: 'Student', studentId: demoStudent.id, class: demoStudent.class, section: demoStudent.section },
  { role: 'parent' as Role, name: demoStudent.parent.fatherName, email: 'parent@paperbook.in', label: 'Parent', childIds: [demoStudent.id] },
]

const demoAccounts = [...staffAccounts, ...userAccounts]

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuthStore()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Find demo account or create default admin
    const account = demoAccounts.find((a) => a.email === email) || demoAccounts[0]

    // Build user object with role-specific data
    const userData: any = {
      id: account.role === 'student'
        ? (account as typeof userAccounts[0]).studentId
        : account.role === 'parent'
          ? 'PAR001'
          : (account as any).staffId || crypto.randomUUID(),
      name: account.name,
      email: account.email,
      role: account.role,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${account.name}`,
    }

    // Add student-specific data
    if (account.role === 'student' && 'studentId' in account) {
      const studentAccount = account as typeof userAccounts[0]
      userData.studentId = studentAccount.studentId
      userData.class = studentAccount.class
      userData.section = studentAccount.section
    }

    // Add parent-specific data
    if (account.role === 'parent' && 'childIds' in account) {
      const parentAccount = account as typeof userAccounts[1]
      userData.childIds = parentAccount.childIds
    }

    // Add teacher-specific data
    if (account.role === 'teacher' && 'staffId' in account) {
      userData.staffId = (account as any).staffId
    }

    login(userData)

    setIsLoading(false)
    navigate('/')
  }

  const handleDemoLogin = (account: (typeof demoAccounts)[0]) => {
    setEmail(account.email)
    setPassword('demo123')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center">
          <img src="/logo.svg" alt="PaperBook" className="h-16 w-16 mx-auto mb-4" />
          <h1 className="text-3xl font-bold">PaperBook</h1>
          <p className="text-muted-foreground mt-1">School Management System</p>
        </div>

        {/* Login Card */}
        <Card>
          <CardHeader>
            <CardTitle>Welcome back</CardTitle>
            <CardDescription>Sign in to your account to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@paperbook.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>

            {/* Demo Accounts */}
            <div className="mt-6 pt-6 border-t">
              <p className="text-sm text-muted-foreground text-center mb-3">
                Quick demo login
              </p>

              {/* Staff Accounts */}
              <p className="text-xs text-muted-foreground mb-2">Staff</p>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {staffAccounts.map((account) => (
                  <Button
                    key={account.role}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => handleDemoLogin(account)}
                  >
                    {account.label}
                  </Button>
                ))}
              </div>

              {/* Student & Parent Accounts */}
              <p className="text-xs text-muted-foreground mb-2">Student / Parent</p>
              <div className="grid grid-cols-2 gap-2">
                {userAccounts.map((account) => (
                  <Button
                    key={account.role}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => handleDemoLogin(account)}
                  >
                    {account.label}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground">
          Demo mode - No real authentication required
        </p>
      </div>
    </div>
  )
}
