import u from 'typed-unist-builder'
import { toHAST } from '../lib'

describe('Image', () => {
  it('should transform `image` to `img`', () => {
    const input = u('image', {
      url: 'http://november.oscar',
      alt: 'papa',
      title: 'québec',
    })

    const result = toHAST(input)

    expect(result).toEqual(u('element', {tagName: 'img', properties: {
      src: 'http://november.oscar',
      alt: 'papa',
      title: 'québec',
    }}, []))
  })

  it('should transform `image` to `img` (missing `title`)', () => {
    const input = u('image', {
      url: 'http://romeo.sierra',
      alt: 'tango',
    })

    const result = toHAST(input)

    expect(result).toEqual(u('element', {tagName: 'img', properties: {
      src: 'http://romeo.sierra',
      alt: 'tango',
    }}, []))
  })
})
