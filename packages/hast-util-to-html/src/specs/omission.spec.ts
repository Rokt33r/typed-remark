import h from 'typed-hastscript'
import { toHTML } from '../lib'

describe('`omitOptionalTags` (closing)', () => {
  it('should omit opening and closing tags', () => {
    const input = h('html')
    const opts = {omitOptionalTags: true}

    expect(toHTML(input, opts)).toBe('')
  })

  it('should not omit opening tags with attributes', () => {
    const input = h('html', [], {lang: 'en'})
    const opts = {omitOptionalTags: true}

    expect(toHTML(input, opts)).toBe('<html lang="en">')
  })

  it('should ignore white-space when determining whether tags can be omitted (#1)', () => {
    const input = h('ol', [h('li', ['alpha']), h('li', ['bravo'])])
    const opts = {omitOptionalTags: true}

    expect(toHTML(input, opts)).toBe('<ol><li>alpha<li>bravo</ol>')
  })

  it('should ignore white-space when determining whether tags can be omitted (#2)', () => {
    const input = h('ol', [h('li', ['alpha']), ' ', h('li', ['bravo']), '\t'])
    const opts = {omitOptionalTags: true}

    expect(toHTML(input, opts)).toBe('<ol><li>alpha <li>bravo\t</ol>')
  })
})
