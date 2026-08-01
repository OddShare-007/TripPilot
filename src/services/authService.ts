import type { TravellerType, TravelPriority, User, UserPreferences } from '../types'
import { readStorage, writeStorage, removeStorage, STORAGE_KEYS } from '../lib/storage'
import { databaseService, type Mode } from './databaseService'

export interface AuthResult {
  success: boolean
  user?: User
  error?: string
}

function getCurrentMode(): Mode {
  return readStorage<Mode>(STORAGE_KEYS.mode, 'demo')
}

function setCurrentMode(mode: Mode): void {
  writeStorage(STORAGE_KEYS.mode, mode)
}

export const authService = {
  async signUp(
    email: string,
    password: string,
    fullName = '',
    age?: number,
    mode: Mode = getCurrentMode(),
  ): Promise<AuthResult> {
    const normalized = email.trim().toLowerCase()
    if (!normalized || !password) {
      return { success: false, error: 'Email and password are required.' }
    }
    const result = await databaseService.signUp(email, password, fullName, age ?? 0, mode)
    if (result.success && result.user) {
      setCurrentMode(result.user.mode ?? mode)
      writeStorage(STORAGE_KEYS.session, { userId: result.user.id })
    }
    return result
  },

  async signIn(email: string, password: string, mode: Mode = getCurrentMode()): Promise<AuthResult> {
    const result = await databaseService.signIn(email, password, mode)
    if (result.success && result.user) {
      setCurrentMode(result.user.mode ?? mode)
      writeStorage(STORAGE_KEYS.session, { userId: result.user.id })
    }
    return result
  },

  async signOut(mode: Mode = getCurrentMode()): Promise<void> {
    removeStorage(`${mode}_session`)
  },

  async getCurrentUser(mode: Mode = getCurrentMode()): Promise<User | null> {
    return databaseService.getCurrentUser(mode)
  },

  async updatePreferences(userId: string, prefs: Partial<UserPreferences>, mode: Mode = getCurrentMode()): Promise<User | null> {
    return databaseService.setUserPreferences(userId, prefs, mode)
  },

  async saveOnboarding(
    userId: string,
    travellerType: TravellerType,
    priority: TravelPriority,
    mode: Mode = getCurrentMode(),
  ): Promise<User | null> {
    return authService.updatePreferences(
      userId,
      {
        travellerType,
        priority,
        onboardingCompleted: true,
      },
      mode,
    )
  },

  async updateProfile(userId: string, updates: Partial<User>, mode: Mode = getCurrentMode()): Promise<User | null> {
    return databaseService.updateUserProfile(userId, updates, mode)
  },

  async setMode(mode: Mode): Promise<Mode> {
    setCurrentMode(mode)
    return mode
  },

  async getMode(): Promise<Mode> {
    return getCurrentMode()
  },

  async seedDemoData(): Promise<void> {
    await databaseService.seedDemoData()
  },
}
