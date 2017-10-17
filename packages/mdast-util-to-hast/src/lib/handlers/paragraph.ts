import { all } from '../all'
import { H } from '../'
import { Node } from 'typed-unist'
import { Paragraph } from 'typed-mdast'

/* Transform a paragraph. */
export function paragraph (h: H, node: Paragraph): Node {
  return h(node, 'p', all(h, node))
}
