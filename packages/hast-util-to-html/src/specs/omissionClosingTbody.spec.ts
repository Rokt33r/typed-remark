import h from 'typed-hastscript'
import { toHTML } from '../lib'

describe('`tbody` (closing)', () => {
  it('should omit tag without siblings', () => {
    const input = h('tbody')
    const opts = {omitOptionalTags: true}

    expect(toHTML(input, opts)).toBe('<tbody>')
  })

  it('should omit tag without following', () => {
    const input = h('table', [h('tbody')])
    const opts = {omitOptionalTags: true}

    expect(toHTML(input, opts)).toBe('<table><tbody></table>')
  })

  it('should omit tag followed by `tbody`', () => {
    const input = h('table', [h('tbody'), h('tbody')])
    const opts = {omitOptionalTags: true}

    expect(toHTML(input, opts)).toBe('<table><tbody><tbody></table>')
  })

  it('should omit tag followed by `tfoot`', () => {
    const input = h('table', [h('tbody'), h('tfoot')])
    const opts = {omitOptionalTags: true}

    expect(toHTML(input, opts)).toBe('<table><tbody><tfoot></table>')
  })

  it('should not omit tag followed by others', () => {
    const input = h('table', [h('tbody'), h('tr')])
    const opts = {omitOptionalTags: true}

    expect(toHTML(input, opts)).toBe('<table><tbody></tbody><tr></table>')
  })
})
