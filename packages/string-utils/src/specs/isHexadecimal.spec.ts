import { isHexadecimal } from '../lib'

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
