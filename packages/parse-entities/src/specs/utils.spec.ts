import {
  isDecimal,
  isHexadecimal,
  isAlphabetical,
  isAlphanumerical,
} from '../lib/utils'

describe('isDecimal', () => {
  it('asserts if a given character is decimal(Regression Test)', () => {
    const qnas: [string | number, boolean][] = [
      ['0', true],
      ['9', true],
      ['1'.charCodeAt(0), true],
      ['a', false],
      ['0'.charCodeAt(0) - 1, false],
      ['9'.charCodeAt(0) + 1, false],
      ['F'.charCodeAt(0), false],
      ['💩', false],
    ]

    qnas.forEach(([question, answer]) => {
      const result = isDecimal(question)

      expect(result).toEqual(answer)
    })
  })
})

describe('isHexadecimal', () => {
  it('asserts if a given character is hexadecimal(Regression Test)', () => {
    const qnas: [string | number, boolean][] = [
      ['a', true],
      ['F', true],
      ['0', true],
      ['a'.charCodeAt(0), true],
      ['G', false],
      ['a'.charCodeAt(0) - 1, false],
      ['f'.charCodeAt(0) + 1, false],
      ['A'.charCodeAt(0) - 1, false],
      ['F'.charCodeAt(0) + 1, false],
      ['0'.charCodeAt(0) - 1, false],
      ['9'.charCodeAt(0) + 1, false],
      ['g'.charCodeAt(0), false],
      ['💩', false],
    ]

    qnas.forEach(([question, answer]) => {
      const result = isHexadecimal(question)

      expect(result).toEqual(answer)
    })
  })
})

describe('isAlphabetical', () => {
  it('asserts if a given character is alphabetical(Regression Test)', () => {
    const qnas: [string | number, boolean][] = [
      ['a', true],
      ['Z', true],
      ['a'.charCodeAt(0), true],
      ['0', false],
      ['a'.charCodeAt(0) - 1, false],
      ['z'.charCodeAt(0) + 1, false],
      ['A'.charCodeAt(0) - 1, false],
      ['Z'.charCodeAt(0) + 1, false],
      ['0'.charCodeAt(0), false],
      ['💩', false],
    ]

    qnas.forEach(([question, answer]) => {
      const result = isAlphabetical(question)

      expect(result).toEqual(answer)
    })
  })
})

describe('isAlphanumerical', () => {
  it('asserts if a given character is alphanumerical(Regression Test)', () => {
    const qnas: [string | number, boolean][] = [
      ['a', true],
      ['z', true],
      ['A', true],
      ['Z', true],
      ['0', true],
      ['9', true],
      ['a'.charCodeAt(0), true],
      ['9'.charCodeAt(0), true],
      ['\t', false],
      ['a'.charCodeAt(0) - 1, false],
      ['z'.charCodeAt(0) + 1, false],
      ['A'.charCodeAt(0) - 1, false],
      ['Z'.charCodeAt(0) + 1, false],
      ['0'.charCodeAt(0) - 1, false],
      ['9'.charCodeAt(0) + 1, false],
      ['💩', false],
    ]

    qnas.forEach(([question, answer]) => {
      const result = isAlphanumerical(question)

      expect(result).toEqual(answer)
    })
  })
})
