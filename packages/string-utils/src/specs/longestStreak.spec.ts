import { longestStreak } from '../lib'

describe('longestStreak(value, character)', () => {
  it('should throw when character is invalid (too long string)', () => {
    expect(() => {
      longestStreak('tango', 'incorrect')
    }).toThrowError(/Expected character/)
  })

  it('should work (1)', () => {
    expect(longestStreak('', 'f')).toBe(0)
  })

  it('should work (2)', () => {
    expect(longestStreak('foo', 'o')).toBe(2)
  })

  it('should work (3)', () => {
    expect(longestStreak('fo foo fo', 'o')).toBe(2)
  })

  it('should work (4)', () => {
    expect(longestStreak('fo foo foo', 'o')).toBe(2)
  })

  it('should work (5)', () => {
    expect(longestStreak('fo fooo fo', 'o')).toBe(3)
  })

  it('should work (6)', () => {
    expect(longestStreak('fo fooo foo', 'o')).toBe(3)
  })

  it('should work (7)', () => {
    expect(longestStreak('ooo', 'o')).toBe(3)
  })

  it('should work (8)', () => {
    expect(longestStreak('fo fooo fooooo', 'o')).toBe(5)
  })

  it('should work (9)', () => {
    expect(longestStreak('fo fooooo fooo', 'o')).toBe(5)
  })

  it('should work (10)', () => {
    expect(longestStreak('fo fooooo fooooo', 'o')).toBe(5)
  })

  it('should match on one', () => {
    expect(longestStreak('\'`\'', '`')).toBe(1)
  })
})
