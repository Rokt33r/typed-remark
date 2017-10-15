import { Parent, Node, Text } from 'typed-unist'
import { one } from './one'
import { trimLeft } from 'typed-string-utils'
import { H } from './'

/* Transform the children of `parent`. */
export function all (h: H, parent: Parent): Node[] {
  const nodes = parent.children || []
  const length = nodes.length
  let values: Node[] = []
  let index = -1

  while (++index < length) {
    const result = one(h, nodes[index], parent)
    if (result) {
      if (index && nodes[index - 1].type === 'break') {
        if ((result as Text).value) {
          trimLeftOfValue(result as Text)
        }

        const head = (result as Parent).children && (result as Parent).children[0]

        if (head && (head as Text).value) {
          trimLeftOfValue(head as Text)
        }
      }
      values = values.concat(result)
    }
  }

  return values
}

function trimLeftOfValue (node: Text) {
  node.value = trimLeft(node.value)
}
