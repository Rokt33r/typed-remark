import { Node } from 'typed-unist'
import u from 'typed-unist-builder'
import { H } from '../'

/* Transform an inline break. */
export function hardBreak (h: H, node: Node): Node[] {
  return [h(node, 'br'), u('text', '\n')]
}
