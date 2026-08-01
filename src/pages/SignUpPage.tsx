import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, ArrowRight, UserRound, Cake } from 'lucide-react'
import TopNav from '../components/TopNav'
import PasswordField from '../components/PasswordField'
import { useAuth } from '../context/AuthContext'

export default function SignUpPage() {
  const navigate = useNavigate()
  const { signUp } = useAuth()

  const [fullName, setFullName] = useState('')
  const [age, setAge] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validationErrors = useMemo(() => {
    const errors: { fullName?: string; age?: string; email?: string; password?: string; confirm?: string } = {}

    if (fullName.trim().length < 2) {
      errors.fullName = 'Please enter your full name.'
    }

    if (age) {
      const parsedAge = Number(age)
      if (Number.isNaN(parsedAge) || parsedAge < 1 || parsedAge > 120) {
        errors.age = 'Please enter a realistic age.'
      }
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = 'Please enter a valid email address.'
    }

    if (password && password.length < 6) {
      errors.password = 'Password must be at least 6 characters.'
    }

    if (confirmPassword && password !== confirmPassword) {
      errors.confirm = 'Passwords do not match.'
    }

    return errors
  }, [age, email, fullName, password, confirmPassword])

  const isValid =
    fullName.trim().length >= 2 &&
    Number(age) > 0 &&
    Number(age) <= 120 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) &&
    password.length >= 6 &&
    password === confirmPassword

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid || isSubmitting) return

    setIsSubmitting(true)
    setError('')

    const result = await signUp(email.trim(), password, fullName.trim(), Number(age))
    if (result.success) {
      navigate('/onboarding', { replace: true })
    } else {
      setError(result.error || 'Something went wrong. Please try again.')
    }
    setIsSubmitting(false)
  }

  return (
    <div className="min-h-screen bg-surface-muted dark:bg-brand-950">
      <TopNav />

      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="card w-full max-w-md p-8">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-brand-950 dark:text-brand-50">Create your account</h1>
            <p className="mt-2 text-sm text-brand-500 dark:text-brand-400">Start your TripPilot workspace in just a moment.</p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit} noValidate>
            <div>
              <label htmlFor="signup-name" className="label-text">Full name</label>
              <div className="relative">
                <UserRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-400" />
                <input id="signup-name" value={fullName} onChange={(event) => setFullName(event.target.value)} className={`input-field pl-10 ${validationErrors.fullName && fullName ? 'input-field-error' : ''}`} placeholder="Alex Rivera" autoComplete="name" />
              </div>
              {validationErrors.fullName && fullName && <p className="error-text">{validationErrors.fullName}</p>}
            </div>

            <div>
              <label htmlFor="signup-age" className="label-text">Age</label>
              <div className="relative">
                <Cake className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-400" />
                <input id="signup-age" type="number" min="1" max="120" value={age} onChange={(event) => setAge(event.target.value)} className={`input-field pl-10 ${validationErrors.age && age ? 'input-field-error' : ''}`} placeholder="30" />
              </div>
              {validationErrors.age && age && <p className="error-text">{validationErrors.age}</p>}
            </div>

            <div>
              <label htmlFor="signup-email" className="label-text">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-400" />
                <input id="signup-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" autoComplete="email" className={`input-field pl-10 ${validationErrors.email && email ? 'input-field-error' : ''}`} />
              </div>
              {validationErrors.email && email && <p className="error-text">{validationErrors.email}</p>}
            </div>

            <PasswordField id="signup-password" label="Password" value={password} onChange={setPassword} autoComplete="new-password" error={validationErrors.password && password ? validationErrors.password : undefined} />
            <PasswordField id="signup-confirm" label="Confirm password" value={confirmPassword} onChange={setConfirmPassword} placeholder="••••••••" autoComplete="new-password" error={validationErrors.confirm && confirmPassword ? validationErrors.confirm : undefined} />

            {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-300">{error}</div>}

            <button type="submit" disabled={!isValid || isSubmitting} className="btn-primary w-full gap-2">
              {isSubmitting ? <span className="flex items-center gap-2"><div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />Creating account…</span> : <><span>Create account</span><ArrowRight className="h-4 w-4" /></>}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-brand-500 dark:text-brand-400">Already have an account? <Link to="/login" className="font-medium text-brand-600 hover:text-brand-800 dark:text-brand-300 dark:hover:text-brand-100">Log in</Link></p>
        </div>
      </main>
    </div>
  )
}

