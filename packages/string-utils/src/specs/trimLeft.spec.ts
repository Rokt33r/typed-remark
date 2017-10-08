import { trimLeft } from '../lib'

describe('trimLeft', () => {
  it('trims left', () => {
    expect(trimLeft('  unicorn  ')).toBe('unicorn  ')
    expect(trimLeft('\r\n  \nunicorn')).toBe('unicorn')
    expect(trimLeft('\u00A0\uFEFFunicorn')).toBe('unicorn')

    // zero-width space (zws), next line character (nel), non-character (bom) are not whitespace
    expect(trimLeft('\u200B\u0085\uFFFE')).toBe('\u200B\u0085\uFFFE')
  })
})
