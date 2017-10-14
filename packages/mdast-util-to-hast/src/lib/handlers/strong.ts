import { all } from '../all'
import { H } from '../'
import { Strong } from 'typed-mdast'

/* Transform importance. */
export function strong (h: H, node: Strong) {
  return h(node, 'strong', all(h, node))
}
