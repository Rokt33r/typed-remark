import u from 'typed-unist-builder'
import { H } from '../'
import { TextNode } from 'typed-mdast'
import { collapseLines } from 'typed-string-utils'

/* Transform text. */
export function text (h: H, node: TextNode) {
  return h.augment(node, u('text', collapseLines(node.value)))
}
