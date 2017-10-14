import { collapseWhitespace } from 'typed-string-utils'
import u from 'typed-unist-builder'
import { H } from '../'
import { InlineCode } from 'typed-mdast'

/* Transform inline code. */
export function inlineCode (h: H, node: InlineCode) {
  return h(node, 'code', [u('text', collapseWhitespace(node.value))])
}
