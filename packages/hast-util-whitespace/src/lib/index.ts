import { Node } from 'typed-unist'
import { TextNode } from 'typed-hast'

/* HTML white-space expression.
 * See <https://html.spec.whatwg.org/#space-character>. */
const re = /[ \t\n\f\r]/g

/* Check if `node` is a inter-element white-space. */
export function interElementWhiteSpace (node: Node | string): boolean {
  let value: string
  if (node && (node as Node).type === 'text') {
    value = (node as TextNode).value || ''
  } else if (typeof node === 'string') {
    value = node
  } else {
    return false
  }

  return value.replace(re, '') === ''
}
