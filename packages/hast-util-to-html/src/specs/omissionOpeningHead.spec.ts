import h from 'typed-hastscript'
import { toHTML } from '../lib'

describe('`head` (opening)', () => {
  it('should omit tag with children', () => {
    const input = h('head', [h('meta', [], {charSet: 'utf8'})])
    const opts = {omitOptionalTags: true}

    expect(toHTML(input, opts)).toBe('<meta charset="utf8">')
  })

  it('should not omit tag without children', () => {
    const input = h('head')
    const opts = {omitOptionalTags: true}

    expect(toHTML(input, opts)).toBe('<head>')
  })

  it('should omit tag with `title`', () => {
    const input = h('head', [h('title', ['alpha'])])
    const opts = {omitOptionalTags: true}

    expect(toHTML(input, opts)).toBe('<title>alpha</title>')
  })

  it('should omit tag with `base`', () => {
    const input = h('head', [h('base')])
    const opts = {omitOptionalTags: true}

    expect(toHTML(input, opts)).toBe('<base>')
  })

  it('should not omit tag with multiple `title`s', () => {
    const input = h('head', [h('title'), h('title')])
    const opts = {omitOptionalTags: true}

    expect(toHTML(input, opts)).toBe('<head><title></title><title></title>')
  })

  it('should omit tag with `base`', () => {
    const input = h('head', [h('base')])
    const opts = {omitOptionalTags: true}

    expect(toHTML(input, opts)).toBe('<base>')
  })

  it('should not omit tag with multiple `base`s', () => {
    const input = h('head', [h('base'), h('base')])
    const opts = {omitOptionalTags: true}

    expect(toHTML(input, opts)).toBe('<head><base><base>')
  })
})
