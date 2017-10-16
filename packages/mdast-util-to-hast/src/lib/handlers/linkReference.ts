import * as mdurl from 'mdurl'
import { failsafe } from '../failsafe'
import { H } from '../'
import { LinkReference } from 'typed-mdast'
import { all } from '../all'

/* Transform a reference to a link. */
export function linkReference (h: H, node: LinkReference) {
  const def = h.definition(node.identifier)
  const props: {
    href: string
    title?: string
  } = {href: mdurl.encode((def && def.url) || '')}

  if (def && def.title !== null && def.title !== undefined) {
    props.title = def.title
  }

  return failsafe(h, node, def) || h(node, 'a', props, all(h, node))
}
