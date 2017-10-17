import u from 'typed-unist-builder'
import { toHAST } from '../lib'

describe('YAML', () => {
  it('should ignore `yaml`', () => {
    const input = u('yaml', 'kilo: "lima"')

    const result = toHAST(input)

    expect(result).toEqual(null)
  })
})
