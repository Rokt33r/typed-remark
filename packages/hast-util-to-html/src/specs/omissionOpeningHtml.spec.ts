import h from 'typed-hastscript'
import u from 'typed-unist-builder'
import { toHTML } from '../lib'

describe('`html` (opening)', () => {
  it('should omit tag without first child', () => {
    const input = h('html')
    const opts = {omitOptionalTags: true}

    expect(toHTML(input, opts)).toBe('')
  })

  it('should not omit tag if head is `comment`', () => {
    const input = h('html', [u('comment', 'alpha'), 'bravo'])
    const opts = {omitOptionalTags: true}

    expect(toHTML(input, opts)).toBe('<html><!--alpha-->bravo')
  })

  it('should omit tag if head is not `comment`', () => {
    const input = h('html', ['bravo'])
    const opts = {omitOptionalTags: true}

    expect(toHTML(input, opts)).toBe('bravo')
  })
})
