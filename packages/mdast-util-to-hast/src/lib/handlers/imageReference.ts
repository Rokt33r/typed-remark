import * as mdurl from 'mdurl'
import { failsafe } from '../failsafe'
import { H } from '../'
import { Node } from 'typed-unist'
import { ImageReference } from 'typed-mdast'

/* Transform a reference to an image. */
export function imageReference (h: H, node: ImageReference): Node | Node[] {
  const def = h.definition(node.identifier)
  const props: {
    src: string
    alt: string
    title?: string
  } = {src: mdurl.encode((def && def.url) || ''), alt: node.alt}

  if (def && def.title !== null && def.title !== undefined) {
    props.title = def.title
  }

  return failsafe(h, node, def) || h(node, 'img', props)
}
