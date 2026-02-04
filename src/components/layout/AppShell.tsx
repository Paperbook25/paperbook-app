import { ReactNode, useEffect } from 'react'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { CommandPalette } from './CommandPalette'
import { useUIStore } from '@/stores/useUIStore'
import { cn } from '@/lib/utils'
import { TooltipProvider } from '@/components/ui/tooltip'

interface AppShellProps {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const { sidebarCollapsed, theme } = useUIStore()

  // Apply theme on mount and change
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else if (theme === 'light') {
      document.documentElement.classList.remove('dark')
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      document.documentElement.classList.toggle('dark', prefersDark)
    }
  }, [theme])

  // Register keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        useUIStore.getState().openCommandPalette()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        {/* Sidebar - hidden on mobile */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        {/* Main content area */}
        <div
          className={cn(
            'flex flex-col transition-all duration-300',
            sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
          )}
        >
          <Header />
          <main className="flex-1 p-4 lg:p-6">{children}</main>
        </div>

        {/* Command Palette */}
        <CommandPalette />
      </div>
    </TooltipProvider>
  )
}
