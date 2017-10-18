import u from 'typed-unist-builder'
import { Node } from 'typed-unist'

/**
 * Wrap `nodes` with newlines between each entry.
 * Optionally adds newlines at the start and end.
 */
export function wrap (nodes: Node[], loose?: boolean): Node[] {
  const result = []
  let index = -1
  const length = nodes.length

  if (loose) {
    result.push(u('text', '\n'))
  }

  while (++index < length) {
    if (index) {
      result.push(u('text', '\n'))
    }

    result.push(nodes[index])
  }

  if (loose && nodes.length !== 0) {
    result.push(u('text', '\n'))
  }

  return result
}
