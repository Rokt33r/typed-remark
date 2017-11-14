import u from 'typed-unist-builder'
import h from 'typed-hastscript'
import { toHTML } from '../lib'

describe('`body` (opening)', () => {
  it('should omit tag without children', () => {
    const input = h('body')
    const opts = {omitOptionalTags: true}

    expect(toHTML(input, opts)).toBe('')
  })

  it('should not omit tag if the head is a `comment`', () => {
    const input = h('body', [u('comment', 'alpha')])
    const opts = {omitOptionalTags: true}

    expect(toHTML(input, opts)).toBe('<body><!--alpha-->')
  })

  it('should not omit tag if the head starts with white-space', () => {
    const input = h('body', [' alpha'])
    const opts = {omitOptionalTags: true}

    expect(toHTML(input, opts)).toBe('<body> alpha')
  })

  it('should not omit tag if head is `meta`', () => {
    const input = h('body', [h('meta')])
    const opts = {omitOptionalTags: true}

    expect(toHTML(input, opts)).toBe('<body><meta>')
  })

  it('should not omit tag if head is `link`', () => {
    const input = h('body', [h('link')])
    const opts = {omitOptionalTags: true}

    expect(toHTML(input, opts)).toBe('<body><link>')
  })

  it('should not omit tag if head is `script`', () => {
    const input = h('body', [h('script')])
    const opts = {omitOptionalTags: true}

    expect(toHTML(input, opts)).toBe('<body><script></script>')
  })

  it('should not omit tag if head is `style`', () => {
    const input = h('body', [h('style')])
    const opts = {omitOptionalTags: true}

    expect(toHTML(input, opts)).toBe('<body><style></style>')
  })

  it('should not omit tag if head is `template`', () => {
    const input = h('body', [h('template')])
    const opts = {omitOptionalTags: true}

    expect(toHTML(input, opts)).toBe('<body><template></template>')
  })

  it('should omit tag if head is something else', () => {
    const input = h('body', [h('div')])
    const opts = {omitOptionalTags: true}

    expect(toHTML(input, opts)).toBe('<div></div>')
  })
})
