import { isAlphabetical } from '../lib'

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
