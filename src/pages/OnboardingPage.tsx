import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Briefcase,
  Users,
  GraduationCap,
  Plane,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react'
import TopNav from '../components/TopNav'
import { useAuth } from '../context/AuthContext'
import type { TravellerType } from '../types'

const travellerTypes = [
  {
    id: 'business' as TravellerType,
    label: 'Business Traveller',
    description: 'Regular work trips, meetings, and conferences',
    icon: Briefcase,
  },
  {
    id: 'family' as TravellerType,
    label: 'Family',
    description: 'Vacations and trips with loved ones',
    icon: Users,
  },
  {
    id: 'student' as TravellerType,
    label: 'Student',
    description: 'Budget-friendly travel for study and adventure',
    icon: GraduationCap,
  },
  {
    id: 'frequent' as TravellerType,
    label: 'Frequent Flyer',
    description: 'Always on the move, loyalty programs matter',
    icon: Plane,
  },
]

const priorities = [
  {
    id: 'price' as const,
    label: 'Price',
    description: 'I look for the best deals',
  },
  {
    id: 'speed' as const,
    label: 'Speed',
    description: 'I prefer the shortest travel time',
  },
  {
    id: 'comfort' as const,
    label: 'Comfort',
    description: 'I value premium experiences',
  },
]

export default function OnboardingPage() {
  const navigate = useNavigate()
  const { completeOnboarding } = useAuth()

  const [step, setStep] = useState(1)
  const [selectedType, setSelectedType] = useState<TravellerType | null>(null)
  const [selectedPriority, setSelectedPriority] = useState<
    'price' | 'speed' | 'comfort' | null
  >(null)

  const handleFinish = () => {
    if (selectedType && selectedPriority) {
      completeOnboarding(selectedType, selectedPriority)
      navigate('/dashboard', { replace: true })
    }
  }

  return (
    <div className="min-h-screen bg-surface-muted dark:bg-brand-950">
      <TopNav showAuthLinks={false} />

      <main className="mx-auto max-w-2xl px-4 py-12">
        {/* Progress bar */}
        <div className="mb-8">
          <p className="text-sm font-medium text-brand-500 dark:text-brand-400">
            Step {step} of 2
          </p>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-brand-100 dark:bg-brand-800">
            <div
              className="h-full rounded-full bg-brand-600 transition-all duration-500 ease-out"
              style={{ width: `${step * 50}%` }}
            />
          </div>
        </div>

        {/* Step 1 — Traveller type */}
        {step === 1 && (
          <div className="card p-8">
            <h1 className="text-2xl font-semibold tracking-tight text-brand-950 dark:text-brand-50">
              What kind of traveller are you?
            </h1>
            <p className="mt-2 text-sm text-brand-500 dark:text-brand-400">
              We&apos;ll tailor your dashboard based on how you travel. You can change
              this later.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {travellerTypes.map(({ id, label, description, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setSelectedType(id)}
                  className={`group flex flex-col items-start rounded-xl border p-4 text-left transition-all focus:outline-none focus:ring-2 ${
                    selectedType === id
                      ? 'border-brand-400 bg-brand-50/60 ring-2 ring-brand-200 dark:border-brand-500 dark:bg-brand-800/60 dark:ring-brand-700'
                      : 'border-surface-border bg-surface hover:border-brand-300 hover:bg-brand-50/40 dark:border-brand-700 dark:bg-brand-900 dark:hover:border-brand-500'
                  }`}
                >
                  <div
                    className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${
                      selectedType === id
                        ? 'bg-brand-100 text-brand-700 dark:bg-brand-700 dark:text-brand-200'
                        : 'bg-brand-50 text-brand-600 group-hover:bg-brand-100 dark:bg-brand-800 dark:text-brand-300'
                    }`}
                  >
                    <Icon className="h-5 w-5" strokeWidth={2} />
                  </div>
                  <span className="text-sm font-semibold text-brand-900 dark:text-brand-100">
                    {label}
                  </span>
                  <span className="mt-1 text-xs text-brand-500 dark:text-brand-400">
                    {description}
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-8 flex items-center justify-between border-t border-surface-border pt-6 dark:border-brand-800">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="btn-secondary gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
              <button
                type="button"
                disabled={!selectedType}
                onClick={() => setStep(2)}
                className="btn-primary gap-2"
              >
                Continue
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2 — Priority */}
        {step === 2 && (
          <div className="card p-8">
            <h1 className="text-2xl font-semibold tracking-tight text-brand-950 dark:text-brand-50">
              What matters most to you?
            </h1>
            <p className="mt-2 text-sm text-brand-500 dark:text-brand-400">
              This helps us highlight the information that&apos;s most relevant to you.
            </p>

            <div className="mt-8 grid gap-3">
              {priorities.map(({ id, label, description }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setSelectedPriority(id)}
                  className={`group flex items-center gap-4 rounded-xl border p-4 text-left transition-all focus:outline-none focus:ring-2 ${
                    selectedPriority === id
                      ? 'border-brand-400 bg-brand-50/60 ring-2 ring-brand-200 dark:border-brand-500 dark:bg-brand-800/60 dark:ring-brand-700'
                      : 'border-surface-border bg-surface hover:border-brand-300 hover:bg-brand-50/40 dark:border-brand-700 dark:bg-brand-900 dark:hover:border-brand-500'
                  }`}
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm font-bold transition-colors ${
                      selectedPriority === id
                        ? 'bg-brand-100 text-brand-700 dark:bg-brand-700 dark:text-brand-200'
                        : 'bg-brand-50 text-brand-600 dark:bg-brand-800 dark:text-brand-300'
                    }`}
                  >
                    {label[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-brand-900 dark:text-brand-100">
                      {label}
                    </p>
                    <p className="mt-0.5 text-xs text-brand-500 dark:text-brand-400">
                      {description}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-8 flex items-center justify-between border-t border-surface-border pt-6 dark:border-brand-800">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="btn-secondary gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
              <button
                type="button"
                disabled={!selectedPriority}
                onClick={handleFinish}
                className="btn-primary gap-2"
              >
                Finish setup
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

