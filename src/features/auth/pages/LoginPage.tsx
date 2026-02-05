import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, GraduationCap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuthStore } from '@/stores/useAuthStore'
import type { Role } from '@/types/common.types'

// Staff accounts
const staffAccounts = [
  { role: 'admin' as Role, name: 'Admin User', email: 'admin@paperbook.in', label: 'Admin' },
  { role: 'principal' as Role, name: 'Dr. Sharma', email: 'principal@paperbook.in', label: 'Principal' },
  { role: 'teacher' as Role, name: 'Priya Teacher', email: 'teacher@paperbook.in', label: 'Teacher' },
  { role: 'accountant' as Role, name: 'Rahul Accounts', email: 'accounts@paperbook.in', label: 'Accountant' },
  { role: 'librarian' as Role, name: 'Meera Librarian', email: 'librarian@paperbook.in', label: 'Librarian' },
  { role: 'transport_manager' as Role, name: 'Vijay Transport', email: 'transport@paperbook.in', label: 'Transport' },
]

// Student & Parent accounts
const userAccounts = [
  { role: 'student' as Role, name: 'Rahul Kumar', email: 'student@paperbook.in', label: 'Student', studentId: 'STU001', class: 'Class 10', section: 'A' },
  { role: 'parent' as Role, name: 'Suresh Kumar', email: 'parent@paperbook.in', label: 'Parent', childIds: ['STU001'] },
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
      id: account.role === 'student' ? 'STU001' : account.role === 'parent' ? 'PAR001' : '1',
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
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary text-primary-foreground mb-4">
            <GraduationCap className="h-8 w-8" />
          </div>
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
