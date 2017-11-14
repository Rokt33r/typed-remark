import h from 'typed-hastscript'
import { toHTML } from '../lib'

describe('`dd` (closing)', () => {
  it('should omit tag without parent', () => {
    const input = h('dd')
    const opts = {omitOptionalTags: true}

    expect(toHTML(input, opts)).toBe('<dd>')
  })

  it('should omit tag without following', () => {
    const input = h('dl', [h('dd')])
    const opts =  {omitOptionalTags: true}

    expect(toHTML(input, opts)).toBe('<dl><dd></dl>')
  })

  it('should omit tag followed by `dd`', () => {
    const input = h('dl', [h('dd'), h('dd')])
    const opts = {omitOptionalTags: true}

    expect(toHTML(input, opts)).toBe('<dl><dd><dd></dl>')
  })

  it('should omit tag followed by `dt`', () => {
    const input = h('dl', [h('dd'), h('dt')])
    const opts = {omitOptionalTags: true}

    expect(toHTML(input, opts)).toBe('<dl><dd><dt></dt></dl>')
  })

  it('should not omit tag followed by others', () => {
    const input = h('dl', [h('dd'), h('p')])
    const opts = {omitOptionalTags: true}

    expect(toHTML(input, opts)).toBe('<dl><dd></dd><p></dl>')
  })
})
