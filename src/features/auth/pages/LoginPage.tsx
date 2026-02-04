import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, GraduationCap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuthStore } from '@/stores/useAuthStore'
import type { Role } from '@/types/common.types'

const demoAccounts = [
  { role: 'admin' as Role, name: 'Admin User', email: 'admin@paperbook.in' },
  { role: 'principal' as Role, name: 'Dr. Sharma', email: 'principal@paperbook.in' },
  { role: 'teacher' as Role, name: 'Priya Teacher', email: 'teacher@paperbook.in' },
  { role: 'accountant' as Role, name: 'Rahul Accounts', email: 'accounts@paperbook.in' },
]

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

    login({
      id: '1',
      name: account.name,
      email: account.email,
      role: account.role,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${account.name}`,
    })

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
              <p className="text-sm text-muted-foreground text-center mb-4">
                Quick demo login
              </p>
              <div className="grid grid-cols-2 gap-2">
                {demoAccounts.map((account) => (
                  <Button
                    key={account.role}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => handleDemoLogin(account)}
                  >
                    {account.role.charAt(0).toUpperCase() + account.role.slice(1)}
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
