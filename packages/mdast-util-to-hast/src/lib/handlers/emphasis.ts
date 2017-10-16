import { H } from '../'
import { all } from '../all'
import { Node } from 'typed-unist'
import { Emphasis } from 'typed-mdast'

/* Transform emphasis. */
export function emphasis (h: H, node: Emphasis): Node {
  return h(node, 'em', all(h, node))
}
