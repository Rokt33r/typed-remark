import { H } from '../'
import { all } from '../all'
import { Emphasis } from 'typed-mdast'

/* Transform emphasis. */
export function emphasis (h: H, node: Emphasis) {
  return h(node, 'em', all(h, node))
}
