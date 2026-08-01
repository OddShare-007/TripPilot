import type { User, Passenger, Trip, UserPreferences, Flight } from '../types'
import { getAll, getById, put, clearStore, STORE_NAMES } from '../lib/idb'
import { readStorage, writeStorage, removeStorage, STORAGE_KEYS } from '../lib/storage'

export type Mode = 'demo' | 'real'

interface StoredUserRecord extends User {
  mode: Mode
}

interface StoredTripRecord extends Trip {
  mode: Mode
  passengerId: string
}

interface StoredPassengerRecord extends Passenger {
  id: string
  userId: string
  mode: Mode
}

interface StoredPreferencesRecord extends UserPreferences {
  id: string
  userId: string
  mode: Mode
}

function getModeKey(mode: Mode) {
  return mode === 'demo' ? 'demo' : 'real'
}

function getModeStorageKey(mode: Mode) {
  return `${getModeKey(mode)}_${STORAGE_KEYS.session}`
}

async function getUsers(mode: Mode): Promise<StoredUserRecord[]> {
  const allUsers = await getAll<StoredUserRecord>(STORE_NAMES.users)
  return allUsers.filter((user) => user.mode === mode)
}

async function saveUsers(users: StoredUserRecord[]): Promise<void> {
  await Promise.all(users.map((user) => put<StoredUserRecord>(STORE_NAMES.users, user)))
}

async function getPassengers(userId: string, mode: Mode): Promise<StoredPassengerRecord[]> {
  const allPassengers = await getAll<StoredPassengerRecord>(STORE_NAMES.passengers)
  return allPassengers.filter((passenger) => passenger.userId === userId && passenger.mode === mode)
}

async function getTripsByUser(userId: string, mode: Mode): Promise<StoredTripRecord[]> {
  const allTrips = await getAll<StoredTripRecord>(STORE_NAMES.trips)
  return allTrips.filter((trip) => trip.userId === userId && trip.mode === mode)
}

export const databaseService = {
  async seedDemoData(): Promise<void> {
    const existing = await getAll<StoredUserRecord>(STORE_NAMES.users)
    if (existing.length) return
    const demoUserId = `demo-user-${Date.now()}`
    const demoUser: StoredUserRecord = {
      id: demoUserId,
      email: 'demo@trippilot.app',
      passwordHash: 'demo-hash',
      preferences: {
        travellerType: 'frequent',
        priority: 'comfort',
        onboardingCompleted: true,
      },
      createdAt: new Date().toISOString(),
      mode: 'demo',
    }
    await put<StoredUserRecord>(STORE_NAMES.users, demoUser)

    const passenger: StoredPassengerRecord = {
      id: 'PSG-0001',
      userId: demoUserId,
      mode: 'demo',
      name: 'Alex Rivera',
      age: 31,
      gender: 'Male',
      phone: '+1 555-0100',
      email: 'alex@example.com',
      passport: 'P1234567',
      governmentId: 'ID12345',
      emergencyContact: 'Jamie Rivera',
      frequentFlyerNumber: 'AI-1001',
      travelPreferences: 'Window seat, vegan meal',
    }
    await put<StoredPassengerRecord>(STORE_NAMES.passengers, passenger)

    const trip: StoredTripRecord = {
      id: crypto.randomUUID(),
      userId: demoUserId,
      passengerId: passenger.id,
      mode: 'demo',
      flight: {
        pnr: 'DEMO123',
        flightNumber: 'AI-102',
        airline: 'Air India',
        aircraftType: 'Boeing 787',
        departureAirport: 'DEL',
        arrivalAirport: 'BOM',
        departureTerminal: 'T3',
        arrivalTerminal: 'T2',
        departureGate: 'B12',
        arrivalGate: 'C7',
        departureTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString(),
        arrivalTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2 + 1000 * 60 * 60 * 2).toISOString(),
        duration: '2h 15m',
        stops: 0,
        layovers: '',
        fare: 12500,
        seatAvailability: '12A',
        cabinClass: 'Economy',
        meal: 'Vegetarian',
        baggageAllowance: '23kg',
        refundPolicy: 'Flexible',
        cancellationPolicy: 'Free within 24h',
        flightStatus: 'On Time',
        bookingWebsite: 'airindia.com',
      },
      passenger,
      createdAt: new Date().toISOString(),
      source: 'manual',
    }
    await put<StoredTripRecord>(STORE_NAMES.trips, trip)

    const preferences: StoredPreferencesRecord = {
      id: `${demoUserId}-prefs`,
      userId: demoUserId,
      mode: 'demo',
      travellerType: 'frequent',
      priority: 'comfort',
      onboardingCompleted: true,
    }
    await put<StoredPreferencesRecord>(STORE_NAMES.preferences, preferences)
  },

  async signUp(email: string, password: string, fullName: string, age: number, mode: Mode): Promise<{ success: boolean; user?: User; error?: string }> {
    const normalized = email.trim().toLowerCase()
    const users = await getUsers(mode)
    if (users.some((user) => user.email === normalized)) {
      return { success: false, error: 'An account with this email already exists.' }
    }

    const passwordHash = await hashPassword(password)
    const user: StoredUserRecord = {
      id: crypto.randomUUID(),
      email: normalized,
      passwordHash,
      preferences: { travellerType: null, priority: null, onboardingCompleted: false },
      createdAt: new Date().toISOString(),
      mode,
      fullName,
      age,
    }
    await put<StoredUserRecord>(STORE_NAMES.users, user)
    writeStorage(getModeStorageKey(mode), { userId: user.id })
    return { success: true, user }
  },

  async signIn(email: string, password: string, mode: Mode): Promise<{ success: boolean; user?: User; error?: string }> {
    const normalized = email.trim().toLowerCase()
    const users = await getUsers(mode)
    const user = users.find((candidate) => candidate.email === normalized)
    if (!user) {
      return { success: false, error: 'No account found with this email.' }
    }
    const hash = await hashPassword(password)
    if (hash !== user.passwordHash) {
      return { success: false, error: 'Invalid credentials.' }
    }
    writeStorage(getModeStorageKey(mode), { userId: user.id })
    return { success: true, user }
  },

  async getCurrentUser(mode: Mode): Promise<User | null> {
    const session = readStorage<{ userId: string } | null>(getModeStorageKey(mode), null)
    if (!session) return null
    const users = await getUsers(mode)
    return users.find((user) => user.id === session.userId) ?? null
  },

  async signOut(mode: Mode): Promise<void> {
    removeStorage(getModeStorageKey(mode))
  },

  async updateUser(user: StoredUserRecord): Promise<User> {
    await put<StoredUserRecord>(STORE_NAMES.users, user)
    return user
  },

  async addPassenger(userId: string, passenger: Passenger, mode: Mode): Promise<StoredPassengerRecord> {
    const id = `PSG-${String((await getPassengers(userId, mode)).length + 1).padStart(4, '0')}`
    const record: StoredPassengerRecord = { ...passenger, id, userId, mode }
    await put<StoredPassengerRecord>(STORE_NAMES.passengers, record)
    return record
  },

  async addTrip(userId: string, flight: Flight, passenger: Passenger, mode: Mode, source: Trip['source'] = 'manual'): Promise<StoredTripRecord> {
    const passengerRecord = await this.addPassenger(userId, passenger, mode)
    const trip: StoredTripRecord = {
      id: crypto.randomUUID(),
      userId,
      passengerId: passengerRecord.id,
      mode,
      flight,
      passenger: passengerRecord,
      createdAt: new Date().toISOString(),
      source,
    }
    await put<StoredTripRecord>(STORE_NAMES.trips, trip)
    return trip
  },

  async getTripsForUser(userId: string, mode: Mode): Promise<StoredTripRecord[]> {
    return getTripsByUser(userId, mode)
  },

  async getPassengerById(passengerId: string): Promise<StoredPassengerRecord | null> {
    return getById<StoredPassengerRecord>(STORE_NAMES.passengers, passengerId)
  },

  async setUserPreferences(userId: string, prefs: Partial<UserPreferences>, mode: Mode): Promise<User | null> {
    const user = await this.getUserById(userId, mode)
    if (!user) return null
    const nextUser = {
      ...user,
      preferences: { ...user.preferences, ...prefs },
    }
    await this.updateUser(nextUser as StoredUserRecord)
    return nextUser
  },

  async getUserById(userId: string, mode: Mode): Promise<StoredUserRecord | null> {
    const users = await getUsers(mode)
    return users.find((candidate) => candidate.id === userId) ?? null
  },

  async updateUserProfile(userId: string, updates: Partial<StoredUserRecord>, mode: Mode): Promise<User | null> {
    const user = await this.getUserById(userId, mode)
    if (!user) return null
    const nextUser = { ...user, ...updates }
    await this.updateUser(nextUser as StoredUserRecord)
    return nextUser
  },

  async clearModeData(mode: Mode): Promise<void> {
    const allUsers = await getAll<StoredUserRecord>(STORE_NAMES.users)
    const remainingUsers = allUsers.filter((user) => user.mode !== mode)
    await saveUsers(remainingUsers)
  },
}

async function hashPassword(password: string): Promise<string> {
  const data = new TextEncoder().encode(password)
  const buf = await crypto.subtle.digest('SHA-256', data)
  return [...new Uint8Array(buf)].map((byte) => byte.toString(16).padStart(2, '0')).join('')
}

export async function resetDatabase(): Promise<void> {
  await clearStore(STORE_NAMES.users)
  await clearStore(STORE_NAMES.passengers)
  await clearStore(STORE_NAMES.trips)
  await clearStore(STORE_NAMES.preferences)
}
