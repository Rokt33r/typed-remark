import { collapseWhitespace } from 'typed-string-utils'
import u from 'typed-unist-builder'
import { H } from '../'
import { Node } from 'typed-unist'
import { InlineCode } from 'typed-mdast'

/* Transform inline code. */
export function inlineCode (h: H, node: InlineCode): Node {
  return h(node, 'code', [u('text', collapseWhitespace(node.value))])
}
