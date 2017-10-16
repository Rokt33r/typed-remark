import u from 'typed-unist-builder'
import { toHAST } from '../lib'

describe('Emphasis', () => {
  it('should transform `emphasis` to `em`', () => {
    const input = u('emphasis', [u('text', 'delta')])

    const result = toHAST(input)

    expect(result).toEqual(u('element', {tagName: 'em', properties: {}}, [u('text', 'delta')]))
  })
})
