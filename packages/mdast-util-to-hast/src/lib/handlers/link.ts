import * as mdurl from 'mdurl'
import { H } from '../'
import { all } from '../all'
import { Node } from 'typed-unist'
import { Link } from 'typed-mdast'

/* Transform a link. */
export function link (h: H, node: Link): Node {
  const props: {
    href: string
    title?: string
  } = {href: mdurl.encode(node.url)}

  if (node.title !== null && node.title !== undefined) {
    props.title = node.title
  }

  return h(node, 'a', props, all(h, node))
}
