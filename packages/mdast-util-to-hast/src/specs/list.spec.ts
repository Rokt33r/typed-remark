import u from 'typed-unist-builder'
import { toHAST } from '../lib'

describe('List', () => {
  it('should transform ordered lists to `ol`', () => {
    const input = u('list', {ordered: true}, [
      u('listItem', [u('paragraph', [u('text', 'uniform')])]),
    ])

    const result = toHAST(input)

    expect(result).toEqual(u('element', {tagName: 'ol', properties: {}}, [
      u('text', '\n'),
      u('element', {tagName: 'li', properties: {}}, [
        u('text', 'uniform'),
      ]),
      u('text', '\n'),
    ]))
  })

  it('should transform unordered lists to `ul`', () => {
    const input = u('list', {ordered: false}, [
      u('listItem', [u('paragraph', [u('text', 'whiskey')])]),
    ])

    const result = toHAST(input)

    expect(result).toEqual(u('element', {tagName: 'ul', properties: {}}, [
      u('text', '\n'),
      u('element', {tagName: 'li', properties: {}}, [
        u('text', 'whiskey'),
      ]),
      u('text', '\n'),
    ]))
  })

  it('should support `start` in ordered lists', () => {
    const input = u('list', {ordered: true, start: 3}, [
      u('listItem', [u('paragraph', [u('text', 'x-ray')])]),
    ])

    const result = toHAST(input)

    expect(result).toEqual(u('element', {tagName: 'ol', properties: {start: 3}}, [
      u('text', '\n'),
      u('element', {tagName: 'li', properties: {}}, [
        u('text', 'x-ray'),
      ]),
      u('text', '\n'),
    ]))
  })
})
