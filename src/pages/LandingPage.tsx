import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plane, ArrowRight, Sparkles, ShieldCheck, Bot } from 'lucide-react'
import TopNav from '../components/TopNav'

export default function LandingPage() {
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    setAnimate(true)
  }, [])

  return (
    <div className="min-h-screen bg-surface-muted dark:bg-brand-950">
      <TopNav showAuthLinks />

      <main className="mx-auto flex max-w-5xl flex-col items-center justify-center px-4 py-20 text-center sm:py-28">
        <div className={`mb-6 flex items-center justify-center transition-all duration-700 ease-out ${animate ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}>
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-lg shadow-brand-200/50 dark:shadow-brand-950">
            <Plane className="h-8 w-8" strokeWidth={2} />
          </div>
        </div>

        <h1 className={`text-4xl font-bold tracking-tight text-brand-950 transition-all delay-150 duration-700 ease-out dark:text-brand-50 sm:text-5xl ${animate ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}>
          TripPilot
        </h1>
        <p className={`mt-4 max-w-2xl text-lg text-brand-500 transition-all delay-300 duration-700 ease-out dark:text-brand-400 ${animate ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}>
          Your AI-powered travel management assistant. Keep every booking, passenger, and preference organized in one calm workspace.
        </p>

        <div className={`mt-10 flex flex-col items-center gap-4 transition-all delay-500 duration-700 ease-out sm:flex-row ${animate ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}>
          <Link to="/signup" className="btn-primary gap-2 px-6 py-3 text-base">
            Get Started
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/login" className="btn-secondary gap-2 px-6 py-3 text-base">
            Sign in
          </Link>
        </div>

        <div className={`mt-14 grid gap-4 text-left md:grid-cols-3 ${animate ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}>
          <div className="card p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-800 dark:text-brand-300"><Sparkles className="h-5 w-5" /></div>
            <p className="mt-3 text-sm font-semibold text-brand-900 dark:text-brand-100">One intelligent dashboard</p>
            <p className="mt-1 text-sm text-brand-500 dark:text-brand-400">See upcoming, current, past, and cancelled trips at a glance.</p>
          </div>
          <div className="card p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-800 dark:text-brand-300"><Bot className="h-5 w-5" /></div>
            <p className="mt-3 text-sm font-semibold text-brand-900 dark:text-brand-100">AI travel guidance</p>
            <p className="mt-1 text-sm text-brand-500 dark:text-brand-400">Ask about your journeys and get instant, plain-language answers.</p>
          </div>
          <div className="card p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-800 dark:text-brand-300"><ShieldCheck className="h-5 w-5" /></div>
            <p className="mt-3 text-sm font-semibold text-brand-900 dark:text-brand-100">Secure and structured</p>
            <p className="mt-1 text-sm text-brand-500 dark:text-brand-400">Your data is stored separately for Demo Mode and Real Mode so you can explore safely.</p>
          </div>
        </div>
      </main>
    </div>
  )
}

