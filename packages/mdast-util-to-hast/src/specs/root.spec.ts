import u from 'typed-unist-builder'
import { toHAST } from '../lib'

describe('Root', () => {
  it('should map `root`s', () => {
    const input = u('root', [])

    const result = toHAST(input)

    expect(result).toEqual(u('root', []))
  })
})
