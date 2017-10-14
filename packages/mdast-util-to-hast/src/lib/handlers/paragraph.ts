import { all } from '../all'
import { H } from '../'
import { Paragraph } from 'typed-mdast'

/* Transform a paragraph. */
export function paragraph (h: H, node: Paragraph) {
  return h(node, 'p', all(h, node))
}
