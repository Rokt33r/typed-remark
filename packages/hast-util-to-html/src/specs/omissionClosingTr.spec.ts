import h from 'typed-hastscript'
import { toHTML } from '../lib'

describe('`tr` (closing)', () => {
  it('should omit tag without siblings', () => {
    const input = h('tr')
    const opts = {omitOptionalTags: true}

    expect(toHTML(input, opts)).toBe('<tr>')
  })

  it('should omit tag without following', () => {
    const input = h('table', [h('tr')])
    const opts = {omitOptionalTags: true}

    expect(toHTML(input, opts)).toBe('<table><tr></table>')
  })

  it('should not omit tag followed by others', () => {
    const input = h('table', [h('tr'), h('tbody')])
    const opts = {omitOptionalTags: true}

    expect(toHTML(input, opts)).toBe('<table><tr></tr><tbody></table>')
  })
})
