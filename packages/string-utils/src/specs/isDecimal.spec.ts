import { isDecimal } from '../lib'

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
