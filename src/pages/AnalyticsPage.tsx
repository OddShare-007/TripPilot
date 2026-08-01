import { BarChart3, TrendingUp } from 'lucide-react'
import AppLayout from '../components/AppLayout'
import BarChart from '../components/BarChart'
import EmptyState from '../components/EmptyState'
import PopularRoutesChart from '../components/PopularRoutesChart'
import { useTrips } from '../context/TripContext'
import { popularRoutes, spendingByMonth, tripsPerMonth } from '../lib/tripUtils'

export default function AnalyticsPage() {
  const { trips } = useTrips()
  const hasTrips = trips.length > 0
  return <AppLayout title="Analytics" subtitle="Travel patterns from your saved bookings">
    {hasTrips ? (
      <div className="grid gap-4 xl:grid-cols-2">
        <BarChart title="Spending over time" icon={<TrendingUp className="h-4 w-4" />} data={spendingByMonth(trips).map((item) => ({ label: item.label, value: item.amount }))} valuePrefix="₹" />
        <BarChart title="Trips per month" icon={<BarChart3 className="h-4 w-4" />} data={tripsPerMonth(trips).map((item) => ({ label: item.label, value: item.count }))} />
        <PopularRoutesChart data={popularRoutes(trips)} />
      </div>
    ) : (
      <div className="card">
        <EmptyState icon={<TrendingUp className="h-5 w-5" />} title="No trips yet" description="Add your first trip to unlock analytics and route insights." />
      </div>
    )}
  </AppLayout>
}
