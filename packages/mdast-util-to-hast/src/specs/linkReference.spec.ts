import u from 'typed-unist-builder'
import { toHAST } from '../lib'

describe('LinkReference', () => {
  it('should fall back on `linkReference`s without definition', () => {
    const input = u('linkReference', {
      identifier: 'bravo',
    }, [u('text', 'bravo')])

    const result = toHAST(input)

    expect(result).toEqual([u('text', '['), u('text', 'bravo'), u('text', ']')])
  })

  it('should not fall back on full `linkReference`s', () => {
    const input = u('linkReference', {
      identifier: 'delta',
      referenceType: 'full',
    }, [u('text', 'echo')])

    const result = toHAST(input)

    expect(result).toEqual(u('element', {tagName: 'a', properties: {
      href: '',
    }}, [u('text', 'echo')]))
  })

  it('should not fall back on collapsed `linkReference`s', () => {
    const input = u('linkReference', {
      identifier: 'hotel',
      referenceType: 'collapsed',
    }, [u('text', 'hotel')])

    const result = toHAST(input)

    expect(result).toEqual(u('element', {tagName: 'a', properties: {
      href: '',
    }}, [u('text', 'hotel')]))
  })

  it('should transform `linkReference`s to `a`s', () => {
    const input = u('paragraph', [
      u('linkReference', {
        identifier: 'juliett',
      }, [u('text', 'kilo')]),
      u('definition', {
        identifier: 'juliett',
        url: 'http://kilo.lima/mike',
        title: 'november',
      }),
    ])

    const result = toHAST(input)

    expect(result).toEqual(u('element', {tagName: 'p', properties: {}}, [
      u('element', {tagName: 'a', properties: {
        href: 'http://kilo.lima/mike',
        title: 'november',
      }}, [u('text', 'kilo')]),
    ]))
  })
})
