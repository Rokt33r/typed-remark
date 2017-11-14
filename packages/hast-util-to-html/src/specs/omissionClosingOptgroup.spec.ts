import h from 'typed-hastscript'
import { toHTML } from '../lib'

describe('`optgroup` (closing)', () => {
  it('should omit tag without parent', () => {
    const input = h('optgroup')
    const opts = {omitOptionalTags: true}

    expect(toHTML(input, opts)).toBe('<optgroup>')
  })

  it('should omit tag without following', () => {
    const input = h('select', [h('optgroup')])
    const opts = {omitOptionalTags: true}

    expect(toHTML(input, opts)).toBe('<select><optgroup></select>')
  })

  it('should omit tag followed by `optgroup`', () => {
    const input = h('select', [h('optgroup'), h('optgroup')])
    const opts = {omitOptionalTags: true}

    expect(toHTML(input, opts)).toBe('<select><optgroup><optgroup></select>')
  })

  it('should not omit tag followed by others', () => {
    const input = h('select', [h('optgroup'), h('p')])
    const opts = {omitOptionalTags: true}

    expect(toHTML(input, opts)).toBe('<select><optgroup></optgroup><p></select>')
  })
})
