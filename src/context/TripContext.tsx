import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react'
import type { Flight, Passenger, Trip } from '../types'
import { tripService } from '../services/tripService'
import { useAuth } from './AuthContext'

interface TripContextValue {
  trips: Trip[]
  addTrip: (flight: Flight, passenger: Passenger, source?: Trip['source']) => Promise<Trip>
  findByPnr: (pnr: string) => Promise<Trip | undefined>
  refreshTrips: () => Promise<void>
  error: string | null
}

const TripContext = createContext<TripContextValue | null>(null)

export function TripProvider({ children }: { children: ReactNode }) {
  const { user, mode } = useAuth()
  const [trips, setTrips] = useState<Trip[]>([])
  const [error, setError] = useState<string | null>(null)

  const refreshTrips = useCallback(async () => {
    if (user) {
      try {
        const nextTrips = await tripService.getTripsForUser(user.id, mode)
        setTrips(nextTrips)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load trips right now.')
      }
    } else {
      setTrips([])
      setError(null)
    }
  }, [user, mode])

  useEffect(() => {
    void refreshTrips()
  }, [refreshTrips])

  const addTrip = useCallback(
    async (flight: Flight, passenger: Passenger, source: Trip['source'] = 'manual') => {
      if (!user) throw new Error('Must be logged in to add trips')
      try {
        const trip = await tripService.addTrip(user.id, flight, passenger, mode, source)
        await refreshTrips()
        return trip
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unable to save the trip right now.'
        setError(message)
        throw new Error(message)
      }
    },
    [user, mode, refreshTrips],
  )

  const findByPnr = useCallback(
    async (pnr: string) => {
      if (!user) return undefined
      return tripService.findByPnr(user.id, pnr, mode)
    },
    [user, mode],
  )

  return (
    <TripContext.Provider value={{ trips, addTrip, findByPnr, refreshTrips, error }}>
      {children}
    </TripContext.Provider>
  )
}

export function useTrips() {
  const ctx = useContext(TripContext)
  if (!ctx) throw new Error('useTrips must be used within TripProvider')
  return ctx
}
