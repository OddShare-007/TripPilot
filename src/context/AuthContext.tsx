import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react'
import type { User, UserPreferences, TravellerType, TravelPriority } from '../types'
import { authService } from '../services/authService'
import type { Mode } from '../services/databaseService'

interface AuthContextValue {
  user: User | null
  isLoading: boolean
  mode: Mode
  setMode: (mode: Mode) => Promise<void>
  signUp: (email: string, password: string, fullName?: string, age?: number) => Promise<{ success: boolean; error?: string }>
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signOut: () => Promise<void>
  completeOnboarding: (travellerType: TravellerType, priority: TravelPriority) => Promise<void>
  updatePreferences: (prefs: Partial<UserPreferences>) => Promise<void>
  updateProfile: (updates: Partial<User>) => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [mode, setModeState] = useState<Mode>('demo')

  useEffect(() => {
    void (async () => {
      const currentMode = await authService.getMode()
      setModeState(currentMode)
      const currentUser = await authService.getCurrentUser(currentMode)
      setUser(currentUser)
      setIsLoading(false)
    })()
  }, [])

  const signUp = useCallback(async (email: string, password: string, fullName = '', age?: number) => {
    const result = await authService.signUp(email, password, fullName, age, mode)
    if (result.success && result.user) {
      setUser(result.user)
      setModeState(result.user.mode ?? mode)
    }
    return { success: result.success, error: result.error }
  }, [mode])

  const signIn = useCallback(async (email: string, password: string) => {
    const result = await authService.signIn(email, password, mode)
    if (result.success && result.user) {
      setUser(result.user)
      setModeState(result.user.mode ?? mode)
    }
    return { success: result.success, error: result.error }
  }, [mode])

  const signOut = useCallback(async () => {
    await authService.signOut(mode)
    setUser(null)
  }, [mode])

  const completeOnboarding = useCallback(
    async (travellerType: TravellerType, priority: TravelPriority) => {
      if (!user) return
      const updated = await authService.saveOnboarding(user.id, travellerType, priority, mode)
      if (updated) setUser(updated)
    },
    [user, mode],
  )

  const updatePreferences = useCallback(
    async (prefs: Partial<UserPreferences>) => {
      if (!user) return
      const updated = await authService.updatePreferences(user.id, prefs, mode)
      if (updated) setUser(updated)
    },
    [user, mode],
  )

  const updateProfile = useCallback(
    async (updates: Partial<User>) => {
      if (!user) return
      const updated = await authService.updateProfile(user.id, updates, mode)
      if (updated) setUser(updated)
    },
    [user, mode],
  )

  const setMode = useCallback(async (nextMode: Mode) => {
    await authService.setMode(nextMode)
    setModeState(nextMode)
    const currentUser = await authService.getCurrentUser(nextMode)
    setUser(currentUser)
  }, [])

  return (
    <AuthContext.Provider
      value={{ user, isLoading, mode, setMode, signUp, signIn, signOut, completeOnboarding, updatePreferences, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
