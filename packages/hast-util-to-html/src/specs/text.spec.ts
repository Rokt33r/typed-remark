import u from 'typed-unist-builder'
import h from 'typed-hastscript'
import { toHTML } from '../lib'

describe('`text`', () => {
  it('should stringify `text`s', () => {
    const input = u('text', 'alpha')

    expect(toHTML(input)).toBe('alpha')
  })

  it('should encode `text`s', () => {
    const input = u('text', '3 < 5 & 7')

    expect(toHTML(input)).toBe('3 &#x3C; 5 &#x26; 7')
  })

  it('should not encode `text`s in `style`', () => {
    const input = h('style', [u('text', '*:before {content: "3 < 5"}')])

    expect(toHTML(input)).toBe('<style>*:before {content: "3 < 5"}</style>')
  })

  it('should not encode `text`s in `script`', () => {
    const input = h('script', [u('text', 'alert("3 < 5")')])

    expect(toHTML(input)).toBe('<script>alert("3 < 5")</script>')
  })

  it('should encode `text`s in other nodes', () => {
    const input = h('b', [u('text', '3 < 5')])

    expect(toHTML(input)).toBe('<b>3 &#x3C; 5</b>')
  })
})
