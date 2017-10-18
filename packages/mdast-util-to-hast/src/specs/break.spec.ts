import u from 'typed-unist-builder'
import { toHAST } from '../lib'

describe('Break', () => {
  it('should transform `break` to `br`', () => {
    const input = u('paragraph', [
      u('text', 'bravo'),
      u('break'),
      u('text', 'charlie'),
    ])

    const result = toHAST(input)

    expect(result).toEqual(u('element', {tagName: 'p', properties: {}}, [
      u('text', 'bravo'),
      u('element', {tagName: 'br', properties: {}}, []),
      u('text', '\n'),
      u('text', 'charlie'),
    ]))
  })

  it('should trim text after a `br` (#1)', () => {
    const input = u('paragraph', [
      u('text', 'alpha'),
      u('break'),
      u('text', '  bravo'),
    ])

    const result = toHAST(input)

    expect(result).toEqual(u('element', {tagName: 'p', properties: {}}, [
      u('text', 'alpha'),
      u('element', {tagName: 'br', properties: {}}, []),
      u('text', '\n'),
      u('text', 'bravo'),
    ]))
  })

  it('should trim text after a `br` (#2)', () => {
    const input = u('paragraph', [
      u('text', 'alpha'),
      u('break'),
      u('emphasis', [u('text', '  bravo')]),
    ])

    const result = toHAST(input)

    expect(result).toEqual(u('element', {tagName: 'p', properties: {}}, [
      u('text', 'alpha'),
      u('element', {tagName: 'br', properties: {}}, []),
      u('text', '\n'),
      u('element', {tagName: 'em', properties: {}}, [u('text', 'bravo')]),
    ]))
  })
})
