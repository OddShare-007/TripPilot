import type { Flight, Passenger } from '../types'

export interface ParsedBooking { flight: Flight; passenger: Passenger; confidence: number; missing: string[] }

const blankFlight: Flight = { pnr: '', flightNumber: '', airline: '', aircraftType: '', departureAirport: '', arrivalAirport: '', departureTerminal: '', arrivalTerminal: '', departureGate: '', arrivalGate: '', departureTime: '', arrivalTime: '', duration: '', stops: 0, layovers: '', fare: 0, seatAvailability: '', cabinClass: 'Economy', meal: '', baggageAllowance: '', refundPolicy: '', cancellationPolicy: '', flightStatus: 'On Time', bookingWebsite: '' }
const blankPassenger: Passenger = { name: '', age: 0, gender: '', phone: '', email: '', passport: '', governmentId: '', emergencyContact: '', frequentFlyerNumber: '', travelPreferences: '' }

export function parseBookingText(rawText: string): ParsedBooking {
  const text = rawText.replace(/\s+/g, ' ').trim()
  const pnr = text.match(/(?:PNR|BOOKING(?:\s+REFERENCE)?|REF)\s*[:#-]?\s*([A-Z0-9]{5,8})/i)?.[1]?.toUpperCase() ?? ''
  const flightNumber = text.match(/\b([A-Z]{2}\s?-?\s?\d{1,4})\b/)?.[1]?.replace(/\s/g, '').toUpperCase() ?? ''
  const route = text.match(/\b([A-Z]{3})\s*(?:TO|[-→])\s*([A-Z]{3})\b/i)
  const seat = text.match(/(?:SEAT)\s*[:#-]?\s*([A-Z0-9]{1,4})/i)?.[1]?.toUpperCase() ?? ''
  const terminal = text.match(/(?:TERMINAL|TERM)\s*[:#-]?\s*([A-Z0-9]{1,4})/i)?.[1] ?? ''
  const name = text.match(/(?:PASSENGER|TRAVELLER|NAME)\s*[:#-]?\s*([A-Z][A-Z .'-]{2,50})/i)?.[1]?.trim() ?? ''
  const email = text.match(/\b[\w.+-]+@[\w.-]+\.[A-Z]{2,}\b/i)?.[0] ?? ''
  const date = text.match(/\b\d{1,2}[-/][A-Z]{3}[-/]\d{2,4}\b|\b\d{1,2}[-/]\d{1,2}[-/]\d{2,4}\b/i)?.[0] ?? ''
  const time = text.match(/\b(?:[01]?\d|2[0-3]):[0-5]\d\b/)?.[0] ?? ''
  const airline = text.match(/(?:AIRLINE|CARRIER)\s*[:#-]?\s*([A-Z][A-Z ]{2,30})/i)?.[1]?.trim() ?? ''
  const found = [pnr, flightNumber, route?.[1], route?.[2], name, seat, terminal, date || time].filter(Boolean).length
  const missing = [['PNR', pnr], ['flight number', flightNumber], ['route', route?.[1] && route?.[2]], ['passenger name', name]].filter(([, value]) => !value).map(([label]) => label as string)
  return { flight: { ...blankFlight, pnr, flightNumber, airline, departureAirport: route?.[1]?.toUpperCase() ?? '', arrivalAirport: route?.[2]?.toUpperCase() ?? '', departureTerminal: terminal, seatAvailability: seat, departureTime: date && time ? `${date} ${time}` : '' }, passenger: { ...blankPassenger, name, email }, confidence: Math.round((found / 8) * 100), missing }
}
