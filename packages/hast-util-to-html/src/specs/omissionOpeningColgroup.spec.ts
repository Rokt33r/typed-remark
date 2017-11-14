import u from 'typed-unist-builder'
import h from 'typed-hastscript'
import { toHTML } from '../lib'

describe('`colgroup` (opening)', () => {
  it('should not omit tag without children', () => {
    const input = h('colgroup')
    const opts = {omitOptionalTags: true}

    expect(toHTML(input, opts)).toBe('<colgroup>')
  })

  it('should omit tag with `col` child', () => {
    const input = h('colgroup')
    const opts = {omitOptionalTags: true}

    expect(toHTML(input, opts)).toBe('<colgroup>')
  })

  it('should omit tag without following', () => {
    const input = h('table', [h('colgroup')])
    const opts = {omitOptionalTags: true}

    expect(toHTML(input, opts)).toBe('<table><colgroup></table>')
  })

  it('should not omit tag followed by `comment`', () => {
    const input = h('table', [h('colgroup'), u('comment', 'alpha')])
    const opts = {omitOptionalTags: true}

    expect(toHTML(input, opts)).toBe('<table><colgroup></colgroup><!--alpha--></table>')
  })

  it('should not omit tag followed by white-space', () => {
    const input = h('table', [h('colgroup'), ' alpha'])
    const opts = {omitOptionalTags: true}

    expect(toHTML(input, opts)).toBe('<table><colgroup></colgroup> alpha</table>')
  })

  it('should omit tag followed by others', () => {
    const input = h('table', [h('colgroup'), h('tr')])
    const opts = {omitOptionalTags: true}

    expect(toHTML(input, opts)).toBe('<table><colgroup><tr></table>')
  })
})
