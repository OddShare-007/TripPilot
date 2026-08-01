import { useMemo, useState } from 'react'
import { BarChart3, PlaneTakeoff, Search, TrendingUp } from 'lucide-react'
import { useTrips } from '../context/TripContext'
import {
  computeTripStats,
  filterTripsByCategory,
  formatCurrency,
  popularRoutes,
  searchTrips,
  spendingByMonth,
  tripsPerMonth,
} from '../lib/tripUtils'
import AppLayout from '../components/AppLayout'
import BarChart from '../components/BarChart'
import EmptyState from '../components/EmptyState'
import PopularRoutesChart from '../components/PopularRoutesChart'
import TripListCard from '../components/TripListCard'
import { useAuth } from '../context/AuthContext'

function pluralize(count: number, singular: string, plural?: string) {
  return count === 1 ? singular : plural ?? `${singular}s`
}

export default function DashboardPage() {
  const { trips } = useTrips()
  const { mode } = useAuth()
  const [query, setQuery] = useState('')
  const stats = useMemo(() => computeTripStats(trips), [trips])
  const categories = useMemo(
    () => ({
      upcoming: filterTripsByCategory(trips, 'upcoming'),
      current: filterTripsByCategory(trips, 'current'),
      past: filterTripsByCategory(trips, 'past'),
      cancelled: filterTripsByCategory(trips, 'cancelled'),
    }),
    [trips],
  )
  const spending = useMemo(() => spendingByMonth(trips), [trips])
  const monthly = useMemo(() => tripsPerMonth(trips), [trips])
  const routes = useMemo(() => popularRoutes(trips), [trips])
  const results = useMemo(() => searchTrips(trips, query).slice(0, 5), [trips, query])

  const nextDeparture =
    trips.length === 0
      ? '—'
      : stats.daysToNext === null
        ? 'None'
        : `${stats.daysToNext} ${pluralize(stats.daysToNext, 'day')}`

  const statCards = [
    { label: 'Upcoming trips', value: String(stats.upcoming), sub: `${pluralize(stats.upcoming, 'flight')} ahead` },
    { label: 'Total spent', value: formatCurrency(stats.totalSpent), sub: 'All active trips' },
    { label: 'Routes flown', value: String(stats.uniqueRoutes), sub: pluralize(stats.uniqueRoutes, 'unique route') },
    { label: 'Next departure', value: nextDeparture, sub: 'Days away' },
  ]

  return (
    <AppLayout title="Overview" subtitle="Your travel activity at a glance">
      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-400" />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search trips, PNR, airline, airport, or passenger"
          className="input-field pl-9"
          aria-label="Search trips"
        />
        {query.trim() && (
          <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-lg border border-surface-border bg-surface shadow-card dark:border-brand-700 dark:bg-brand-900">
            {results.length ? results.map((trip) => (
              <div key={trip.id} className="border-b border-surface-border px-3 py-2.5 text-xs last:border-0 dark:border-brand-800">
                <p className="font-medium text-brand-800 dark:text-brand-200">{trip.flight.flightNumber} · {trip.flight.airline || 'Flight'}</p>
                <p className="mt-0.5 text-brand-500 dark:text-brand-400">{trip.flight.departureAirport} → {trip.flight.arrivalAirport} · {trip.flight.pnr} · {trip.passenger.name}</p>
              </div>
            )) : <p className="px-3 py-3 text-xs text-brand-500 dark:text-brand-400">No matching trips.</p>}
          </div>
        )}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => (
          <div key={card.label} className="card p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-brand-500 dark:text-brand-400">{card.label}</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-brand-950 dark:text-brand-50">{card.value}</p>
            <p className="mt-1 text-xs text-brand-500 dark:text-brand-400">{card.sub}</p>
          </div>
        ))}
      </div>

      {trips.length === 0 ? (
        <div className="card mt-6">
          <EmptyState
            icon={<PlaneTakeoff className="h-5 w-5" />}
            title="No trips yet"
            description={mode === 'demo' ? 'Add your first trip to see your demo dashboard come to life.' : 'Add your first trip to see your dashboard come to life.'}
          />
        </div>
      ) : (
        <section className="mt-6 space-y-4">
          <h2 className="text-sm font-semibold text-brand-900 dark:text-brand-100">Your trips</h2>
          <div className="grid gap-4 xl:grid-cols-2">
            <TripListCard title="Upcoming" trips={categories.upcoming} emptyTitle="No upcoming trips" emptyDescription="Your future bookings will appear here." />
            <TripListCard title="Current" trips={categories.current} emptyTitle="No current trips" emptyDescription="Trips in progress will appear here." />
            <TripListCard title="Past" trips={categories.past} emptyTitle="No past trips" emptyDescription="Completed trips will appear here." />
            <TripListCard title="Cancelled" trips={categories.cancelled} emptyTitle="No cancelled trips" emptyDescription="Cancelled bookings will appear here." />
          </div>
        </section>
      )}

      <section className="mt-6 space-y-4">
        <h2 className="text-sm font-semibold text-brand-900 dark:text-brand-100">Insights</h2>
        <div className="grid gap-4 xl:grid-cols-2">
          <BarChart title="Spending over time" icon={<TrendingUp className="h-4 w-4" />} data={spending.map((item) => ({ label: item.label, value: item.amount }))} valuePrefix="₹" emptyTitle="No spending data yet" emptyDescription="Add trips to see spending trends." />
          <BarChart title="Trips per month" icon={<BarChart3 className="h-4 w-4" />} data={monthly.map((item) => ({ label: item.label, value: item.count }))} emptyTitle="No trip data yet" emptyDescription="Monthly trip frequency will appear here." />
          <PopularRoutesChart data={routes} />
        </div>
      </section>
    </AppLayout>
  )
}
