import u from 'typed-unist-builder'
import { toHAST } from '../lib'

describe('TOML', () => {
  it('should ignore `toml`', () => {
    const input = u('toml', 'kilo: "lima"')

    const result = toHAST(input)

    expect(result).toEqual(null)
  })
})
