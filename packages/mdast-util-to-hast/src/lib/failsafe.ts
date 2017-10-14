import u from 'typed-unist-builder'
import { H } from './'
import { Parent } from 'typed-unist'
import { LinkReference, ImageReference, Definition } from 'typed-mdast'
import { all } from './all'

/* Return the content of a reference without definition
 * as markdown. */
export function failsafe (h: H, node: LinkReference | ImageReference, definition?: Definition) {
  const subtype = node.referenceType

  if (subtype !== 'collapsed' && subtype !== 'full' && !definition) {
    if (node.type === 'imageReference') {
      return u('text', '![' + node.alt + ']')
    }

    return [u('text', '[')].concat(all(h, node as Parent), u('text', ']'))
  }
}
