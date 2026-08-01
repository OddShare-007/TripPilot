import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FileText,
  Upload,
  Search,
  Plane,
  User,
  Save,
  Loader2,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react'
import { useTrips } from '../context/TripContext'
import AppLayout from '../components/AppLayout'
import type { Flight, Passenger, CabinClass, FlightStatus } from '../types'
import { parseBookingText, type ParsedBooking } from '../lib/bookingImport'
import { createWorker } from 'tesseract.js'

type Tab = 'manual' | 'import'

const initialFlight: Flight = {
  pnr: '',
  flightNumber: '',
  airline: '',
  aircraftType: '',
  departureAirport: '',
  arrivalAirport: '',
  departureTerminal: '',
  arrivalTerminal: '',
  departureGate: '',
  arrivalGate: '',
  departureTime: '',
  arrivalTime: '',
  duration: '',
  stops: 0,
  layovers: '',
  fare: 0,
  seatAvailability: '',
  cabinClass: 'Economy',
  meal: '',
  baggageAllowance: '',
  refundPolicy: '',
  cancellationPolicy: '',
  flightStatus: 'On Time',
  bookingWebsite: '',
}

const initialPassenger: Passenger = {
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
}

export default function AddTripPage() {
  const navigate = useNavigate()
  const { addTrip } = useTrips()

  const [activeTab, setActiveTab] = useState<Tab>('manual')

  // Manual entry state
  const [flight, setFlight] = useState<Flight>({ ...initialFlight })
  const [passenger, setPassenger] = useState<Passenger>({ ...initialPassenger })
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  // Import tab state
  const [importFile, setImportFile] = useState<File | null>(null)
  const [importProcessing, setImportProcessing] = useState(false)
  const [pnrLookup, setPnrLookup] = useState('')
  const [importError, setImportError] = useState('')
  const [parsedBooking, setParsedBooking] = useState<ParsedBooking | null>(null)

  const updateFlight = <K extends keyof Flight>(key: K, value: Flight[K]) => {
    setFlight((prev) => ({ ...prev, [key]: value }))
  }

  const updatePassenger = <K extends keyof Passenger>(key: K, value: Passenger[K]) => {
    setPassenger((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = async () => {
    if (!flight.flightNumber.trim() || !flight.departureAirport.trim() || !flight.arrivalAirport.trim() || !passenger.name.trim()) {
      setSaveError('Please fill in flight number, route, and passenger name before saving.')
      return
    }
    if (flight.fare < 0) {
      setSaveError('Fare cannot be negative.')
      return
    }
    if (passenger.age < 0 || passenger.age > 120) {
      setSaveError('Please enter a realistic passenger age.')
      return
    }
    if (!flight.pnr.trim()) {
      setFlight((prev) => ({ ...prev, pnr: `PNR-${Date.now()}` }))
    }

    setSaving(true)
    setSaveError('')

    try {
      await addTrip(
        { ...flight, pnr: flight.pnr || `PNR-${Date.now()}` },
        passenger,
      )
      setFlight({ ...initialFlight })
      setPassenger({ ...initialPassenger })
      navigate('/dashboard')
    } catch {
      setSaveError('Failed to save trip. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 10 * 1024 * 1024) {
      setImportFile(null)
      setImportError('Choose a file smaller than 10 MB.')
      e.target.value = ''
      return
    }

    setImportFile(file)
    setImportProcessing(true)
    setImportError('')
    setParsedBooking(null)
    try {
      let rawText = ''
      if (file.name.toLowerCase().endsWith('.eml') || file.type.startsWith('text/')) rawText = await file.text()
      else {
        const worker = await createWorker('eng')
        let ocrTarget: File | HTMLCanvasElement = file
        if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
          const { getDocument } = await import('pdfjs-dist/legacy/build/pdf.mjs')
          const pdfDocument = await getDocument({ data: await file.arrayBuffer() }).promise
          const page = await pdfDocument.getPage(1)
          const viewport = page.getViewport({ scale: 2 })
          const canvas = document.createElement('canvas')
          canvas.width = Math.ceil(viewport.width); canvas.height = Math.ceil(viewport.height)
          const context = canvas.getContext('2d')
          if (!context) throw new Error('Could not prepare PDF page for OCR.')
          await page.render({ canvasContext: context, canvas, viewport }).promise
          ocrTarget = canvas
        }
        const result = await worker.recognize(ocrTarget)
        rawText = result.data.text
        await worker.terminate()
      }
      const parsed = parseBookingText(rawText)
      setParsedBooking(parsed)
      if (parsed.confidence < 45) setImportError(`We could only extract limited details (${parsed.confidence}% confidence). Please review and complete the required fields manually.`)
    } catch {
      setImportError('We could not read that file. Use a clear image or email text, then complete the trip manually.')
    } finally { setImportProcessing(false) }
  }

  const handlePnrSearch = () => {
    if (!pnrLookup.trim()) return
    setImportProcessing(true)
    setImportError('')

    // A PNR cannot be looked up without a flight-provider API.
    setTimeout(() => {
      setImportProcessing(false)
      setImportError(
        'PNR lookup needs a flight-provider API. Enter the booking manually or upload its confirmation.',
      )
    }, 1500)
  }

  return (
    <AppLayout
      title="Add Trip Data"
      subtitle="Add flight and passenger details for your trips"
    >
      {/* Tab switcher */}
      <div className="mb-6 flex gap-1 rounded-lg border border-surface-border bg-surface-muted p-1 dark:border-brand-800 dark:bg-brand-900/50">
        <button
          type="button"
          onClick={() => setActiveTab('manual')}
          className={`flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'manual'
              ? 'bg-surface text-brand-900 shadow-sm dark:bg-brand-800 dark:text-brand-100'
              : 'text-brand-500 hover:text-brand-700 dark:hover:text-brand-300'
          }`}
        >
          <FileText className="h-4 w-4" />
          Manual Entry
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('import')}
          className={`flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'import'
              ? 'bg-surface text-brand-900 shadow-sm dark:bg-brand-800 dark:text-brand-100'
              : 'text-brand-500 hover:text-brand-700 dark:hover:text-brand-300'
          }`}
        >
          <Upload className="h-4 w-4" />
          Import Booking
        </button>
      </div>

      {/* Tab A — Manual Entry */}
      {activeTab === 'manual' && (
        <div className="space-y-6">
          {/* Flight Details */}
          <div className="card overflow-hidden">
            <div className="flex items-center gap-2 border-b border-surface-border px-5 py-3.5 dark:border-brand-800">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-800 dark:text-brand-300">
                <Plane className="h-4 w-4" />
              </div>
              <h2 className="text-sm font-semibold text-brand-900 dark:text-brand-100">
                Flight Details
              </h2>
            </div>
            <div className="p-5">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <InputField
                  label="PNR / Booking Reference"
                  value={flight.pnr}
                  onChange={(v) => updateFlight('pnr', v.toUpperCase())}
                  placeholder="e.g. ABC123"
                />
                <InputField
                  label="Flight Number *"
                  value={flight.flightNumber}
                  onChange={(v) => updateFlight('flightNumber', v)}
                  placeholder="e.g. AI-202"
                />
                <InputField
                  label="Airline"
                  value={flight.airline}
                  onChange={(v) => updateFlight('airline', v)}
                  placeholder="e.g. Air India"
                />
                <InputField
                  label="Aircraft Type"
                  value={flight.aircraftType}
                  onChange={(v) => updateFlight('aircraftType', v)}
                  placeholder="e.g. Boeing 787"
                />
                <InputField
                  label="Source Airport *"
                  value={flight.departureAirport}
                  onChange={(v) => updateFlight('departureAirport', v)}
                  placeholder="e.g. DEL"
                  required
                />
                <InputField
                  label="Destination Airport *"
                  value={flight.arrivalAirport}
                  onChange={(v) => updateFlight('arrivalAirport', v)}
                  placeholder="e.g. BOM"
                  required
                />
                <InputField
                  label="Departure Terminal"
                  value={flight.departureTerminal}
                  onChange={(v) => updateFlight('departureTerminal', v)}
                  placeholder="e.g. T3"
                />
                <InputField
                  label="Arrival Terminal"
                  value={flight.arrivalTerminal}
                  onChange={(v) => updateFlight('arrivalTerminal', v)}
                  placeholder="e.g. T2"
                />
                <InputField
                  label="Departure Gate"
                  value={flight.departureGate}
                  onChange={(v) => updateFlight('departureGate', v)}
                  placeholder="e.g. B12"
                />
                <InputField
                  label="Arrival Gate"
                  value={flight.arrivalGate}
                  onChange={(v) => updateFlight('arrivalGate', v)}
                  placeholder="e.g. C7"
                />
                <InputField
                  label="Departure Time"
                  value={flight.departureTime}
                  onChange={(v) => updateFlight('departureTime', v)}
                  type="datetime-local"
                />
                <InputField
                  label="Arrival Time"
                  value={flight.arrivalTime}
                  onChange={(v) => updateFlight('arrivalTime', v)}
                  type="datetime-local"
                />
                <InputField
                  label="Duration"
                  value={flight.duration}
                  onChange={(v) => updateFlight('duration', v)}
                  placeholder="e.g. 2h 15m"
                />
                <InputField
                  label="Layover Details"
                  value={flight.layovers}
                  onChange={(v) => updateFlight('layovers', v)}
                  placeholder="e.g. 1h 20m in BLR"
                />
                <InputField
                  label="Stops"
                  value={flight.stops.toString()}
                  onChange={(v) => updateFlight('stops', Number(v) || 0)}
                  type="number"
                />
                <InputField
                  label="Fare (₹)"
                  value={flight.fare.toString()}
                  onChange={(v) => updateFlight('fare', Number(v) || 0)}
                  type="number"
                />
                <InputField
                  label="Seat"
                  value={flight.seatAvailability}
                  onChange={(v) => updateFlight('seatAvailability', v)}
                  placeholder="e.g. 12A"
                />
                <div>
                  <label className="label-text">Cabin Class</label>
                  <select
                    value={flight.cabinClass}
                    onChange={(e) => updateFlight('cabinClass', e.target.value as CabinClass)}
                    className="input-field"
                  >
                    <option value="Economy">Economy</option>
                    <option value="Premium Economy">Premium Economy</option>
                    <option value="Business">Business</option>
                    <option value="First">First</option>
                  </select>
                </div>
                <InputField
                  label="Meal"
                  value={flight.meal}
                  onChange={(v) => updateFlight('meal', v)}
                  placeholder="e.g. Vegetarian"
                />
                <InputField
                  label="Baggage Allowance"
                  value={flight.baggageAllowance}
                  onChange={(v) => updateFlight('baggageAllowance', v)}
                  placeholder="e.g. 23kg"
                />
                <InputField
                  label="Refund Policy"
                  value={flight.refundPolicy}
                  onChange={(v) => updateFlight('refundPolicy', v)}
                  placeholder="e.g. Non-refundable"
                />
                <InputField
                  label="Cancellation Policy"
                  value={flight.cancellationPolicy}
                  onChange={(v) => updateFlight('cancellationPolicy', v)}
                  placeholder="e.g. Free cancellation within 24h"
                />
                <div>
                  <label className="label-text">Flight Status</label>
                  <select
                    value={flight.flightStatus}
                    onChange={(e) => updateFlight('flightStatus', e.target.value as FlightStatus)}
                    className="input-field"
                  >
                    <option value="On Time">On Time</option>
                    <option value="Delayed">Delayed</option>
                    <option value="Boarding">Boarding</option>
                    <option value="Departed">Departed</option>
                    <option value="Arrived">Arrived</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
                <InputField
                  label="Booking Website"
                  value={flight.bookingWebsite}
                  onChange={(v) => updateFlight('bookingWebsite', v)}
                  placeholder="e.g. makemytrip.com"
                />
              </div>
            </div>
          </div>

          {/* Passenger Details */}
          <div className="card overflow-hidden">
            <div className="flex items-center gap-2 border-b border-surface-border px-5 py-3.5 dark:border-brand-800">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-800 dark:text-brand-300">
                <User className="h-4 w-4" />
              </div>
              <h2 className="text-sm font-semibold text-brand-900 dark:text-brand-100">
                Passenger Details
              </h2>
            </div>
            <div className="p-5">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <InputField
                  label="Passenger Name *"
                  value={passenger.name}
                  onChange={(v) => updatePassenger('name', v)}
                  placeholder="e.g. John Doe"
                  required
                />
                <InputField
                  label="Age"
                  value={passenger.age.toString()}
                  onChange={(v) => updatePassenger('age', Number(v) || 0)}
                  type="number"
                />
                <div>
                  <label className="label-text">Gender</label>
                  <select
                    value={passenger.gender}
                    onChange={(e) => updatePassenger('gender', e.target.value)}
                    className="input-field"
                  >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <InputField
                  label="Phone"
                  value={passenger.phone}
                  onChange={(v) => updatePassenger('phone', v)}
                  placeholder="e.g. +1 555-1234"
                />
                <InputField
                  label="Email"
                  value={passenger.email}
                  onChange={(v) => updatePassenger('email', v)}
                  placeholder="e.g. john@example.com"
                  type="email"
                />
                <InputField
                  label="Passport Number"
                  value={passenger.passport}
                  onChange={(v) => updatePassenger('passport', v)}
                  placeholder="e.g. P1234567"
                />
                <InputField
                  label="Government ID"
                  value={passenger.governmentId}
                  onChange={(v) => updatePassenger('governmentId', v)}
                  placeholder="e.g. Aadhar / SSN"
                />
                <InputField
                  label="Emergency Contact"
                  value={passenger.emergencyContact}
                  onChange={(v) => updatePassenger('emergencyContact', v)}
                  placeholder="e.g. Jane Doe +1 555-5678"
                />
                <InputField
                  label="Frequent Flyer Number"
                  value={passenger.frequentFlyerNumber}
                  onChange={(v) => updatePassenger('frequentFlyerNumber', v)}
                  placeholder="e.g. AI-FF-98765"
                />
                <div className="sm:col-span-2 lg:col-span-3">
                  <label className="label-text">Travel Preferences</label>
                  <textarea
                    value={passenger.travelPreferences}
                    onChange={(e) => updatePassenger('travelPreferences', e.target.value)}
                    placeholder="e.g. Window seat, vegetarian meal, prefer aisle for long flights"
                    className="input-field min-h-[80px] resize-y"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Save error */}
          {saveError && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-300">
              {saveError}
            </div>
          )}

          {/* Save button */}
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="btn-secondary gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="btn-primary gap-2"
            >
              {saving ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving…
                </span>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Trip
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Tab B — Import Booking */}
      {activeTab === 'import' && (
        <div className="space-y-6">
          {/* File upload */}
          <div className="card overflow-hidden">
            <div className="flex items-center gap-2 border-b border-surface-border px-5 py-3.5 dark:border-brand-800">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-800 dark:text-brand-300">
                <Upload className="h-4 w-4" />
              </div>
              <h2 className="text-sm font-semibold text-brand-900 dark:text-brand-100">
                Upload Booking Confirmation
              </h2>
            </div>
            <div className="p-5">
              <label
                htmlFor="file-upload"
                className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
                  importFile
                    ? 'border-brand-300 bg-brand-50/30 dark:border-brand-600 dark:bg-brand-900/30'
                    : 'border-surface-border hover:border-brand-300 dark:border-brand-700 dark:hover:border-brand-500'
                }`}
              >
                {importProcessing ? (
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
                    <div>
                      <p className="text-sm font-medium text-brand-800 dark:text-brand-200">
                        Processing…
                      </p>
                      <p className="mt-1 text-xs text-brand-500">
                        Extracting details from {importFile?.name}
                      </p>
                    </div>
                  </div>
                ) : importFile ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100 text-brand-600 dark:bg-brand-800 dark:text-brand-300">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-brand-800 dark:text-brand-200">
                        {importFile.name}
                      </p>
                      <p className="mt-1 text-xs text-brand-500">
                        {(importFile.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                    <p className="text-xs text-brand-400">
                      Upload again to replace
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-500 dark:bg-brand-800 dark:text-brand-300">
                      <Upload className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-brand-800 dark:text-brand-200">
                        Upload PDF, email, or boarding pass
                      </p>
                      <p className="mt-1 text-xs text-brand-500">
                        Drag and drop or click to browse
                      </p>
                    </div>
                    <span className="btn-secondary px-3 py-1.5 text-xs">
                      Choose file
                    </span>
                  </div>
                )}
              </label>
              <input
                id="file-upload"
                type="file"
                accept=".pdf,.png,.jpg,.jpeg,.eml"
                className="hidden"
                onChange={handleFileChange}
                disabled={importProcessing}
              />

              {importError && (
                <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:border-amber-900 dark:bg-amber-950/50 dark:text-amber-300">
                  {importError}
                </div>
              )}

              {parsedBooking && (
                <div className="mt-5 rounded-xl border border-surface-border p-4 dark:border-brand-700">
                  <div className="flex items-center justify-between gap-3"><div><p className="text-sm font-semibold text-brand-900 dark:text-brand-100">Review extracted details</p><p className="text-xs text-brand-500 dark:text-brand-400">OCR confidence: {parsedBooking.confidence}%{parsedBooking.missing.length ? ` · Missing: ${parsedBooking.missing.join(', ')}` : ''}</p></div></div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <InputField label="PNR" value={parsedBooking.flight.pnr} onChange={(v) => setParsedBooking((p) => p && { ...p, flight: { ...p.flight, pnr: v.toUpperCase() } })} />
                    <InputField label="Flight Number *" value={parsedBooking.flight.flightNumber} onChange={(v) => setParsedBooking((p) => p && { ...p, flight: { ...p.flight, flightNumber: v } })} />
                    <InputField label="Airline" value={parsedBooking.flight.airline} onChange={(v) => setParsedBooking((p) => p && { ...p, flight: { ...p.flight, airline: v } })} />
                    <InputField label="Passenger Name *" value={parsedBooking.passenger.name} onChange={(v) => setParsedBooking((p) => p && { ...p, passenger: { ...p.passenger, name: v } })} />
                    <InputField label="Departure Airport *" value={parsedBooking.flight.departureAirport} onChange={(v) => setParsedBooking((p) => p && { ...p, flight: { ...p.flight, departureAirport: v.toUpperCase() } })} />
                    <InputField label="Arrival Airport *" value={parsedBooking.flight.arrivalAirport} onChange={(v) => setParsedBooking((p) => p && { ...p, flight: { ...p.flight, arrivalAirport: v.toUpperCase() } })} />
                    <InputField label="Terminal" value={parsedBooking.flight.departureTerminal} onChange={(v) => setParsedBooking((p) => p && { ...p, flight: { ...p.flight, departureTerminal: v } })} />
                    <InputField label="Seat" value={parsedBooking.flight.seatAvailability} onChange={(v) => setParsedBooking((p) => p && { ...p, flight: { ...p.flight, seatAvailability: v } })} />
                  </div>
                  <button type="button" className="btn-primary mt-4" onClick={async () => { if (!parsedBooking.flight.flightNumber || !parsedBooking.flight.departureAirport || !parsedBooking.flight.arrivalAirport || !parsedBooking.passenger.name) { setImportError('Flight number, route, and passenger name are required before saving.'); return } if (parsedBooking.flight.fare < 0) { setImportError('Fare cannot be negative.'); return } await addTrip(parsedBooking.flight, parsedBooking.passenger, 'imported'); navigate('/dashboard') }}>Save imported trip</button>
                </div>
              )}

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-brand-400 dark:text-brand-500">
                <span>Supported: PDF, PNG, JPG, EML</span>
                <span className="text-brand-300 dark:text-brand-600">|</span>
                <span>Max 10 MB</span>
              </div>
            </div>
          </div>

          {/* PNR lookup */}
          <div className="card overflow-hidden">
            <div className="flex items-center gap-2 border-b border-surface-border px-5 py-3.5 dark:border-brand-800">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-800 dark:text-brand-300">
                <Search className="h-4 w-4" />
              </div>
              <h2 className="text-sm font-semibold text-brand-900 dark:text-brand-100">
                Or look up by PNR
              </h2>
            </div>
            <div className="p-5">
              <p className="mb-4 text-xs text-brand-500 dark:text-brand-400">
                Enter your PNR / booking reference to automatically fetch trip details
                (coming in a future phase).
              </p>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={pnrLookup}
                  onChange={(e) => setPnrLookup(e.target.value.toUpperCase())}
                  placeholder="Enter PNR…"
                  className="input-field flex-1 uppercase"
                  maxLength={10}
                />
                <button
                  type="button"
                  onClick={handlePnrSearch}
                  disabled={!pnrLookup.trim() || importProcessing}
                  className="btn-primary gap-2"
                >
                  {importProcessing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                  Look up
                </button>
              </div>
            </div>
          </div>

          {/* Divider with or */}
          <div className="flex items-center gap-3">
            <div className="flex-1 border-t border-surface-border dark:border-brand-800" />
            <span className="text-xs font-medium text-brand-400">seamless data entry</span>
            <div className="flex-1 border-t border-surface-border dark:border-brand-800" />
          </div>

          {/* After import info */}
          <div className="card p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-500 dark:bg-brand-800 dark:text-brand-300">
                <ArrowRight className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-brand-800 dark:text-brand-200">
                  Data flows everywhere automatically
                </p>
                <p className="mt-1 text-xs text-brand-500 dark:text-brand-400">
                  Once imported, trip details appear instantly on your Dashboard, in
                  Analytics charts, and can be queried by the AI Assistant.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  )
}

/* ─── local input helper ─── */
function InputField({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  required = false,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
  required?: boolean
}) {
  return (
    <div>
      <label className="label-text">
        {label}
        {required && <span className="ml-0.5 text-red-400">*</span>}
      </label>
      {type === 'textarea' ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="input-field min-h-[80px] resize-y"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(type === 'number' ? e.target.value : e.target.value)}
          placeholder={placeholder}
          className="input-field"
        />
      )}
    </div>
  )
}

