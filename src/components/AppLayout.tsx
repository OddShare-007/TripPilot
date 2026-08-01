import { useState, useEffect, type ReactNode } from 'react'
import TopNav from './TopNav'
import Sidebar from './Sidebar'

interface AppLayoutProps {
  children: ReactNode
  title: string
  subtitle?: string
  headerExtra?: ReactNode
}

export default function AppLayout({ children, title, subtitle, headerExtra }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth >= 1024)

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true)
      } else {
        setSidebarOpen(false)
      }
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return (
    <div className="flex min-h-screen flex-col bg-surface-muted dark:bg-brand-950">
      <TopNav
        showAppControls
        onMenuClick={() => setSidebarOpen((o) => !o)}
        sidebarOpen={sidebarOpen}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="flex flex-1 flex-col overflow-auto">
          <div className="flex h-14 items-center justify-between border-b border-surface-border bg-surface px-4 sm:px-6 dark:border-brand-800 dark:bg-brand-900">
            <div>
              <h1 className="text-base font-semibold text-brand-950 dark:text-brand-50">{title}</h1>
              {subtitle && (
                <p className="text-xs text-brand-500 dark:text-brand-400">{subtitle}</p>
              )}
            </div>
            {headerExtra}
          </div>

          <main className="flex-1 p-4 sm:p-6">{children}</main>
        </div>
      </div>
    </div>
  )
}
