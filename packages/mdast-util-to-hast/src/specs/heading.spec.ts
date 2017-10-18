import u from 'typed-unist-builder'
import { toHAST } from '../lib'

describe('Heading', () => {
  it('should transform `heading` to a `h[1-6]` element', () => {
    const input = u('heading', {depth: 4}, [u('text', 'echo')])

    const result = toHAST(input)

    expect(result).toEqual(u('element', {tagName: 'h4', properties: {}}, [u('text', 'echo')]))
  })
})
