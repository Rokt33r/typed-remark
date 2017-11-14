import u from 'typed-unist-builder'
import { toHTML } from '../lib'

describe('toHTML(comment)', () => {
  it('should stringify `comment`s', () => {
    const node = u('comment', 'alpha')

    expect(toHTML(node)).toBe('<!--alpha-->')
  })

  it('should not encode `comment`s (#1)', () => {
    const node = u('comment', 'AT&T')

    expect(toHTML(node)).toBe('<!--AT&T-->')
  })
  it('should not encode `comment`s (#1)', () => {
    const node = u('comment', '-->')

    expect(toHTML(node)).toBe('<!---->-->')
  })
})
