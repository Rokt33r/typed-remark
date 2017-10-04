import { visit } from '../lib'
import { Node } from 'typed-unist'
import unified from 'typed-unified'
import parse from 'typed-remark-parse'

const procesror = unified().use(parse)

const tree = procesror.parse('Some _emphasis_, **importance**, and `code`.')

const types = [
  'root',
  'paragraph',
  'text',
  'emphasis',
  'text',
  'text',
  'strong',
  'text',
  'text',
  'inlineCode',
  'text',
]

const reverseTypes = [
  'root',
  'paragraph',
  'text',
  'inlineCode',
  'text',
  'strong',
  'text',
  'text',
  'emphasis',
  'text',
  'text',
]

describe('visit', () => {
  it('iterates over all nodes', () => {
    let n = -1
    const handler = (node: Node) => {
      expect(node.type).toBe(types[++n])
    }

    visit(tree, handler)

    expect(n).toBe(types.length - 1)
  })

  it('iterates over all nodes, backwards', () => {
    let n = -1
    const handler = (node: Node) => {
      expect(node.type).toBe(reverseTypes[++n])
    }

    visit(tree, handler, true)

    expect(n).toBe(reverseTypes.length - 1)
  })

  it('visits only given `types`', () => {
    let n = 0
    const handler = (node: Node) => {
      n++
      expect(node.type).toBe('text')
    }

    visit(tree, 'text', handler)

    expect(n).toBe(6)
  })

  it('stops if visitor returns false', () => {
    let n = -1
    const STOP = 5
    const handler = (node: Node) => {
      expect(node.type).toBe(types[++n])
      if (n === STOP) {
        return false
      }
    }

    visit(tree, handler)

    expect(n).toBe(STOP)
  })

  it('stops if visitor returns false, backwards', () => {
    let n = -1
    const STOP = 5
    const handler = (node: Node) => {
      expect(node.type).toBe(reverseTypes[++n])
      if (n === STOP) {
        return false
      }
    }

    visit(tree, handler, true)

    expect(n).toBe(STOP)
  })
})
