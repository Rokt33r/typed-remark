import { H } from '../'
import { all } from '../all'
import { Delete } from 'typed-mdast'

/* Transform deletions. */
export function strikethrough (h: H, node: Delete) {
  return h(node, 'del', all(h, node))
}
