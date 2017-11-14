import u from 'typed-unist-builder'
import h from 'typed-hastscript'
import { toHTML } from '../lib'

describe('`colgroup` (closing)', () => {
  it('should not omit tag without children', () => {
    const input = h('colgroup')
    const opts = {omitOptionalTags: true}

    expect(toHTML(input, opts)).toBe('<colgroup>')
  })

  it('should not omit tag without children', () => {
    const input = h('colgroup')
    const opts = {omitOptionalTags: true}

    expect(toHTML(input, opts)).toBe('<colgroup>')
  })

  it('should omit tag if head is `col`', () => {
    const input = h('colgroup', [h('col', [], {span: 2})])
    const opts = {omitOptionalTags: true}

    expect(toHTML(input, opts)).toBe('<col span="2">')
  })

  it('should not omit tag if head is not `col`', () => {
    const input = h('colgroup', [u('comment', 'alpha')])
    const opts = {omitOptionalTags: true}

    expect(toHTML(input, opts)).toBe('<colgroup><!--alpha-->')
  })

  it('should not omit tag if previous is `colgroup` whose closing tag is omitted', () => {
    const input = h('table', [
      h('colgroup', [h('col', [], {span: 2})]),
      h('colgroup', [h('col', [], {span: 3})]),
    ])
    const opts = {omitOptionalTags: true}

    expect(toHTML(input, opts)).toBe('<table><col span="2"><colgroup><col span="3"></table>')
  })
})
