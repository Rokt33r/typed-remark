import * as mdurl from 'mdurl'
import { H } from '../'
import { Image } from 'typed-mdast'

/* Transform an image. */
export function image (h: H, node: Image) {
  const props: {
    src: string
    alt: string
    title?: string
  } = {src: mdurl.encode(node.url), alt: node.alt}

  if (node.title != null) {
    props.title = node.title
  }

  return h(node, 'img', props)
}
