import u from 'typed-unist-builder'
import h from 'typed-hastscript'
import { toHTML } from '../lib'

describe('`body` (closing)', () => {
  it('should omit tag without following', () => {
    const input = h('body')
    const opts = {omitOptionalTags: true}

    expect(toHTML(input, opts)).toBe('')
  })

  it('should not omit tag if followed by `comment`', () => {
    const input = h('html', [h('body'), u('comment', 'alpha')])
    const opts = {omitOptionalTags: true}

    expect(toHTML(input, opts)).toBe('</body><!--alpha-->')
  })

  it('should omit tag if not followed by `comment`', () => {
    const input = h('html', [h('body'), u('text', 'alpha')])
    const opts = {omitOptionalTags: true}

    expect(toHTML(input, opts)).toBe('alpha')
  })
})
