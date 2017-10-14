import { H } from '../'
import { Heading } from 'typed-mdast'
import { all } from '../all'

/* Transform a heading. */
export function heading (h: H, node: Heading) {
  return h(node, 'h' + node.depth, all(h, node))
}
