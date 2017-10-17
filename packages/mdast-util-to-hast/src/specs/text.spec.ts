import u from 'typed-unist-builder'
import { toHAST } from '../lib'

describe('Nodes', () => {
  it('should map `text`s', () => {
    const input = u('text', 'alpha')

    const result = toHAST(input)

    expect(result).toEqual(u('text', 'alpha'))
  })
})
