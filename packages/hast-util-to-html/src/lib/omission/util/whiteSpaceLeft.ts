import { is } from 'typed-unist-util-is'
import { interElementWhiteSpace } from 'typed-hast-util-whitespace'
import { Node } from 'typed-unist'
import { TextNode } from 'typed-hast'

/** Check if `node` starts with white-space. */
export function whiteSpaceLeft (node: Node) {
  return is('text', node) && interElementWhiteSpace((node as TextNode).value.charAt(0))
}
