import { all } from '../all'
import { wrap } from '../wrap'
import { H } from '../'
import { Node } from 'typed-unist'
import { Blockquote } from 'typed-mdast'

/* Transform a block quote. */
export function blockquote (h: H, node: Blockquote): Node {
  return h(node, 'blockquote', wrap(all(h, node), true))
}
