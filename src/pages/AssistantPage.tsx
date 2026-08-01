import { FormEvent, useState } from 'react'
import { MessageSquare, Send } from 'lucide-react'
import AppLayout from '../components/AppLayout'
import { useTrips } from '../context/TripContext'
import type { Trip } from '../types'

type Message = { role: 'user' | 'assistant'; text: string; searched?: boolean }
function contextFor(trips: Trip[]) { return trips.map((t) => ({ flight: t.flight.flightNumber, airline: t.flight.airline, route: `${t.flight.departureAirport}-${t.flight.arrivalAirport}`, departure: t.flight.departureTime, status: t.flight.flightStatus, fare: t.flight.fare, passenger: t.passenger.name, pnr: t.flight.pnr })).slice(0, 30) }

export default function AssistantPage() {
  const { trips } = useTrips(); const [question, setQuestion] = useState(''); const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([{ role: 'assistant', text: 'Ask about your saved trips, or ask for current flight information.' }])
  const submit = async (event: FormEvent) => { event.preventDefault(); const text = question.trim(); if (!text || loading) return
    setQuestion(''); setLoading(true); setMessages((m) => [...m, { role: 'user', text }])
    try { const response = await fetch('/api/assistant', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ question: text, trips: contextFor(trips) }) }); const result = await response.json() as { answer?: string; searched?: boolean; error?: string }; if (!response.ok) throw new Error(result.error || 'The assistant could not respond.'); setMessages((m) => [...m, { role: 'assistant', text: result.answer || 'No response received.', searched: result.searched }]) }
    catch (error) { setMessages((m) => [...m, { role: 'assistant', text: error instanceof Error ? error.message : 'The assistant could not respond. Check your connection and API configuration.' }]) }
    finally { setLoading(false) }
  }
  return <AppLayout title="AI Assistant" subtitle="Uses your saved trips and searches the web for live information">
    <div className="card mx-auto flex min-h-[480px] max-w-3xl flex-col overflow-hidden"><div className="flex items-center gap-2 border-b border-surface-border px-5 py-4 dark:border-brand-800"><MessageSquare className="h-4 w-4 text-brand-600 dark:text-brand-300" /><p className="text-sm font-semibold text-brand-900 dark:text-brand-100">TripPilot Assistant</p></div>
      <div className="flex-1 space-y-3 p-5">{messages.map((message, index) => <div key={`${message.role}-${index}`} className={`max-w-[85%] rounded-xl px-4 py-3 text-sm ${message.role === 'user' ? 'ml-auto bg-brand-600 text-white' : 'bg-brand-50 text-brand-800 dark:bg-brand-800 dark:text-brand-100'}`}>{message.text}{message.searched && <span className="mt-2 block w-fit rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-medium text-brand-700 dark:bg-brand-700 dark:text-brand-100">Searched the web</span>}</div>)}{loading && <div className="w-fit rounded-xl bg-brand-50 px-4 py-3 text-sm text-brand-600 dark:bg-brand-800 dark:text-brand-200">Thinking…</div>}</div>
      <form onSubmit={submit} className="flex gap-3 border-t border-surface-border p-4 dark:border-brand-800"><input value={question} onChange={(e) => setQuestion(e.target.value)} className="input-field" placeholder="e.g. Is my flight delayed today?" aria-label="Ask the AI assistant" /><button className="btn-primary px-3" type="submit" disabled={loading} aria-label="Send question"><Send className="h-4 w-4" /></button></form>
    </div>
  </AppLayout>
}
