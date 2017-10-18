import u from 'typed-unist-builder'
import { toHAST } from '../lib'

describe('ThematicBreak', () => {
  it('should transform `thematicBreak` to `hr`', () => {
    const input = u('thematicBreak')

    const result = toHAST(input)

    expect(result).toEqual(u('element', {tagName: 'hr', properties: {}}, []))
  })
})
