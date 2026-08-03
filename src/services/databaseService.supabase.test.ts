import { describe, expect, it } from 'vitest'

function generatePassengerCode(existing: Array<{ passenger_code?: string | null }>): string {
  const numbers = existing
    .map((item) => item.passenger_code)
    .filter((value): value is string => Boolean(value))
    .map((value) => Number(value.replace(/^PSG-/, '')))
    .filter((value) => Number.isFinite(value))

  const nextNumber = numbers.length ? Math.max(...numbers) + 1 : 1
  return `PSG-${String(nextNumber).padStart(4, '0')}`
}

describe('generatePassengerCode', () => {
  it('creates the next PSG code from existing rows', () => {
    expect(generatePassengerCode([{ passenger_code: 'PSG-0001' }, { passenger_code: 'PSG-0010' }])).toBe('PSG-0011')
  })

  it('starts at PSG-0001 when no rows exist', () => {
    expect(generatePassengerCode([])).toBe('PSG-0001')
  })
})
