import h from 'typed-hastscript'
import { toHTML } from '../lib'

describe('`thead` (closing)', () => {
  it('should not omit tag without siblings', () => {
    const input = h('thead')
    const opts = {omitOptionalTags: true}

    expect(toHTML(input, opts)).toBe('<thead></thead>')
  })

  it('should not omit tag without following', () => {
    const input = h('table', [h('thead')])
    const opts = {omitOptionalTags: true}

    expect(toHTML(input, opts)).toBe('<table><thead></thead></table>')
  })

  it('should omit tag followed by `tbody`', () => {
    const input = h('table', [h('thead'), h('tbody')])
    const opts = {omitOptionalTags: true}

    expect(toHTML(input, opts)).toBe('<table><thead><tbody></table>')
  })

  it('should omit tag followed by `tfoot`', () => {
    const input = h('table', [h('thead'), h('tfoot')])
    const opts = {omitOptionalTags: true}

    expect(toHTML(input, opts)).toBe('<table><thead><tfoot></table>')
  })

  it('should not omit tag followed by others', () => {
    const input = h('table', [h('thead'), h('tr')])
    const opts = {omitOptionalTags: true}

    expect(toHTML(input, opts)).toBe('<table><thead></thead><tr></table>')
  })
})
