import { useState, useMemo } from 'react'
import { Bell, Search, User, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTrips } from '../context/TripContext'
import { searchTrips } from '../lib/tripUtils'
import { useNavigate } from 'react-router-dom'

interface DashboardTopbarProps {
  title: string
  subtitle?: string
}

export default function DashboardTopbar({ title, subtitle }: DashboardTopbarProps) {
  const { user, signOut } = useAuth()
  const { trips } = useTrips()
  const navigate = useNavigate()

  const [query, setQuery] = useState('')

  const results = useMemo(() => {
    if (!query.trim()) return []
    return searchTrips(trips, query)
  }, [trips, query])

  const handleSignOut = () => {
    signOut()
    navigate('/')
  }

  return (
    <div className="flex h-14 items-center justify-between border-b border-surface-border bg-surface px-4 sm:px-6 dark:border-brand-800 dark:bg-brand-900">
      <div>
        <h1 className="text-base font-semibold text-brand-950 dark:text-brand-50">{title}</h1>
        {subtitle && (
          <p className="text-xs text-brand-500 dark:text-brand-400">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search trips, PNR..."
            className="input-field w-56 pl-9 lg:w-64"
          />
          {results.length > 0 && (
            <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-lg border border-surface-border bg-surface shadow-lg dark:border-brand-700 dark:bg-brand-900">
              <div className="max-h-48 overflow-y-auto">
                {results.slice(0, 5).map((trip) => (
                  <button
                    key={trip.id}
                    type="button"
                    onClick={() => {
                      setQuery('')
                      navigate('/dashboard')
                    }}
                    className="flex w-full items-center gap-3 px-3 py-2 text-left text-xs transition-colors hover:bg-brand-50 dark:hover:bg-brand-800"
                  >
                    <span className="font-medium text-brand-800 dark:text-brand-200">
                      {trip.flight.flightNumber}
                    </span>
                    <span className="text-brand-500">
                      {trip.flight.departureAirport} → {trip.flight.arrivalAirport}
                    </span>
                    <span className="ml-auto text-brand-400">{trip.flight.pnr}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-surface-border text-brand-600 transition-colors hover:bg-brand-50 dark:border-brand-700 dark:text-brand-300 dark:hover:bg-brand-800"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
        </button>

        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-100 text-brand-700 dark:bg-brand-800 dark:text-brand-200"
          aria-label="Profile"
          title={user?.email || 'User'}
        >
          <User className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={handleSignOut}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-brand-500 transition-colors hover:bg-brand-50 hover:text-brand-700 dark:hover:bg-brand-800 dark:hover:text-brand-200"
          aria-label="Sign out"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

