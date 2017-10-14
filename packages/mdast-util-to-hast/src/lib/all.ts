import { Parent, Node } from 'typed-unist'
import { one } from './one'
import { trimLeft } from 'typed-string-utils'
import { H } from './'

/* Transform the children of `parent`. */
export function all (h: H, parent: Parent): Node[] {
  const nodes = parent.children || []
  const length = nodes.length
  let values: Node[] = []
  let index = -1
  let result
  let head

  while (++index < length) {
    result = one(h, nodes[index], parent)

    if (result) {
      if (index && nodes[index - 1].type === 'break') {
        if (result.value) {
          result.value = trimLeft(result.value)
        }

        head = result.children && result.children[0]

        if (head && head.value) {
          head.value = trimLeft(head.value)
        }
      }

      values = values.concat(result)
    }
  }

  return values
}
