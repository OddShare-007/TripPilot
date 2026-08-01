import type { Flight, Passenger, Trip } from '../types'
import { readStorage, STORAGE_KEYS } from '../lib/storage'
import { databaseService, type Mode } from './databaseService'

function getMode(): Mode {
  return readStorage<Mode>(STORAGE_KEYS.mode, 'demo')
}

export const tripService = {
  async getTripsForUser(userId: string, mode: Mode = getMode()): Promise<Trip[]> {
    return databaseService.getTripsForUser(userId, mode)
  },

  async addTrip(
    userId: string,
    flight: Flight,
    passenger: Passenger,
    mode: Mode = getMode(),
    source: Trip['source'] = 'manual',
  ): Promise<Trip> {
    return databaseService.addTrip(userId, flight, passenger, mode, source)
  },

  async findByPnr(userId: string, pnr: string, mode: Mode = getMode()): Promise<Trip | undefined> {
    const normalized = pnr.trim().toUpperCase()
    const trips = await tripService.getTripsForUser(userId, mode)
    return trips.find((trip) => trip.flight.pnr.toUpperCase() === normalized)
  },
}
