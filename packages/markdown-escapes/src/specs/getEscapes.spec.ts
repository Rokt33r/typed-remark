import {
  getEscapes,
  defaults,
  gfm,
  commonmark
} from '../lib'

describe('getEscapes', () => {
  it('returns commonmark if options.commonmark is true', () => {
    const result = getEscapes({commonmark: true})

    expect(result).toBe(commonmark)
  })

  it('returns commonmark if options.gfm is true', () => {
    const result = getEscapes({gfm: true})

    expect(result).toBe(gfm)
  })

  it('returns defaults otherwise', () => {
    const result = getEscapes()

    expect(result).toBe(defaults)
  })
})
