import u from 'typed-unist-builder'
import { toHAST } from '../lib'

describe('Blockquote', () => {
  it('should transform `blockquote` to a `blockquote` element', () => {
    const input = u('blockquote', [
      u('paragraph', [u('text', 'charlie')]),
      u('paragraph', [u('text', 'delta')]),
    ])

    const result = toHAST(input)

    expect(result).toEqual(u('element', {tagName: 'blockquote', properties: {}}, [
      u('text', '\n'),
      u('element', {tagName: 'p', properties: {}}, [u('text', 'charlie')]),
      u('text', '\n'),
      u('element', {tagName: 'p', properties: {}}, [u('text', 'delta')]),
      u('text', '\n')
    ]))
  })
})
