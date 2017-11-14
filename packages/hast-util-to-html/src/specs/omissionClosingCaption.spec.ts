import u from 'typed-unist-builder'
import h from 'typed-hastscript'
import { toHTML } from '../lib'

describe('`caption` (closing)', () => {
  it('should not omit tag without children', () => {
    const input = h('caption')
    const opts = {omitOptionalTags: true}

    expect(toHTML(input, opts)).toBe('<caption>')
  })

  it('should omit tag without following', () => {
    const input = h('table', [h('caption')])
    const opts = {omitOptionalTags: true}

    expect(toHTML(input, opts)).toBe('<table><caption></table>')
  })

  it('should not omit tag followed by `comment`', () => {
    const input = h('table', [h('caption'), u('comment', 'alpha')])
    const opts = {omitOptionalTags: true}

    expect(toHTML(input, opts)).toBe('<table><caption></caption><!--alpha--></table>')
  })

  it('should not omit tag followed by white-space', () => {
    const input = h('table', [h('caption'), ' alpha'])
    const opts = {omitOptionalTags: true}

    expect(toHTML(input, opts)).toBe('<table><caption></caption> alpha</table>')
  })

  it('should omit tag followed by others', () => {
    const input = h('table', [h('caption'), h('tr')])
    const opts = {omitOptionalTags: true}

    expect(toHTML(input, opts)).toBe('<table><caption><tr></table>')
  })
})
