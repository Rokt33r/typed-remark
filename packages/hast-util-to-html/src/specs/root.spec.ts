import u from 'typed-unist-builder'
import h from 'typed-hastscript'
import { toHTML } from '../lib'

describe('`root`', () => {
  it('should stringify `root`s', () => {
    const input = u('root', [
      u('text', 'alpha '),
      h('i', ['bravo']),
      u('text', ' charlie'),
    ])

    expect(toHTML(input)).toBe('alpha <i>bravo</i> charlie')
  })
})
