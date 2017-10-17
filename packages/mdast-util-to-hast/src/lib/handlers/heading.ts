import { H } from '../'
import { all } from '../all'
import { Node } from 'typed-unist'
import { Heading } from 'typed-mdast'

/* Transform a heading. */
export function heading (h: H, node: Heading): Node {
  return h(node, 'h' + node.depth, all(h, node))
}
