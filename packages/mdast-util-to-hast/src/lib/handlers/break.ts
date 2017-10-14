import { Node } from 'typed-unist'
import u from 'typed-unist-builder'

/* Transform an inline break. */
export function hardBreak (h, node: Node) {
  return [h(node, 'br'), u('text', '\n')]
}
