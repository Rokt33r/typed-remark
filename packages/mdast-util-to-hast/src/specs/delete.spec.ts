import u from 'typed-unist-builder'
import { toHAST } from '../lib'

describe('Delete', () => {
  it('should transform `delete` to `del`', () => {
    const input = u('delete', [u('text', 'foxtrot')])

    const result = toHAST(input)

    expect(result).toEqual(u('element', {tagName: 'del', properties: {}}, [u('text', 'foxtrot')]))
  })
})
