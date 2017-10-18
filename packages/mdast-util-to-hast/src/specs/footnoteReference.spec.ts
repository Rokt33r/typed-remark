import u from 'typed-unist-builder'
import { toHAST } from '../lib'

describe('FootnoteReference', () => {
  it('should render `footnoteReference`s', () => {
    const input = u('footnoteReference', {
      identifier: 'alpha',
    })

    const result = toHAST(input)

    expect(result).toEqual(u('element', {tagName: 'sup', properties: {
      id: 'fnref-alpha',
    }}, [
      u('element', {tagName: 'a', properties: {
        href: '#fn-alpha',
        className: ['footnote-ref'],
      }}, [u('text', 'alpha')]),
    ]))
  })
})
