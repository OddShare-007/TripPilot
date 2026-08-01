import type { Trip, TripCategory, TripStats } from '../types'

export function categorizeTrip(trip: Trip, now = new Date()): TripCategory {
  if (trip.flight.flightStatus === 'Cancelled') return 'cancelled'

  const dep = new Date(trip.flight.departureTime)
  const arr = new Date(trip.flight.arrivalTime)

  if (arr < now) return 'past'
  if (dep <= now && now <= arr) return 'current'
  return 'upcoming'
}

export function filterTripsByCategory(trips: Trip[], category: TripCategory): Trip[] {
  return trips.filter((t) => categorizeTrip(t) === category)
}

export function computeTripStats(trips: Trip[]): TripStats {
  const active = trips.filter((t) => categorizeTrip(t) !== 'cancelled')
  const upcoming = filterTripsByCategory(trips, 'upcoming')
  const routes = new Set(active.map((t) => `${t.flight.departureAirport}→${t.flight.arrivalAirport}`))

  let daysToNext: number | null = null
  if (upcoming.length > 0) {
    const sorted = [...upcoming].sort(
      (a, b) => new Date(a.flight.departureTime).getTime() - new Date(b.flight.departureTime).getTime(),
    )
    const next = new Date(sorted[0].flight.departureTime)
    daysToNext = Math.ceil((next.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  }

  return {
    upcoming: upcoming.length,
    totalSpent: active.reduce((sum, t) => sum + (t.flight.fare || 0), 0),
    uniqueRoutes: routes.size,
    daysToNext,
  }
}

export interface MonthlySpend {
  label: string
  amount: number
}

export function spendingByMonth(trips: Trip[]): MonthlySpend[] {
  const map = new Map<string, number>()
  for (const trip of trips) {
    if (categorizeTrip(trip) === 'cancelled') continue
    const d = new Date(trip.flight.departureTime)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    map.set(key, (map.get(key) ?? 0) + trip.flight.fare)
  }
  return [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6)
    .map(([key, amount]) => {
      const [y, m] = key.split('-')
      const label = new Date(Number(y), Number(m) - 1).toLocaleDateString('en-US', {
        month: 'short',
        year: '2-digit',
      })
      return { label, amount }
    })
}

export interface MonthlyCount {
  label: string
  count: number
}

export function tripsPerMonth(trips: Trip[]): MonthlyCount[] {
  const map = new Map<string, number>()
  for (const trip of trips) {
    if (categorizeTrip(trip) === 'cancelled') continue
    const d = new Date(trip.flight.departureTime)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    map.set(key, (map.get(key) ?? 0) + 1)
  }
  return [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6)
    .map(([key, count]) => {
      const [y, m] = key.split('-')
      const label = new Date(Number(y), Number(m) - 1).toLocaleDateString('en-US', {
        month: 'short',
      })
      return { label, count }
    })
}

export interface RouteCount {
  route: string
  count: number
}

export function popularRoutes(trips: Trip[]): RouteCount[] {
  const map = new Map<string, number>()
  for (const trip of trips) {
    if (categorizeTrip(trip) === 'cancelled') continue
    const route = `${trip.flight.departureAirport} → ${trip.flight.arrivalAirport}`
    map.set(route, (map.get(route) ?? 0) + 1)
  }
  return [...map.entries()]
    .map(([route, count]) => ({ route, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function searchTrips(trips: Trip[], query: string): Trip[] {
  const q = query.toLowerCase().trim()
  if (!q) return trips
  return trips.filter(
    (t) =>
      t.flight.pnr.toLowerCase().includes(q) ||
      t.flight.flightNumber.toLowerCase().includes(q) ||
      t.flight.airline.toLowerCase().includes(q) ||
      t.flight.departureAirport.toLowerCase().includes(q) ||
      t.flight.arrivalAirport.toLowerCase().includes(q) ||
      t.passenger.name.toLowerCase().includes(q),
  )
}
