import h from 'typed-hastscript'
import { toHTML } from '../lib'

describe('`menuitem` (closing)', () => {
  it('should omit tag without parent', () => {
    const input = h('menuitem', ['alpha'])
    const opts = {omitOptionalTags: true}

    expect(toHTML(input, opts)).toBe('<menuitem>alpha')
  })

  it('should omit tag without following', () => {
    const input = h('menu', [h('menuitem', ['alpha'])])
    const opts = {omitOptionalTags: true}

    expect(toHTML(input, opts)).toBe('<menu><menuitem>alpha</menu>')
  })

  it('should omit tag followed by `menuitem`', () => {
    const input = h('menu', [h('menuitem'), h('menuitem')])
    const opts = {omitOptionalTags: true}

    expect(toHTML(input, opts)).toBe('<menu><menuitem><menuitem></menu>')
  })

  it('should omit tag followed by `hr`', () => {
    const input = h('menu', [h('menuitem', ['alpha']), h('hr')])
    const opts = {omitOptionalTags: true}

    expect(toHTML(input, opts)).toBe('<menu><menuitem>alpha<hr></menu>')
  })

  it('should omit tag followed by `menu`', () => {
    const input = h('menu', [
      h('menuitem', ['alpha']),
      h('menu'),
    ])
    const opts = {omitOptionalTags: true}

    expect(toHTML(input, opts)).toBe('<menu><menuitem>alpha<menu></menu></menu>')
  })

  it('should not omit tag followed by others', () => {
    const input = h('menu', [
      h('menuitem', ['alpha']),
      h('p'),
    ])
    const opts = {omitOptionalTags: true}

    expect(toHTML(input, opts)).toBe('<menu><menuitem>alpha</menuitem><p></menu>')
  })

  /* This actually tests an edge case where `menuitems`,
   * which can have children in WHATWG HTML, but not in
   * W3C HTML, here do not have children. */
  it('should omit tag when without children', () => {
    const input = h('menu', [h('menuitem'), h('p')])
    const opts = {omitOptionalTags: true}

    expect(toHTML(input, opts)).toBe('<menu><menuitem><p></menu>')
  })
})
