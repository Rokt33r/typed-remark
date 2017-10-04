import unified from 'typed-unified'
import remarkParse from '../lib'
import u from 'typed-unist-builder'

describe('remark-parse', () => {
  it('parses string', () => {
    const processor = unified().use(remarkParse)

    const result = processor.parse('Alfred')

    const position = {
      start: { column: 1, line: 1, offset: 0},
      end: { column: 7, line: 1, offset: 6 },
    }
    expect(result).toEqual(
      u('root', { position }, [
        u('paragraph', {
          position: {
            ...position,
            indent: [],
          },
        },
        [
          u('text', {
            position: {
              ...position,
              indent: [],
            },
          }, 'Alfred'),
        ]),
      ]),
    )
  })

  it('parses without position', () => {
    const processor = unified().use(remarkParse, {
      position: false,
    })

    const result = processor.parse('<foo></foo>')

    expect(result).toEqual(
      u('root', [
        u('paragraph', [
          u('html', '<foo>'),
          u('html', '</foo>'),
        ]),
      ]),
    )
  })
})
