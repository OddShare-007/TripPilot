import { CalendarDays, PlaneTakeoff } from 'lucide-react'
import AppLayout from '../components/AppLayout'
import EmptyState from '../components/EmptyState'
import { useTrips } from '../context/TripContext'
import { formatDateTime } from '../lib/tripUtils'

export default function SchedulePage() {
  const { trips } = useTrips()
  const scheduled = [...trips].sort((a, b) => new Date(a.flight.departureTime).getTime() - new Date(b.flight.departureTime).getTime())
  return <AppLayout title="Schedule" subtitle="Your flights in departure order">
    <div className="card overflow-hidden">
      {scheduled.length === 0 ? <EmptyState icon={<CalendarDays className="h-5 w-5" />} title="No scheduled flights" description="Add a trip to build your travel schedule." /> : (
        <div className="divide-y divide-surface-border dark:divide-brand-800">
          {scheduled.map((trip) => <div key={trip.id} className="flex gap-4 px-5 py-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-800 dark:text-brand-300"><PlaneTakeoff className="h-4 w-4" /></div>
            <div className="min-w-0"><p className="font-medium text-brand-900 dark:text-brand-100">{trip.flight.departureAirport} → {trip.flight.arrivalAirport}</p><p className="mt-1 text-sm text-brand-500 dark:text-brand-400">{trip.flight.flightNumber} · {trip.flight.airline || 'Airline not specified'} · {formatDateTime(trip.flight.departureTime)}</p></div>
            <span className="ml-auto text-xs text-brand-500 dark:text-brand-400">{trip.flight.flightStatus}</span>
          </div>)}
        </div>
      )}
    </div>
  </AppLayout>
}
