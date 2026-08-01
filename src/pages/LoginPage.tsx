import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, ArrowRight } from 'lucide-react'
import TopNav from '../components/TopNav'
import PasswordField from '../components/PasswordField'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const navigate = useNavigate()
  const { signIn, user } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isValid = useMemo(
    () => email.trim().length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) && password.length >= 1,
    [email, password],
  )

  useEffect(() => {
    if (!user) return
    if (user.preferences?.onboardingCompleted) {
      navigate('/dashboard', { replace: true })
    } else {
      navigate('/onboarding', { replace: true })
    }
  }, [user, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid || isSubmitting) return

    setIsSubmitting(true)
    setError('')

    const result = await signIn(email.trim(), password)
    if (!result.success) {
      setError(result.error || 'We could not sign you in. Please try again.')
    }
    setIsSubmitting(false)
  }

  return (
    <div className="min-h-screen bg-surface-muted dark:bg-brand-950">
      <TopNav />

      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="card w-full max-w-md p-8">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-brand-950 dark:text-brand-50">Welcome back</h1>
            <p className="mt-2 text-sm text-brand-500 dark:text-brand-400">Sign in to manage your trips in one place.</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
            <div>
              <label htmlFor="login-email" className="label-text">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-400" />
                <input id="login-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" autoComplete="email" className="input-field pl-10" />
              </div>
            </div>

            <PasswordField id="login-password" label="Password" value={password} onChange={setPassword} autoComplete="current-password" />

            {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-300">{error}</div>}

            <button type="submit" disabled={!isValid || isSubmitting} className="btn-primary w-full gap-2">
              {isSubmitting ? <span className="flex items-center gap-2"><div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />Signing in…</span> : <><span>Sign in</span><ArrowRight className="h-4 w-4" /></>}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-brand-500 dark:text-brand-400">Don&apos;t have an account? <Link to="/signup" className="font-medium text-brand-600 hover:text-brand-800 dark:text-brand-300 dark:hover:text-brand-100">Get started</Link></p>
        </div>
      </main>
    </div>
  )
}

