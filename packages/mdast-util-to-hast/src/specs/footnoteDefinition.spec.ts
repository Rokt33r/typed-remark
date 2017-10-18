import u from 'typed-unist-builder'
import { toHAST } from '../lib'

describe('FootnoteDefinition', () => {
  it('should ignore `footnoteDefinition`', () => {
    const input = u('footnoteDefinition', {
      identifier: 'zulu',
    }, [u('paragraph', [u('text', 'alpha')])])

    const result = toHAST(input)

    expect(result).toEqual(null)
  })
})
