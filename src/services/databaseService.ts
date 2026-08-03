import type { User, Passenger, Trip, UserPreferences, Flight, CabinClass, FlightStatus } from '../types'
import { getAll, getById, put, clearStore, STORE_NAMES } from '../lib/idb'
import { readStorage, writeStorage, removeStorage, STORAGE_KEYS } from '../lib/storage'
import { getSupabaseClient, getSupabaseErrorMessage } from '../lib/supabase'

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

interface SupabasePassengerRow {
  id?: string
  passenger_code?: string | null
  user_id?: string
  name?: string
  age?: number | null
  gender?: string | null
  phone?: string | null
  email?: string | null
  passport?: string | null
  government_id?: string | null
  emergency_contact?: string | null
  frequent_flyer_number?: string | null
  travel_preferences?: string | null
  mode?: string | null
  created_at?: string | null
}

interface SupabaseTripRow {
  id?: string
  user_id?: string
  passenger_id?: string | null
  pnr?: string | null
  flight_number?: string | null
  airline?: string | null
  aircraft_type?: string | null
  source_airport?: string | null
  destination_airport?: string | null
  departure_terminal?: string | null
  arrival_terminal?: string | null
  departure_gate?: string | null
  arrival_gate?: string | null
  departure_time?: string | null
  arrival_time?: string | null
  duration?: string | null
  layover_details?: string | null
  stops?: number | null
  fare?: number | null
  seat?: string | null
  cabin_class?: string | null
  meal?: string | null
  baggage_allowance?: string | null
  refund_policy?: string | null
  cancellation_policy?: string | null
  flight_status?: string | null
  booking_website?: string | null
  source?: string | null
  mode?: string | null
  created_at?: string | null
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
  try {
    const client = getSupabaseClient()
    const { data, error } = await client
      .from('passengers')
      .select('*')
      .eq('user_id', userId)
      .eq('mode', mode)
      .order('created_at', { ascending: true })

    if (error) throw error
    return (data ?? []).map((row) => mapPassengerRow(row as SupabasePassengerRow))
  } catch (error) {
    throw new Error(getSupabaseErrorMessage(error, 'Unable to load passengers right now.'))
  }
}

async function getTripsByUser(userId: string, mode: Mode): Promise<StoredTripRecord[]> {
  try {
    const client = getSupabaseClient()
    const { data, error } = await client
      .from('trips')
      .select('*')
      .eq('user_id', userId)
      .eq('mode', mode)
      .order('created_at', { ascending: true })

    if (error) throw error

    const passengerIds = [...new Set((data ?? []).map((row) => (row as SupabaseTripRow).passenger_id).filter(Boolean))] as string[]
    const passengerRows = passengerIds.length
      ? await client.from('passengers').select('*').in('id', passengerIds.map((value) => Number(value) || value))
      : { data: [] as SupabasePassengerRow[], error: null }

    if (passengerRows.error) throw passengerRows.error

    const passengersById = new Map<string, StoredPassengerRecord>()
    for (const row of passengerRows.data ?? []) {
      passengersById.set(String((row as SupabasePassengerRow).id ?? ''), mapPassengerRow(row as SupabasePassengerRow))
    }

    return (data ?? []).map((row) => mapTripRow(row as SupabaseTripRow, passengersById.get(String((row as SupabaseTripRow).passenger_id ?? ''))))
  } catch (error) {
    throw new Error(getSupabaseErrorMessage(error, 'Unable to load trips right now.'))
  }
}

function mapPassengerRow(row: SupabasePassengerRow): StoredPassengerRecord {
  return {
    id: String(row.id ?? row.passenger_code ?? crypto.randomUUID()),
    userId: row.user_id ?? '',
    mode: (row.mode as Mode) ?? 'demo',
    name: row.name ?? '',
    age: Number(row.age ?? 0),
    gender: row.gender ?? '',
    phone: row.phone ?? '',
    email: row.email ?? '',
    passport: row.passport ?? '',
    governmentId: row.government_id ?? '',
    emergencyContact: row.emergency_contact ?? '',
    frequentFlyerNumber: row.frequent_flyer_number ?? '',
    travelPreferences: row.travel_preferences ?? '',
  }
}

function mapTripRow(row: SupabaseTripRow, passenger?: StoredPassengerRecord): StoredTripRecord {
  return {
    id: String(row.id ?? crypto.randomUUID()),
    userId: row.user_id ?? '',
    passengerId: row.passenger_id ?? '',
    mode: (row.mode as Mode) ?? 'demo',
    flight: {
      pnr: row.pnr ?? '',
      flightNumber: row.flight_number ?? '',
      airline: row.airline ?? '',
      aircraftType: row.aircraft_type ?? '',
      departureAirport: row.source_airport ?? '',
      arrivalAirport: row.destination_airport ?? '',
      departureTerminal: row.departure_terminal ?? '',
      arrivalTerminal: row.arrival_terminal ?? '',
      departureGate: row.departure_gate ?? '',
      arrivalGate: row.arrival_gate ?? '',
      departureTime: row.departure_time ?? '',
      arrivalTime: row.arrival_time ?? '',
      duration: row.duration ?? '',
      stops: Number(row.stops ?? 0),
      layovers: row.layover_details ?? '',
      fare: Number(row.fare ?? 0),
      seatAvailability: row.seat ?? '',
      cabinClass: (row.cabin_class as CabinClass) ?? 'Economy',
      meal: row.meal ?? '',
      baggageAllowance: row.baggage_allowance ?? '',
      refundPolicy: row.refund_policy ?? '',
      cancellationPolicy: row.cancellation_policy ?? '',
      flightStatus: (row.flight_status as FlightStatus) ?? 'On Time',
      bookingWebsite: row.booking_website ?? '',
    },
    passenger: passenger ?? {
      id: row.passenger_id ?? '',
      name: '',
      age: 0,
      gender: '',
      phone: '',
      email: '',
      passport: '',
      governmentId: '',
      emergencyContact: '',
      frequentFlyerNumber: '',
      travelPreferences: '',
    },
    createdAt: row.created_at ?? new Date().toISOString(),
    source: (row.source as Trip['source']) ?? 'manual',
  }
}

async function generatePassengerCode(mode: Mode): Promise<string> {
  try {
    const client = getSupabaseClient()
    const { data, error } = await client.from('passengers').select('passenger_code').eq('mode', mode)
    if (error) throw error

    const numbers = (data ?? [])
      .map((row) => (row as { passenger_code?: string | null }).passenger_code)
      .filter((value): value is string => Boolean(value))
      .map((value) => Number(value.replace(/^PSG-/, '')))
      .filter((value) => Number.isFinite(value))

    const nextNumber = numbers.length ? Math.max(...numbers) + 1 : 1
    return `PSG-${String(nextNumber).padStart(4, '0')}`
  } catch (error) {
    throw new Error(getSupabaseErrorMessage(error, 'Unable to generate a passenger code right now.'))
  }
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

    try {
      const passengerRecord = await this.addPassenger(demoUserId, passenger, 'demo')
      const trip: StoredTripRecord = {
        id: crypto.randomUUID(),
        userId: demoUserId,
        passengerId: passengerRecord.id,
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
        passenger: passengerRecord,
        createdAt: new Date().toISOString(),
        source: 'manual',
      }
      await this.addTrip(demoUserId, trip.flight, { ...passenger, id: passengerRecord.id }, 'demo', 'manual')
    } catch (error) {
      console.warn('Supabase seeding skipped:', error)
    }

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
    try {
      const code = await generatePassengerCode(mode)
      const client = getSupabaseClient()
      const payload = {
        user_id: userId,
        passenger_code: code,
        name: passenger.name,
        age: passenger.age,
        gender: passenger.gender,
        phone: passenger.phone,
        email: passenger.email,
        passport: passenger.passport,
        government_id: passenger.governmentId,
        emergency_contact: passenger.emergencyContact,
        frequent_flyer_number: passenger.frequentFlyerNumber,
        travel_preferences: passenger.travelPreferences,
        mode,
        created_at: new Date().toISOString(),
      }

      const { data, error } = await client.from('passengers').insert(payload).select('*').single()
      if (error) throw error
      return mapPassengerRow(data as SupabasePassengerRow)
    } catch (error) {
      throw new Error(getSupabaseErrorMessage(error, 'Unable to save the passenger record.'))
    }
  },

  async addTrip(userId: string, flight: Flight, passenger: Passenger, mode: Mode, source: Trip['source'] = 'manual'): Promise<StoredTripRecord> {
    let passengerRecord: StoredPassengerRecord
    if (passenger.id) {
      const existingPassenger = await this.getPassengerById(passenger.id)
      passengerRecord = existingPassenger ?? { ...(passenger as StoredPassengerRecord), userId, mode }
    } else {
      passengerRecord = await this.addPassenger(userId, passenger, mode)
    }

    try {
      const client = getSupabaseClient()
      const payload = {
        user_id: userId,
        passenger_id: Number(passengerRecord.id) || passengerRecord.id,
        pnr: flight.pnr,
        flight_number: flight.flightNumber,
        airline: flight.airline,
        aircraft_type: flight.aircraftType,
        source_airport: flight.departureAirport,
        destination_airport: flight.arrivalAirport,
        departure_terminal: flight.departureTerminal,
        arrival_terminal: flight.arrivalTerminal,
        departure_gate: flight.departureGate,
        arrival_gate: flight.arrivalGate,
        departure_time: flight.departureTime,
        arrival_time: flight.arrivalTime,
        duration: flight.duration,
        layover_details: flight.layovers,
        stops: flight.stops,
        fare: flight.fare,
        seat: flight.seatAvailability,
        cabin_class: flight.cabinClass,
        meal: flight.meal,
        baggage_allowance: flight.baggageAllowance,
        refund_policy: flight.refundPolicy,
        cancellation_policy: flight.cancellationPolicy,
        flight_status: flight.flightStatus,
        booking_website: flight.bookingWebsite,
        source,
        mode,
        created_at: new Date().toISOString(),
      }

      const { data, error } = await client.from('trips').insert(payload).select('*').single()
      if (error) throw error
      return mapTripRow(data as SupabaseTripRow, passengerRecord)
    } catch (error) {
      throw new Error(getSupabaseErrorMessage(error, 'Unable to save the trip record.'))
    }
  },

  async getTripsForUser(userId: string, mode: Mode): Promise<StoredTripRecord[]> {
    return getTripsByUser(userId, mode)
  },

  async getPassengerById(passengerId: string): Promise<StoredPassengerRecord | null> {
    try {
      const client = getSupabaseClient()
      const { data, error } = await client.from('passengers').select('*').eq('id', passengerId).maybeSingle()
      if (error) throw error
      return data ? mapPassengerRow(data as SupabasePassengerRow) : null
    } catch (error) {
      throw new Error(getSupabaseErrorMessage(error, 'Unable to load the passenger record.'))
    }
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
