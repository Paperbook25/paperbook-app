import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Theme = 'light' | 'dark' | 'system'

interface UIState {
  sidebarCollapsed: boolean
  sidebarMobileOpen: boolean
  theme: Theme
  commandPaletteOpen: boolean

  toggleSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void
  setSidebarMobileOpen: (open: boolean) => void
  setTheme: (theme: Theme) => void
  openCommandPalette: () => void
  closeCommandPalette: () => void
  toggleCommandPalette: () => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      sidebarMobileOpen: false,
      theme: 'light',
      commandPaletteOpen: false,

      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      setSidebarMobileOpen: (open) => set({ sidebarMobileOpen: open }),
      setTheme: (theme) => {
        if (theme === 'dark') {
          document.documentElement.classList.add('dark')
        } else if (theme === 'light') {
          document.documentElement.classList.remove('dark')
        } else {
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
          document.documentElement.classList.toggle('dark', prefersDark)
        }
        set({ theme })
      },
      openCommandPalette: () => set({ commandPaletteOpen: true }),
      closeCommandPalette: () => set({ commandPaletteOpen: false }),
      toggleCommandPalette: () => set((state) => ({ commandPaletteOpen: !state.commandPaletteOpen })),
    }),
    {
      name: 'paperbook-ui',
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        theme: state.theme,
      }),
    }
  )
)
