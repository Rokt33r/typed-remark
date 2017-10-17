import { wrap } from '../wrap'
import { all } from '../all'
import { H } from '../'
import { List } from 'typed-mdast'
import { Node } from 'typed-unist'

/* Transform a list. */
export function list (h: H, node: List): Node {
  const props: {
    start?: number
  } = {}
  const name = node.ordered ? 'ol' : 'ul'

  if (typeof node.start === 'number' && node.start !== 1) {
    props.start = node.start
  }

  return h(node, name, props, wrap(all(h, node), true))
}
