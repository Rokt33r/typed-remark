import * as normalize from 'mdurl/encode'
import { H } from '../'
import { Link } from 'typed-mdast'
import { all } from '../all'

/* Transform a link. */
export function link (h: H, node: Link) {
  const props: {
    href: string
    title?: string
  } = {href: normalize(node.url)}

  if (node.title !== null && node.title !== undefined) {
    props.title = node.title
  }

  return h(node, 'a', props, all(h, node))
}
