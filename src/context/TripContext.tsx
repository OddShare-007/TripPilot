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
}

const TripContext = createContext<TripContextValue | null>(null)

export function TripProvider({ children }: { children: ReactNode }) {
  const { user, mode } = useAuth()
  const [trips, setTrips] = useState<Trip[]>([])

  const refreshTrips = useCallback(async () => {
    if (user) {
      const nextTrips = await tripService.getTripsForUser(user.id, mode)
      setTrips(nextTrips)
    } else {
      setTrips([])
    }
  }, [user, mode])

  useEffect(() => {
    void refreshTrips()
  }, [refreshTrips])

  const addTrip = useCallback(
    async (flight: Flight, passenger: Passenger, source: Trip['source'] = 'manual') => {
      if (!user) throw new Error('Must be logged in to add trips')
      const trip = await tripService.addTrip(user.id, flight, passenger, mode, source)
      await refreshTrips()
      return trip
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
    <TripContext.Provider value={{ trips, addTrip, findByPnr, refreshTrips }}>
      {children}
    </TripContext.Provider>
  )
}

export function useTrips() {
  const ctx = useContext(TripContext)
  if (!ctx) throw new Error('useTrips must be used within TripProvider')
  return ctx
}
