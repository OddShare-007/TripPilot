import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Eye, EyeOff, ShieldCheck, Bell, SlidersHorizontal, Sparkles } from 'lucide-react'
import AppLayout from '../components/AppLayout'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

function Contact() {
  return (
    <div className="space-y-2 text-sm text-brand-600 dark:text-brand-300">
      <a className="block hover:underline" href="tel:7385873811">Phone: 7385873811</a>
      <a className="block hover:underline" href="mailto:shubradeepjana2007@gmail.com">Email: shubradeepjana2007@gmail.com</a>
      <a className="block hover:underline" href="https://instagram.com/trip_pilot" target="_blank" rel="noreferrer">Instagram: @trip_pilot</a>
    </div>
  )
}

export function SettingsPage() {
  const { user, mode, setMode, updateProfile, updatePreferences } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [form, setForm] = useState({ fullName: '', email: '', age: '', profileInfo: '', travelPreferences: '' })
  const [notifications, setNotifications] = useState({ flightReminders: true, gateAlerts: true })
  const [password, setPassword] = useState('')
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [status, setStatus] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!user) return
    setForm({
      fullName: user.fullName ?? '',
      email: user.email ?? '',
      age: user.age ? String(user.age) : '',
      profileInfo: user.profileInfo ?? '',
      travelPreferences: user.preferences?.travelPreferences ?? '',
    })
    setNotifications(user.notifications ?? { flightReminders: true, gateAlerts: true })
  }, [user])

  const handleSave = async () => {
    if (!user) return
    const age = Number(form.age)
    if (Number.isNaN(age) || age < 1 || age > 120) {
      setStatus('Please enter a realistic age before saving.')
      return
    }
    setSaving(true)
    setStatus('')
    await updateProfile({ fullName: form.fullName.trim(), email: form.email.trim().toLowerCase(), age, profileInfo: form.profileInfo.trim() })
    await updatePreferences({ travelPreferences: form.travelPreferences.trim() })
    setSaving(false)
    setStatus('Profile updated successfully.')
  }

  const handleModeToggle = async (nextMode: 'demo' | 'real') => {
    await setMode(nextMode)
    setStatus(nextMode === 'demo' ? 'Switched to Demo Mode.' : 'Switched to Real Mode.')
  }

  return (
    <AppLayout title="Settings" subtitle="Manage your profile, privacy, and preferences">
      <div className="mx-auto max-w-4xl space-y-5">
        <section className="card p-5">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-brand-600" />
            <h2 className="text-sm font-semibold text-brand-900 dark:text-brand-100">Profile</h2>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="block text-sm">
              <span className="label-text">Full name</span>
              <input className="input-field" value={form.fullName} onChange={(event) => setForm((prev) => ({ ...prev, fullName: event.target.value }))} />
            </label>
            <label className="block text-sm">
              <span className="label-text">Email</span>
              <input className="input-field" value={form.email} onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))} />
            </label>
            <label className="block text-sm">
              <span className="label-text">Age</span>
              <input className="input-field" type="number" min="1" max="120" value={form.age} onChange={(event) => setForm((prev) => ({ ...prev, age: event.target.value }))} />
            </label>
            <label className="block text-sm md:col-span-2">
              <span className="label-text">Profile info</span>
              <textarea className="input-field min-h-[90px]" value={form.profileInfo} onChange={(event) => setForm((prev) => ({ ...prev, profileInfo: event.target.value }))} />
            </label>
          </div>
          <div className="mt-4 flex items-center justify-end">
            <button className="btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving…' : 'Save profile'}</button>
          </div>
        </section>

        <section className="card p-5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-brand-600" />
            <h2 className="text-sm font-semibold text-brand-900 dark:text-brand-100">Security</h2>
          </div>
          <div className="mt-4 max-w-md">
            <label className="block text-sm">
              <span className="label-text">Change password</span>
              <div className="relative">
                <input className="input-field pr-10" type={passwordVisible ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Set a new password" />
                <button type="button" onClick={() => setPasswordVisible((value) => !value)} className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-400" aria-label={passwordVisible ? 'Hide password' : 'Show password'}>
                  {passwordVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </label>
            <p className="mt-2 text-xs text-brand-500 dark:text-brand-400">Password updates are mocked in this demo and will be wired to a real backend later.</p>
            <div className="mt-4 flex justify-end">
              <button className="btn-secondary" onClick={() => setStatus('Password change was simulated for this demo.')}>Save password</button>
            </div>
          </div>
        </section>

        <section className="card p-5">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-brand-600" />
            <h2 className="text-sm font-semibold text-brand-900 dark:text-brand-100">App preferences</h2>
          </div>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <div className="rounded-xl border border-surface-border p-4 dark:border-brand-800">
              <p className="text-sm font-medium text-brand-900 dark:text-brand-100">Mode</p>
              <div className="mt-3 flex items-center gap-2">
                <button className={`btn-secondary px-3 py-2 text-sm ${mode === 'demo' ? 'bg-brand-600 text-white hover:bg-brand-700' : ''}`} onClick={() => handleModeToggle('demo')}>Demo Mode</button>
                <button className={`btn-secondary px-3 py-2 text-sm ${mode === 'real' ? 'bg-brand-600 text-white hover:bg-brand-700' : ''}`} onClick={() => handleModeToggle('real')}>Real Mode</button>
              </div>
            </div>
            <div className="rounded-xl border border-surface-border p-4 dark:border-brand-800">
              <p className="text-sm font-medium text-brand-900 dark:text-brand-100">Theme</p>
              <div className="mt-3 flex items-center gap-2">
                <button className={`btn-secondary px-3 py-2 text-sm ${theme === 'light' ? 'bg-brand-600 text-white hover:bg-brand-700' : ''}`} onClick={() => theme !== 'light' && toggleTheme()}>Light</button>
                <button className={`btn-secondary px-3 py-2 text-sm ${theme === 'dark' ? 'bg-brand-600 text-white hover:bg-brand-700' : ''}`} onClick={() => theme !== 'dark' && toggleTheme()}>Dark</button>
              </div>
            </div>
            <label className="block text-sm lg:col-span-2">
              <span className="label-text">Travel preferences</span>
              <textarea className="input-field min-h-[90px]" value={form.travelPreferences} onChange={(event) => setForm((prev) => ({ ...prev, travelPreferences: event.target.value }))} />
            </label>
          </div>
        </section>

        <section className="card p-5">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-brand-600" />
            <h2 className="text-sm font-semibold text-brand-900 dark:text-brand-100">Notifications</h2>
          </div>
          <div className="mt-4 space-y-3">
            {[
              ['Flight reminders', 'flightReminders'],
              ['Gate alerts', 'gateAlerts'],
            ].map(([label, key]) => (
              <label key={key} className="flex items-center justify-between rounded-lg border border-surface-border px-4 py-3 dark:border-brand-800">
                <span className="text-sm text-brand-700 dark:text-brand-200">{label}</span>
                <input type="checkbox" checked={notifications[key as keyof typeof notifications]} onChange={() => setNotifications((prev) => ({ ...prev, [key]: !prev[key as keyof typeof prev] }))} className="h-4 w-4 rounded border-brand-300 text-brand-600 focus:ring-brand-500" />
              </label>
            ))}
          </div>
        </section>

        <section className="card p-5">
          <h2 className="text-sm font-semibold text-brand-900 dark:text-brand-100">Help & support</h2>
          <p className="mt-2 text-sm text-brand-500 dark:text-brand-400">Need help or want to learn more about TripPilot?</p>
          <Link className="mt-4 inline-flex items-center rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white" to="/help">Open help center</Link>
        </section>

        {status && <div className="rounded-lg border border-brand-200 bg-brand-50 px-4 py-3 text-sm text-brand-700 dark:border-brand-800 dark:bg-brand-900/50 dark:text-brand-200">{status}</div>}
      </div>
    </AppLayout>
  )
}

export function HelpPage() {
  return (
    <AppLayout title="Help" subtitle="Answers to the most common TripPilot questions">
      <div className="mx-auto max-w-4xl space-y-5">
        <section className="card p-5">
          <h2 className="text-sm font-semibold text-brand-900 dark:text-brand-100">Frequently asked questions</h2>
          <div className="mt-4 space-y-4 text-sm text-brand-600 dark:text-brand-300">
            <div><p className="font-semibold text-brand-900 dark:text-brand-100">What does Demo Mode mean?</p><p className="mt-1">Demo Mode is a safe sandbox for trying the app with sample trips and passengers without affecting your real travel data.</p></div>
            <div><p className="font-semibold text-brand-900 dark:text-brand-100">How do I add a trip?</p><p className="mt-1">Open Add Trip Data, choose Manual Entry, complete the flight and passenger details, and save the trip.</p></div>
            <div><p className="font-semibold text-brand-900 dark:text-brand-100">How does booking import work?</p><p className="mt-1">Upload a booking PDF, image, or email text. TripPilot extracts likely values for review before saving.</p></div>
            <div><p className="font-semibold text-brand-900 dark:text-brand-100">Does TripPilot book flights for me?</p><p className="mt-1">No. TripPilot is an AI travel management assistant that helps you organize and understand bookings made elsewhere.</p></div>
            <div><p className="font-semibold text-brand-900 dark:text-brand-100">Can I switch between Demo Mode and Real Mode?</p><p className="mt-1">Yes. The app keeps each mode on a separate data set so demo and real trips do not mix.</p></div>
            <div><p className="font-semibold text-brand-900 dark:text-brand-100">Where do my trips appear?</p><p className="mt-1">Synced trips show up on the dashboard, analytics, schedule, and AI assistant automatically once saved.</p></div>
          </div>
        </section>

        <section className="card p-5">
          <h2 className="text-sm font-semibold text-brand-900 dark:text-brand-100">Contact support</h2>
          <div className="mt-3 text-sm text-brand-600 dark:text-brand-300">
            <Contact />
          </div>
        </section>
      </div>
    </AppLayout>
  )
}

export function AboutPage() {
  return (
    <AppLayout title="About TripPilot" subtitle="Your AI travel management assistant">
      <div className="mx-auto max-w-4xl space-y-5">
        <section className="card p-5">
          <h2 className="text-sm font-semibold text-brand-900 dark:text-brand-100">What is TripPilot?</h2>
          <p className="mt-2 text-sm text-brand-600 dark:text-brand-300">TripPilot is not a booking platform and does not sell tickets. It is an AI-powered travel management assistant that sits on top of your existing bookings, helps you organize them in one place, and answers questions about your journeys in plain language.</p>
        </section>
        <section className="card p-5">
          <h2 className="text-sm font-semibold text-brand-900 dark:text-brand-100">Mission & vision</h2>
          <p className="mt-2 text-sm text-brand-600 dark:text-brand-300">TripPilot makes travel information less chaotic and easier to manage by bringing your flights, passengers, preferences, and trip details together into a calm, intelligent workspace.</p>
        </section>
        <section className="card p-5">
          <h2 className="text-sm font-semibold text-brand-900 dark:text-brand-100">Contact</h2>
          <div className="mt-3 text-sm text-brand-600 dark:text-brand-300">
            <Contact />
          </div>
        </section>
      </div>
    </AppLayout>
  )
}
