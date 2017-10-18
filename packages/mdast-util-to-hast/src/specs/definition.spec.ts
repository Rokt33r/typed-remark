import u from 'typed-unist-builder'
import { toHAST } from '../lib'

describe('Definition', () => {
  it('should ignore `definition`', () => {
    const input = u('definition', {
      url: 'http://uniform.whiskey',
      identifier: 'x-ray',
      title: 'yankee',
    })

    const result = toHAST(input)

    expect(result).toEqual(null)
  })

  it('should prefer the last definition by default', () => {
    const input = u('paragraph', [
      u('linkReference', {identifier: 'alpha'}, [u('text', 'bravo')]),
      u('definition', {identifier: 'alpha', url: 'http://charlie.com'}),
      u('definition', {identifier: 'alpha', url: 'http://delta.com'}),
    ])

    const result = toHAST(input)

    expect(result).toEqual(u('element', {tagName: 'p', properties: {}}, [
      u('element', {tagName: 'a', properties: {href: 'http://delta.com'}}, [
        u('text', 'bravo'),
      ]),
    ]))
  })

  it('should prefer the first definition in commonmark mode', () => {
    const input = u('paragraph', [
      u('linkReference', {identifier: 'alpha'}, [u('text', 'bravo')]),
      u('definition', {identifier: 'alpha', url: 'http://charlie.com'}),
      u('definition', {identifier: 'alpha', url: 'http://delta.com'}),
    ])

    const result = toHAST(input, {commonmark: true})

    expect(result).toEqual(u('element', {tagName: 'p', properties: {}}, [
      u('element', {tagName: 'a', properties: {href: 'http://charlie.com'}}, [
        u('text', 'bravo'),
      ]),
    ]))
  })
})
