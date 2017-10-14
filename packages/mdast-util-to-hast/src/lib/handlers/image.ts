import * as normalize from 'mdurl/encode'
import { H } from '../'
import { Image } from 'typed-mdast'

/* Transform an image. */
export function image (h: H, node: Image) {
  const props: {
    src: string
    alt: string
    title?: string
  } = {src: normalize(node.url), alt: node.alt}

  if (node.title != null) {
    props.title = node.title
  }

  return h(node, 'img', props)
}
