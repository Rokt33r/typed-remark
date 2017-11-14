import h from 'typed-hastscript'
import { toHTML } from '../lib'

describe('`dt` (closing)', () => {
  it('should not omit tag without parent', () => {
    const input = h('dt')
    const opts = {omitOptionalTags: true}

    expect(toHTML(input, opts)).toBe('<dt></dt>')
  })

  it('should not omit tag without following', () => {
    const input = h('dl', [h('dt')])
    const opts = {omitOptionalTags: true}

    expect(toHTML(input, opts)).toBe('<dl><dt></dt></dl>')
  })

  it('should omit tag followed by `dt`', () => {
    const input = h('dl', [h('dt'), h('dt')])
    const opts = {omitOptionalTags: true}

    expect(toHTML(input, opts)).toBe('<dl><dt><dt></dt></dl>')
  })

  it('should omit tag followed by `dd`', () => {
    const input = h('dl', [h('dt'), h('dd')])
    const opts = {omitOptionalTags: true}

    expect(toHTML(input, opts)).toBe('<dl><dt><dd></dl>')
  })

  it('should not omit tag followed by others', () => {
    const input = h('dl', [h('dt'), h('p')])
    const opts = {omitOptionalTags: true}

    expect(toHTML(input, opts)).toBe('<dl><dt></dt><p></dl>')
  })
})
