import u from 'typed-unist-builder'
import { toHAST } from '../lib'

describe('Footnote', () => {
  it('should render `footnote`s (#1)', () => {
    const input = u('root', [
      u('footnote', [u('text', 'bravo')]),
    ])

    const result = toHAST(input)

    expect(result).toEqual(u('root', [
      u('element', {tagName: 'sup', properties: {
        id: 'fnref-1',
      }}, [
        u('element', {tagName: 'a', properties: {
          href: '#fn-1',
          className: ['footnote-ref'],
        }}, [u('text', '1')]),
      ]),
      u('text', '\n'),
      u('element', {
        tagName: 'div',
        properties: {className: ['footnotes']},
      }, [
        u('text', '\n'),
        u('element', {tagName: 'hr', properties: {}}, []),
        u('text', '\n'),
        u('element', {tagName: 'ol', properties: {}}, [
          u('text', '\n'),
          u('element', {
            tagName: 'li',
            properties: {id: 'fn-1'},
          }, [
            u('text', '\n'),
            u('text', 'bravo'),
            u('text', '\n'),
            u('element', {
              tagName: 'a',
              properties: {
                href: '#fnref-1',
                className: ['footnote-backref'],
              },
            }, [u('text', '↩')]),
            u('text', '\n'),
          ]),
          u('text', '\n'),
        ]),
        u('text', '\n'),
      ]),
    ]))
  })

  it('should render `footnote`s (#2)', () => {
    const input = u('root', [
      u('footnoteDefinition', {identifier: '1'}, [u('text', 'bravo')]),
      u('footnoteReference', {identifier: '1'}),
      u('footnote', [u('text', 'charlie')]),
    ])

    const result = toHAST(input)

    expect(result).toEqual(u('root', [
      u('element', {tagName: 'sup', properties: {
        id: 'fnref-1',
      }}, [
        u('element', {tagName: 'a', properties: {
          href: '#fn-1',
          className: ['footnote-ref'],
        }}, [u('text', '1')]),
      ]),
      u('text', '\n'),
      u('element', {tagName: 'sup', properties: {
        id: 'fnref-2',
      }}, [
        u('element', {tagName: 'a', properties: {
          href: '#fn-2',
          className: ['footnote-ref'],
        }}, [u('text', '2')]),
      ]),
      u('text', '\n'),
      u('element', {
        tagName: 'div',
        properties: {className: ['footnotes']},
      }, [
        u('text', '\n'),
        u('element', {tagName: 'hr', properties: {}}, []),
        u('text', '\n'),
        u('element', {tagName: 'ol', properties: {}}, [
          u('text', '\n'),
          u('element', {
            tagName: 'li',
            properties: {id: 'fn-1'},
          }, [
            u('text', '\n'),
            u('text', 'bravo'),
            u('text', '\n'),
            u('element', {
              tagName: 'a',
              properties: {
                href: '#fnref-1',
                className: ['footnote-backref'],
              },
            }, [u('text', '↩')]),
            u('text', '\n'),
          ]),
          u('text', '\n'),
          u('element', {
            tagName: 'li',
            properties: {id: 'fn-2'},
          }, [
            u('text', '\n'),
            u('text', 'charlie'),
            u('text', '\n'),
            u('element', {
              tagName: 'a',
              properties: {
                href: '#fnref-2',
                className: ['footnote-backref'],
              },
            }, [u('text', '↩')]),
            u('text', '\n'),
          ]),
          u('text', '\n'),
        ]),
        u('text', '\n'),
      ]),
    ]))
  })
})
