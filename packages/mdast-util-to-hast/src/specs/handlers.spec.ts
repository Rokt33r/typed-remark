import u from 'typed-unist-builder'
import { toHAST } from '../lib'
import { all } from '../lib/all'
import { H } from '../lib'
import { Text } from 'typed-unist'
import { Paragraph } from 'typed-mdast'

describe('Handlers option', () => {
  it('should override default handler', () => {
    const handlers = {
      paragraph (h: H, node: Paragraph) {
        (node.children[0] as Text).value = 'changed'
        return h(node, 'p', all(h, node))
      },
    }
    const input = u('paragraph', [u('text', 'bravo')])
    const options = { handlers }

    const result = toHAST(input, options)

    expect(result).toEqual(u('element', {tagName: 'p', properties: {}}, [u('text', 'changed')]))
  })
})
