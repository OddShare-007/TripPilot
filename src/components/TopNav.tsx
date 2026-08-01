import { Link, useNavigate } from 'react-router-dom'
import { Plane, Sun, Moon, Menu, X, LogOut, Settings } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'
import DemoBanner from './DemoBanner'

interface TopNavProps {
  showAuthLinks?: boolean
  showAppControls?: boolean
  onMenuClick?: () => void
  sidebarOpen?: boolean
}

export default function TopNav({
  showAuthLinks = false,
  showAppControls = false,
  onMenuClick,
  sidebarOpen = false,
}: TopNavProps) {
  const { theme, toggleTheme } = useTheme()
  const { signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/login', { replace: true })
  }

  return (
    <>
      <header className="border-b border-surface-border bg-surface dark:border-brand-800 dark:bg-brand-900">
        <div className="flex h-14 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            {showAppControls && onMenuClick && (
              <button
                type="button"
                onClick={onMenuClick}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-brand-600 transition-colors hover:bg-brand-50 dark:text-brand-300 dark:hover:bg-brand-800"
                aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
              >
                <span className="relative flex h-5 w-5 items-center justify-center">
                  <Menu
                    className={`absolute h-5 w-5 transition-all duration-300 ${
                      sidebarOpen ? 'rotate-180 opacity-0' : 'rotate-0 opacity-100'
                    }`}
                  />
                  <X
                    className={`absolute h-5 w-5 transition-all duration-300 ${
                      sidebarOpen ? 'rotate-0 opacity-100' : '-rotate-180 opacity-0'
                    }`}
                  />
                </span>
              </button>
            )}
            <Link to={showAppControls ? '/dashboard' : '/'} className="flex items-center gap-2.5 group">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white transition-colors group-hover:bg-brand-700">
                <Plane className="h-4 w-4" strokeWidth={2} />
              </div>
              <span className="text-base font-semibold tracking-tight text-brand-950 dark:text-brand-50">
                TripPilot
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-surface-border text-brand-600 transition-colors hover:bg-brand-50 dark:border-brand-700 dark:text-brand-300 dark:hover:bg-brand-800"
              aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            >
              {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </button>

            {showAppControls && (
              <Link
                to="/settings"
                aria-label="Open settings"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-surface-border text-brand-600 hover:bg-brand-50 dark:border-brand-700 dark:text-brand-300 dark:hover:bg-brand-800"
              >
                <Settings className="h-4 w-4" />
              </Link>
            )}

            {showAuthLinks && (
              <nav className="ml-2 flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-sm font-medium text-brand-600 hover:text-brand-800 dark:text-brand-300 dark:hover:text-brand-100"
                >
                  Sign in
                </Link>
                <Link to="/signup" className="btn-primary px-3.5 py-2 text-sm">
                  Get started
                </Link>
              </nav>
            )}

            {showAppControls && (
              <button
                type="button"
                onClick={handleSignOut}
                className="ml-1 flex h-9 w-9 items-center justify-center rounded-lg text-brand-500 transition-colors hover:bg-brand-50 hover:text-brand-700 dark:hover:bg-brand-800 dark:hover:text-brand-200"
                aria-label="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </header>
      <DemoBanner />
    </>
  )
}
