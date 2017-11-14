import u from 'typed-unist-builder'
import h from 'typed-hastscript'
import { toHTML } from '../lib'

describe('`head` (closing)', () => {
  it('should omit tag without following', () => {
    const input = h('head')
    const opts = {omitOptionalTags: true}

    expect(toHTML(input, opts)).toBe('<head>')
  })

  it('should not omit tag if followed by `comment`', () => {
    const input = h('html', [h('head'), u('comment', 'alpha')])
    const opts = {omitOptionalTags: true}

    expect(toHTML(input, opts)).toBe('<head></head><!--alpha-->')
  })

  it('should not omit tag if the next sibling starts with white-space', () => {
    const input = h('html', [h('head'), ' alpha'])
    const opts = {omitOptionalTags: true}

    expect(toHTML(input, opts)).toBe('<head></head> alpha')
  })

  it('should omit tag if not followed by `comment`', () => {
    const input = h('html', [h('head'), u('text', 'alpha')])
    const opts = {omitOptionalTags: true}

    expect(toHTML(input, opts)).toBe('<head>alpha')
  })
})
