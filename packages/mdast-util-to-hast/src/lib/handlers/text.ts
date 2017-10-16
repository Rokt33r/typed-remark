import u from 'typed-unist-builder'
import { H } from '../'
import { Node } from 'typed-unist'
import { TextNode } from 'typed-mdast'
import { collapseLines } from 'typed-string-utils'

/* Transform text. */
export function text (h: H, node: TextNode): Node {
  return h.augment(node, u('text', collapseLines(node.value)))
}
