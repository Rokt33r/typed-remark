import { Parent } from 'typed-unist'
import { Blockquote } from 'typed-mdast'
import { all } from '../all'
import { wrap } from '../wrap'
import { H } from '../'

/* Transform a block quote. */
export function blockquote (h: H, node: Blockquote) {
  return h(node, 'blockquote', wrap(all(h, node), true))
}
