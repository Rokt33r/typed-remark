import u from 'typed-unist-builder'
import { toHAST } from '../lib'

describe('ImageReference', () => {
  it('should fall back on `imageReference`s without definition', () => {
    const input = u('imageReference', {
      identifier: 'charlie',
      alt: 'charlie',
    })

    const result = toHAST(input)

    expect(result).toEqual(u('text', '![charlie]'))
  })

  it('should not fall back on full `imageReference`s', () => {
    const input = u('imageReference', {
      identifier: 'foxtrot',
      referenceType: 'full',
      alt: 'golf',
    })

    const result = toHAST(input)

    expect(result).toEqual(u('element', {tagName: 'img', properties: {
      src: '',
      alt: 'golf',
    }}, []))
  })

  it('should not fall back on collapsed `imageReference`s', () => {
    const input = u('imageReference', {
      identifier: 'india',
      referenceType: 'collapsed',
      alt: 'india',
    })

    const result = toHAST(input)

    expect(result).toEqual(u('element', {tagName: 'img', properties: {
      src: '',
      alt: 'india',
    }}, []))
  })

  it('should transform `imageReference`s to `img`s', () => {
    const input = u('paragraph', [
      u('imageReference', {
        identifier: 'november',
        alt: 'oscar',
      }),
      u('definition', {
        identifier: 'november',
        url: 'http://papa.québec/romeo',
        title: 'sierra',
      }),
    ])

    const result = toHAST(input)

    expect(result).toEqual(u('element', {tagName: 'p', properties: {}}, [
      u('element', {tagName: 'img', properties: {
        src: 'http://papa.qu%C3%A9bec/romeo',
        alt: 'oscar',
        title: 'sierra',
      }}, []),
    ]))
  })
})
