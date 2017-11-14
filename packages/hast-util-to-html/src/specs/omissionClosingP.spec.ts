import u from 'typed-unist-builder'
import h from 'typed-hastscript'
import { toHTML } from '../lib'

describe('`p` (closing)', () => {
  it('should omit tag without following', () => {
    const input = u('root', [h('p')])
    const opts = {omitOptionalTags: true}

    expect(toHTML(input, opts)).toBe('<p>')
  })

  it('should omit tag if followed by `address`', () => {
    const input = u('root', [h('p'), h('address')])
    const opts = {omitOptionalTags: true}

    expect(toHTML(input, opts)).toBe('<p><address></address>')
  })

  it('should omit tag if followed by `ul`', () => {
    const input = u('root', [h('p'), h('ul')])
    const opts = {omitOptionalTags: true}

    expect(toHTML(input, opts)).toBe('<p><ul></ul>')
  })

  it('should not omit tag if followed by `a`', () => {
    const input = u('root', [h('p'), h('a')])
    const opts = {omitOptionalTags: true}

    expect(toHTML(input, opts)).toBe('<p></p><a></a>')
  })

  it('should not omit tag if followed by `xmp`', () => {
    const input = u('root', [h('p'), h('xmp')])
    const opts = {omitOptionalTags: true}

    expect(toHTML(input, opts)).toBe('<p></p><xmp></xmp>')
  })

  it('should omit tag without parent', () => {
    const input = h('p')
    const opts = {omitOptionalTags: true}

    expect(toHTML(input, opts)).toBe('<p>')
  })

  it('should not omit tag if parent is `a`', () => {
    const input = h('a', [h('p')])
    const opts = {omitOptionalTags: true}

    expect(toHTML(input, opts)).toBe('<a><p></p></a>')
  })

  it('should not omit tag if parented by `video`', () => {
    const input = h('video', [h('p')])
    const opts = {omitOptionalTags: true}

    expect(toHTML(input, opts)).toBe('<video><p></p></video>')
  })

  it('should not omit tag if parent is `article`', () => {
    const input = h('article', [h('p')])
    const opts = {omitOptionalTags: true}

    expect(toHTML(input, opts)).toBe('<article><p></article>')
  })

  it('should not omit tag if parent is `article`', () => {
    const input = h('article', [h('p')])
    const opts = {omitOptionalTags: true}

    expect(toHTML(input, opts)).toBe('<article><p></article>')
  })

  it('should not omit tag if parented by `section`', () => {
    const input = h('section', [h('p')])
    const opts = {omitOptionalTags: true}

    expect(toHTML(input, opts)).toBe('<section><p></section>')
  })
})
