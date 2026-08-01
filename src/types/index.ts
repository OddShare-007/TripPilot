export type TravellerType = 'business' | 'family' | 'student' | 'frequent'
export type TravelPriority = 'price' | 'speed' | 'comfort'
export type FlightStatus =
  | 'On Time'
  | 'Delayed'
  | 'Boarding'
  | 'Departed'
  | 'Arrived'
  | 'Cancelled'
export type CabinClass = 'Economy' | 'Premium Economy' | 'Business' | 'First'

export interface UserPreferences {
  travellerType: TravellerType | null
  priority: TravelPriority | null
  onboardingCompleted: boolean
  travelPreferences?: string
}

export interface User {
  id: string
  email: string
  passwordHash: string
  preferences: UserPreferences
  createdAt: string
  fullName?: string
  age?: number
  profileInfo?: string
  notifications?: {
    flightReminders: boolean
    gateAlerts: boolean
  }
  mode?: 'demo' | 'real'
}

export interface Flight {
  pnr: string
  flightNumber: string
  airline: string
  aircraftType: string
  departureAirport: string
  arrivalAirport: string
  departureTerminal: string
  arrivalTerminal: string
  departureGate: string
  arrivalGate: string
  departureTime: string
  arrivalTime: string
  duration: string
  stops: number
  layovers: string
  fare: number
  seatAvailability: string
  cabinClass: CabinClass
  meal: string
  baggageAllowance: string
  refundPolicy: string
  cancellationPolicy: string
  flightStatus: FlightStatus
  bookingWebsite: string
}

export interface Passenger {
  id?: string
  name: string
  age: number
  gender: string
  phone: string
  email: string
  passport: string
  governmentId: string
  emergencyContact: string
  frequentFlyerNumber: string
  travelPreferences: string
}

export interface Trip {
  id: string
  userId: string
  passengerId?: string
  flight: Flight
  passenger: Passenger
  createdAt: string
  source: 'manual' | 'imported'
  mode?: 'demo' | 'real'
}

export type TripCategory = 'upcoming' | 'current' | 'past' | 'cancelled'

export interface TripStats {
  upcoming: number
  totalSpent: number
  uniqueRoutes: number
  daysToNext: number | null
}
