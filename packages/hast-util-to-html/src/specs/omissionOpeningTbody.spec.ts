import h from 'typed-hastscript'
import { toHTML } from '../lib'

describe('`tbody` (opening)', () => {
  it('should not omit tag without children', () => {
    const input = h('tbody')
    const opts = {omitOptionalTags: true}

    expect(toHTML(input, opts)).toBe('<tbody>')
  })

  it('should omit tag if head is `tr`', () => {
    const input = h('tbody', [h('tr')])
    const opts = {omitOptionalTags: true}

    expect(toHTML(input, opts)).toBe('<tr>')
  })

  it('should not omit tag preceded by an omitted `thead` closing tag', () => {
    const input = h('table', [
      h('thead', [h('tr')]),
      h('tbody', [h('tr')]),
    ])
    const opts = {omitOptionalTags: true}

    expect(toHTML(input, opts)).toBe('<table><thead><tr><tbody><tr></table>')
  })

  it('should not omit tag preceded by an omitted `tbody` closing tag', () => {
    const input = h('table', [
      h('tbody', [h('tr')]),
      h('tbody', [h('tr')]),
    ])
    const opts = {omitOptionalTags: true}

    expect(toHTML(input, opts)).toBe('<table><tr><tbody><tr></table>')

  })
})
