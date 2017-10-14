import u from 'typed-unist-builder'
import { H } from '../'
import { HTML } from 'typed-mdast'

/* Return either a `raw` node, in dangerous mode, or
 * nothing. */
export function html (h: H, node: HTML) {
  return h.dangerous ? h.augment(node, u('raw', node.value)) : null
}
