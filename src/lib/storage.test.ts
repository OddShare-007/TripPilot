// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest'
import { clearAuthSession, readAuthSession, STORAGE_KEYS, writeAuthSession } from './storage'

describe('auth session persistence', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('persists and restores the logged-in user session', () => {
    writeAuthSession({ userId: 'user-1', email: 'user@example.com', mode: 'demo', isLoggedIn: true })

    expect(readAuthSession()).toEqual({
      userId: 'user-1',
      email: 'user@example.com',
      mode: 'demo',
      isLoggedIn: true,
    })
    expect(localStorage.getItem(`trippilot:${STORAGE_KEYS.session}`)).toBeTruthy()
  })

  it('removes the persisted session on sign out', () => {
    writeAuthSession({ userId: 'user-1', email: 'user@example.com', mode: 'demo', isLoggedIn: true })

    clearAuthSession('demo')

    expect(readAuthSession()).toBeNull()
  })
})
