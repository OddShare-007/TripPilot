import type { Trip } from '../types'
import { formatCurrency, formatDateTime } from '../lib/tripUtils'
import EmptyState from './EmptyState'
import { Plane } from 'lucide-react'

interface TripListCardProps {
  title: string
  trips: Trip[]
  emptyTitle: string
  emptyDescription: string
}

export default function TripListCard({
  title,
  trips,
  emptyTitle,
  emptyDescription,
}: TripListCardProps) {
  return (
    <div className="card flex flex-col">
      <div className="border-b border-surface-border px-4 py-3 dark:border-brand-800">
        <h3 className="text-sm font-semibold text-brand-900 dark:text-brand-100">{title}</h3>
      </div>
      <div className="flex-1 overflow-x-auto">
        {trips.length === 0 ? (
          <EmptyState
            icon={<Plane className="h-5 w-5" />}
            title={emptyTitle}
            description={emptyDescription}
          />
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-surface-border text-xs uppercase tracking-wider text-brand-400 dark:border-brand-800">
                <th className="px-4 py-2.5 font-medium">Flight</th>
                <th className="px-4 py-2.5 font-medium">Route</th>
                <th className="px-4 py-2.5 font-medium">Departure</th>
                <th className="px-4 py-2.5 font-medium">Status</th>
                <th className="px-4 py-2.5 font-medium">Fare</th>
              </tr>
            </thead>
            <tbody>
              {trips.map((trip) => (
                <tr
                  key={trip.id}
                  className="border-b border-surface-border last:border-0 dark:border-brand-800/60"
                >
                  <td className="px-4 py-3">
                    <p className="font-medium text-brand-900 dark:text-brand-100">
                      {trip.flight.flightNumber}
                    </p>
                    <p className="text-xs text-brand-500">{trip.flight.airline}</p>
                  </td>
                  <td className="px-4 py-3 text-brand-700 dark:text-brand-300">
                    {trip.flight.departureAirport} → {trip.flight.arrivalAirport}
                  </td>
                  <td className="px-4 py-3 text-xs text-brand-600 dark:text-brand-400">
                    {formatDateTime(trip.flight.departureTime)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={trip.flight.flightStatus} />
                  </td>
                  <td className="px-4 py-3 font-medium text-brand-800 dark:text-brand-200">
                    {formatCurrency(trip.flight.fare)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    'On Time': 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300',
    Delayed: 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
    Boarding: 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
    Departed: 'bg-brand-50 text-brand-700 dark:bg-brand-800 dark:text-brand-200',
    Arrived: 'bg-brand-50 text-brand-600 dark:bg-brand-800 dark:text-brand-300',
    Cancelled: 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300',
  }
  return (
    <span
      className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${colors[status] ?? colors['On Time']}`}
    >
      {status}
    </span>
  )
}
