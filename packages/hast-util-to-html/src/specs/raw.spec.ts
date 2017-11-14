import u from 'typed-unist-builder'
import { toHTML } from '../lib'

describe('`element`', () => {
  it('should encode `raw`s', () => {
    const input = u('raw', '<script>alert("XSS!")</script>')

    expect(toHTML(input)).toBe('&#x3C;script>alert("XSS!")&#x3C;/script>')
  })

  it('should not encode `raw`s in `allowDangerousHTML` mode', () => {
    const input = u('raw', '<script>alert("XSS!")</script>')
    const opts = {allowDangerousHTML: true}

    expect(toHTML(input, opts)).toBe('<script>alert("XSS!")</script>')
  })
})
