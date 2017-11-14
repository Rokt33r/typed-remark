import h from 'typed-hastscript'
import { toHTML } from '../lib'

describe('`option` (closing)', () => {
  it('should omit tag without parent', () => {
    const input = h('option', [])
    const opts = {omitOptionalTags: true}

    expect(toHTML(input, opts)).toBe('<option>')
  })

  it('should omit tag without following', () => {
    const input = h('select', [h('option')])
    const opts = {omitOptionalTags: true}

    expect(toHTML(input, opts)).toBe('<select><option></select>')
  })

  it('should omit tag followed by `option`', () => {
    const input = h('select', [h('option'), h('option')])
    const opts = {omitOptionalTags: true}

    expect(toHTML(input, opts)).toBe('<select><option><option></select>')
  })

  it('should omit tag followed by `optgroup`', () => {
    const input = h('select', [h('option'), h('optgroup')])
    const opts = {omitOptionalTags: true}

    expect(toHTML(input, opts)).toBe('<select><option><optgroup></select>')
  })

  it('should not omit tag followed by others', () => {
    const input = h('select', [h('option'), h('p')])
    const opts = {omitOptionalTags: true}

    expect(toHTML(input, opts)).toBe('<select><option></option><p></select>')
  })
})
