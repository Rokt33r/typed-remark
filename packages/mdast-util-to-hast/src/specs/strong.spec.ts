import u from 'typed-unist-builder'
import { toHAST } from '../lib'

describe('Strong', () => {
  it('should transform `strong` to `strong`', () => {
    const input = u('strong', [u('text', 'echo')])

    const result = toHAST(input)

    expect(result).toEqual(u('element', {tagName: 'strong', properties: {}}, [u('text', 'echo')]))
  })
})
