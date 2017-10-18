import u from 'typed-unist-builder'
import { toHAST } from '../lib'

describe('HTML', () => {
  it('should ignore `html`', () => {
    const input = u('html', '<mike></mike>')

    const result = toHAST(input)

    expect(result).toEqual(null)
  })

  it('should transform `html` to `raw` if `allowDangerousHTML` is given', () => {
    const input = u('html', '<mike></mike>')

    const result = toHAST(input, {allowDangerousHTML: true})

    expect(result).toEqual(u('raw', '<mike></mike>'))
  })
})
