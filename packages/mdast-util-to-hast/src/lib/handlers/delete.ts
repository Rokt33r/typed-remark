import { H } from '../'
import { all } from '../all'
import { Node } from 'typed-unist'
import { Delete } from 'typed-mdast'

/* Transform deletions. */
export function strikethrough (h: H, node: Delete): Node {
  return h(node, 'del', all(h, node))
}
