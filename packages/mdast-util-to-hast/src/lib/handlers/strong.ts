import { all } from '../all'
import { H } from '../'
import { Node } from 'typed-unist'
import { Strong } from 'typed-mdast'

/* Transform importance. */
export function strong (h: H, node: Strong): Node {
  return h(node, 'strong', all(h, node))
}
