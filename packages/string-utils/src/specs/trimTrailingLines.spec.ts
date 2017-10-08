import { trimTrailingLines } from '../lib'

describe('trimTrailingLines', () => {
  it('trims trailing lines', () => {
    expect(trimTrailingLines('')).toBe('')
    expect(trimTrailingLines('foo')).toBe('foo')
    expect(trimTrailingLines('foo\nbar')).toBe('foo\nbar')
    expect(trimTrailingLines('foo\nbar\n')).toBe('foo\nbar')
    expect(trimTrailingLines('foo\nbar\n\n')).toBe('foo\nbar')
  })
})
