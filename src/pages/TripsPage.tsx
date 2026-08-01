import { useMemo } from 'react'
import AppLayout from '../components/AppLayout'
import TripListCard from '../components/TripListCard'
import { useTrips } from '../context/TripContext'
import { filterTripsByCategory } from '../lib/tripUtils'

export default function TripsPage() {
  const { trips } = useTrips()
  const categories = useMemo(() => ({
    upcoming: filterTripsByCategory(trips, 'upcoming'),
    current: filterTripsByCategory(trips, 'current'),
    past: filterTripsByCategory(trips, 'past'),
    cancelled: filterTripsByCategory(trips, 'cancelled'),
  }), [trips])

  return <AppLayout title="Trips" subtitle="All of your flight bookings in one place">
    <div className="grid gap-4 xl:grid-cols-2">
      <TripListCard title="Upcoming" trips={categories.upcoming} emptyTitle="No upcoming trips" emptyDescription="Future bookings will appear here." />
      <TripListCard title="Current" trips={categories.current} emptyTitle="No current trips" emptyDescription="Trips in progress will appear here." />
      <TripListCard title="Past" trips={categories.past} emptyTitle="No past trips" emptyDescription="Completed trips will appear here." />
      <TripListCard title="Cancelled" trips={categories.cancelled} emptyTitle="No cancelled trips" emptyDescription="Cancelled bookings will appear here." />
    </div>
  </AppLayout>
}
