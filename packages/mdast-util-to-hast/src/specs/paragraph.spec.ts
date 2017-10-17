import u from 'typed-unist-builder'
import { toHAST } from '../lib'

describe('Paragraph', () => {
  it('should transform `paragraph` to a `p` element', () => {
    const input = u('paragraph', [u('text', 'bravo')])

    const result = toHAST(input)

    expect(result).toEqual(u('element', {tagName: 'p', properties: {}}, [u('text', 'bravo')]))
  })
})
