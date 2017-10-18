import u from 'typed-unist-builder'
import { toHAST } from '../lib'

describe('InlineCode', () => {
  it('should transform `inlineCode` to a `code` element', () => {
    const input = u('inlineCode', 'juliett()')

    const result = toHAST(input)

    expect(result).toEqual(u('element', {tagName: 'code', properties: {}}, [
      u('text', 'juliett()'),
    ]))
  })
})
