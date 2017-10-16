import u from 'typed-unist-builder'
import { toHAST } from '../lib'

describe('Link', () => {
  it('should transform `link` to `a`', () => {
    const input = u('link', {
      url: 'http://golf.hotel',
      title: 'India',
    }, [u('text', 'juliett')])

    const result = toHAST(input)

    expect(result).toEqual(u('element', {tagName: 'a', properties: {
      href: 'http://golf.hotel',
      title: 'India',
    }}, [u('text', 'juliett')]))
  })

  it('should transform `link` to `a` (missing `title`)', () => {
    const input = u('link', {
      url: 'http://kilo.lima',
    }, [u('text', 'mike')])

    const result = toHAST(input)

    expect(result).toEqual(u('element', {tagName: 'a', properties: {
      href: 'http://kilo.lima',
    }}, [u('text', 'mike')]))
  })

  it('should correctly decode/encode urls', () => {
    const input = u('link', {
      url: 'https://github.com/facebook/react/pulls?q=is%3Apr%20is%3Aclosed',
    }, [u('text', 'Alpha')])

    const result = toHAST(input)

    expect(result).toEqual(u('element', {tagName: 'a', properties: {
      href: 'https://github.com/facebook/react/pulls?q=is%3Apr%20is%3Aclosed',
    }}, [u('text', 'Alpha')]))
  })
})
