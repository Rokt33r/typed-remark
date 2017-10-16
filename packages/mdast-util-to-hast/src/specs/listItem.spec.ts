import u from 'typed-unist-builder'
import { toHAST } from '../lib'

describe('ListItem', () => {
  it('should transform tight `listItem`s to a `li` element', () => {
    const input = u('listItem', [
      u('paragraph', [u('text', 'november')]),
    ])

    const result = toHAST(input)

    expect(result).toEqual(u('element', {tagName: 'li', properties: {}}, [
      u('text', 'november'),
    ]))
  })

  it('should transform loose `listItem`s to a `li` element', () => {
    const input = u('listItem', [
      u('paragraph', [u('text', 'oscar')]),
      u('paragraph', [u('text', 'papa')]),
    ])

    const result = toHAST(input)

    expect(result).toEqual(u('element', {tagName: 'li', properties: {}}, [
      u('text', '\n'),
      u('element', {tagName: 'p', properties: {}}, [
        u('text', 'oscar'),
      ]),
      u('text', '\n'),
      u('element', {tagName: 'p', properties: {}}, [
        u('text', 'papa'),
      ]),
      u('text', '\n'),
    ]))
  })

  it('should support checkboxes in tight `listItem`s', () => {
    const input = u('listItem', {checked: true}, [
      u('paragraph', [u('text', 'québec')]),
    ])

    const result = toHAST(input)

    expect(result).toEqual(u('element', {tagName: 'li', properties: {className: ['task-list-item']}}, [
      u('element', {
        tagName: 'input',
        properties: {
          type: 'checkbox',
          checked: true,
          disabled: true,
        },
      }, []),
      u('text', ' '),
      u('text', 'québec'),
    ]))
  })

  it('should support checkboxes in loose `listItem`s', () => {
    const input = u('listItem', {checked: false}, [
      u('paragraph', [u('text', 'romeo')]),
      u('paragraph', [u('text', 'sierra')]),
    ])

    const result = toHAST(input)

    expect(result).toEqual(u('element', {tagName: 'li', properties: {className: ['task-list-item']}}, [
      u('text', '\n'),
      u('element', {tagName: 'p', properties: {}}, [
        u('element', {
          tagName: 'input',
          properties: {
            type: 'checkbox',
            checked: false,
            disabled: true,
          },
        }, []),
        u('text', ' '),
        u('text', 'romeo'),
      ]),
      u('text', '\n'),
      u('element', {tagName: 'p', properties: {}}, [
        u('text', 'sierra'),
      ]),
      u('text', '\n'),
    ]))
  })

  it('should support checkboxes in `listItem`s without paragraph', () => {
    const input = u('listItem', {checked: true}, [
      u('html', '<!--tango-->'),
    ])

    const result = toHAST(input)

    expect(result).toEqual(u('element', {tagName: 'li', properties: {className: ['task-list-item']}}, [
      u('text', '\n'),
      u('element', {tagName: 'p', properties: {}}, [
        u('element', {
          tagName: 'input',
          properties: {
            type: 'checkbox',
            checked: true,
            disabled: true,
          },
        }, []),
      ]),
      u('text', '\n'),
    ]))
  })

  it('should support `listItem`s without children', () => {
    const input = u('listItem', [])

    const result = toHAST(input)

    expect(result).toEqual(u('element', {tagName: 'li', properties: {}}, []))
  })

  it('should support checkboxes in `listItem`s without children', () => {
    const input = u('listItem', {checked: true}, [])

    const result = toHAST(input)

    expect(result).toEqual(u('element', {tagName: 'li', properties: {className: ['task-list-item']}}, [
      u('text', '\n'),
      u('element', {tagName: 'p', properties: {}}, [
        u('element', {
          tagName: 'input',
          properties: {
            type: 'checkbox',
            checked: true,
            disabled: true,
          },
        }, []),
      ]),
      u('text', '\n'),
    ]))
  })

  it('should support lists in `listItem`s', () => {
    const input = u('listItem', [
      u('list', {ordered: false}, [
        u('listItem', [
          u('paragraph', [
            u('text', 'Alpha'),
          ]),
        ]),
      ]),
    ])

    const result = toHAST(input)

    expect(result).toEqual(u('element', {tagName: 'li', properties: {}}, [
      u('text', '\n'),
      u('element', {tagName: 'ul', properties: {}}, [
        u('text', '\n'),
        u('element', {tagName: 'li', properties: {}}, [
          u('text', 'Alpha'),
        ]),
        u('text', '\n'),
      ]),
      u('text', '\n'),
    ]))
  })
})
