import h from 'typed-hastscript'
import { toHTML } from '../lib'

describe('`li` (closing)', () => {
  it('should omit tag without parent', () => {
    const input = h('li')
    const opts = {omitOptionalTags: true}

    expect(toHTML(input, opts)).toBe('<li>')
  })

  it('should omit tag without following', () => {
    const input = h('ol', [h('li')])
    const opts = {omitOptionalTags: true}

    expect(toHTML(input, opts)).toBe('<ol><li></ol>')
  })

  it('should omit tag followed by `li`', () => {
    const input = h('ol', [h('li'), h('li')])
    const opts = {omitOptionalTags: true}

    expect(toHTML(input, opts)).toBe('<ol><li><li></ol>')
  })

  it('should not omit tag followed by others', () => {
    const input = h('ol', [h('li'), h('p')])
    const opts = {omitOptionalTags: true}

    expect(toHTML(input, opts)).toBe('<ol><li></li><p></ol>')
  })
})
