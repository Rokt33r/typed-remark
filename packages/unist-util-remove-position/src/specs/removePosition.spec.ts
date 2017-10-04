import unified from 'typed-unified'
import parse from 'typed-remark-parse'
import { removePosition } from '../lib'
import { Node } from 'typed-unist'
import u from 'typed-unist-builder'

const processor = unified().use(parse)

describe('removePosition', () => {
  const ast = processor.parse('Some **strong**, _emphasis_, and `code`.')

  it('removes position softly(sets undefined)', () => {
    const empty: Partial<Node> = { position: undefined }

    const result = removePosition(ast)

    expect(result).toEqual(
      u('root', empty, [
        u('paragraph', empty, [
          u('text', empty, 'Some '),
          u('strong', empty, [u('text', empty, 'strong')]),
          u('text', empty, ', '),
          u('emphasis', empty, [u('text', empty, 'emphasis')]),
          u('text', empty, ', and '),
          u('inlineCode', empty, 'code'),
          u('text', empty, '.'),
        ]),
      ]),
    )
  })

  it('removes position by force(deletes value)', () => {
    const result = removePosition(ast, true)

    expect(result).toEqual(
      u('root', [
        u('paragraph', [
          u('text', 'Some '),
          u('strong', [u('text', 'strong')]),
          u('text', ', '),
          u('emphasis', [u('text', 'emphasis')]),
          u('text', ', and '),
          u('inlineCode', 'code'),
          u('text', '.'),
        ]),
      ]),
    )
  })
})
