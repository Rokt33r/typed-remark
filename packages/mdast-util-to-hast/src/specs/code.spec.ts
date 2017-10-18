import u from 'typed-unist-builder'
import { toHAST } from '../lib'

describe('Code', () => {
  it('should transform `code` to a `pre` element (#1)', () => {
    const input = u('code', 'foxtrot()\ngolf.hotel()')

    const result = toHAST(input)

    expect(result).toEqual(u('element', {tagName: 'pre', properties: {}}, [
      u('element', {tagName: 'code', properties: {}}, [
        u('text', 'foxtrot()\ngolf.hotel()\n'),
      ]),
    ]))
  })

  it('should transform `code` to a `pre` element (#2)', () => {
    const input = u('code', '')

    const result = toHAST(input)

    expect(result).toEqual(u('element', {tagName: 'pre', properties: {}}, [
      u('element', {tagName: 'code', properties: {}}, [
        u('text', ''),
      ]),
    ]))
  })

  it('should transform `code` to a `pre` element with language class', () => {
    const input = u('code', {lang: 'js'}, 'india()')

    const result = toHAST(input)

    expect(result).toEqual(u('element', {tagName: 'pre', properties: {}}, [
      u('element', {tagName: 'code', properties: {className: ['language-js']}}, [
        u('text', 'india()\n'),
      ]),
    ]))
  })
})
