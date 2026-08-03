const PREFIX = 'trippilot:'

export interface AuthSession {
  userId: string
  email: string
  mode: string
  isLoggedIn: boolean
}

export function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function writeStorage<T>(key: string, value: T): void {
  localStorage.setItem(PREFIX + key, JSON.stringify(value))
}

export function removeStorage(key: string): void {
  localStorage.removeItem(PREFIX + key)
}

export function readAuthSession(): AuthSession | null {
  const session = readStorage<AuthSession | null>(STORAGE_KEYS.session, null)
  return session?.isLoggedIn ? session : null
}

export function writeAuthSession(session: AuthSession): void {
  writeStorage(STORAGE_KEYS.session, session)
}

export function clearAuthSession(mode?: string): void {
  removeStorage(STORAGE_KEYS.session)
  if (mode) {
    removeStorage(`${mode}_session`)
  }
}

export const STORAGE_KEYS = {
  users: 'users',
  session: 'session',
  trips: 'trips',
  theme: 'theme',
  mode: 'mode',
} as const
