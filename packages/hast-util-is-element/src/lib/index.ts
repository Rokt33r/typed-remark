import { Node } from 'typed-unist'

export function isElement (node: Node, tagNames?: string | string[]): boolean {
/* Check if, whether `tagNames` is given, a node is an element
* or an element matching `tagNames`. */
  if (node.type !== 'element' || typeof (node as any).tagName !== 'string') {
    return false
  }

  if (tagNames == null) {
    return true
  }

  const name = (node as any).tagName

  if (typeof tagNames === 'string') {
    return name === tagNames
  }

  return tagNames.indexOf(name) !== -1
}
