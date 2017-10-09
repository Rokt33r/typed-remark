import { isWhitespaceCharacter } from '../lib'

describe('isWhitespaceCharacter', () => {
  it('asserts if a given character is a whitespace character(Regression Test)', () => {
    expect(isWhitespaceCharacter(' ')).toBe(true)
    expect(isWhitespaceCharacter('\n')).toBe(true)
    expect(isWhitespaceCharacter('\r')).toBe(true)
    expect(isWhitespaceCharacter('\ufeff')).toBe(true)
    expect(isWhitespaceCharacter('\u00a0')).toBe(true)
    expect(isWhitespaceCharacter('\t')).toBe(true)
    expect(isWhitespaceCharacter('\v')).toBe(true)
    expect(isWhitespaceCharacter(' '.charCodeAt(0))).toBe(true)
    expect(isWhitespaceCharacter('\n'.charCodeAt(0))).toBe(true)
    expect(isWhitespaceCharacter('\u1680'.charCodeAt(0))).toBe(true)
    expect(isWhitespaceCharacter('a')).toBe(false)
    expect(isWhitespaceCharacter(' '.charCodeAt(0) - 1)).toBe(false)
    expect(isWhitespaceCharacter('💩')).toBe(false)
  })
})
