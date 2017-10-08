import { isWordCharacter } from '../lib'

describe('isWordCharacter', () => {
  it('asserts if a given character is a word character(Regression Test)', () => {

    expect(isWordCharacter('a')).toBe(true)
    expect(isWordCharacter('z')).toBe(true)
    expect(isWordCharacter('A')).toBe(true)
    expect(isWordCharacter('Z')).toBe(true)
    expect(isWordCharacter('0')).toBe(true)
    expect(isWordCharacter('9')).toBe(true)
    expect(isWordCharacter('_')).toBe(true)
    expect(isWordCharacter('a'.charCodeAt(0))).toBe(true)
    expect(isWordCharacter('9'.charCodeAt(0))).toBe(true)
    expect(isWordCharacter('_'.charCodeAt(0))).toBe(true)
    expect(isWordCharacter('\t')).toBe(false)
    expect(isWordCharacter('a'.charCodeAt(0) - 1)).toBe(false)
    expect(isWordCharacter('z'.charCodeAt(0) + 1)).toBe(false)
    expect(isWordCharacter('A'.charCodeAt(0) - 1)).toBe(false)
    expect(isWordCharacter('Z'.charCodeAt(0) + 1)).toBe(false)
    expect(isWordCharacter('0'.charCodeAt(0) - 1)).toBe(false)
    expect(isWordCharacter('9'.charCodeAt(0) + 1)).toBe(false)
    expect(isWordCharacter('_'.charCodeAt(0) - 1)).toBe(false)
    expect(isWordCharacter('_'.charCodeAt(0) + 1)).toBe(false)
    expect(isWordCharacter('💩')).toBe(false)
  })
})
