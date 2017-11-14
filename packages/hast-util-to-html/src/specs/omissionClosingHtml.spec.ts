import u from 'typed-unist-builder'
import h from 'typed-hastscript'
import { toHTML } from '../lib'

describe('`html` (closing)', () => {
  it('should omit tag without following', () => {
    const input = h('html')
    const opts = {omitOptionalTags: true}

    expect(toHTML(input, opts)).toBe('')
  })

  it('should not omit tag if followed by `comment`', () => {
    const input = u('root', [h('html'), u('comment', 'alpha')])
    const opts = {omitOptionalTags: true}

    expect(toHTML(input, opts)).toBe('</html><!--alpha-->')
  })

  it('should omit tag if not followed by `comment`', () => {
    const input = u('root', [h('html'), u('text', 'alpha')])
    const opts = {omitOptionalTags: true}

    expect(toHTML(input, opts)).toBe('alpha')
  })
})
