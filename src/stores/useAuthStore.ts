import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, Role } from '@/types/common.types'

const rolePermissions: Record<Role, string[]> = {
  admin: ['*'],
  principal: ['dashboard', 'students', 'staff', 'attendance', 'admissions', 'library', 'transport', 'finance', 'settings'],
  teacher: ['dashboard', 'students.view', 'attendance', 'library.view'],
  accountant: ['dashboard', 'finance', 'students.view'],
  librarian: ['dashboard', 'library', 'students.view'],
  transport_manager: ['dashboard', 'transport', 'students.view'],
  student: ['dashboard.student', 'library.view', 'attendance.view'],
  parent: ['dashboard.parent', 'attendance.view', 'finance.view', 'transport.view'],
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (user: User) => void
  logout: () => void
  hasPermission: (permission: string) => boolean
  hasRole: (roles: Role[]) => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      login: (user) => set({ user, isAuthenticated: true }),

      logout: () => set({ user: null, isAuthenticated: false }),

      hasPermission: (permission) => {
        const { user } = get()
        if (!user) return false
        const permissions = rolePermissions[user.role]
        return permissions.includes('*') || permissions.includes(permission)
      },

      hasRole: (roles) => {
        const { user } = get()
        if (!user) return false
        return roles.includes(user.role)
      },
    }),
    {
      name: 'paperbook-auth',
    }
  )
)
