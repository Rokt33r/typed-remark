import h from 'typed-hastscript'
import { toHTML } from '../lib'

describe('`tfoot` (closing)', () => {
  it('should omit tag without siblings', () => {
    const input = h('tfoot')
    const opts = {omitOptionalTags: true}

    expect(toHTML(input, opts)).toBe('<tfoot>')
  })

  it('should omit tag without following', () => {
    const input = h('table', [h('tfoot')])
    const opts = {omitOptionalTags: true}

    expect(toHTML(input, opts)).toBe('<table><tfoot></table>')
  })

  it('should not omit tag followed by others', () => {
    const input = h('table', [h('tfoot'), h('tr')])
    const opts = {omitOptionalTags: true}

    expect(toHTML(input, opts)).toBe('<table><tfoot></tfoot><tr></table>')
  })
})
