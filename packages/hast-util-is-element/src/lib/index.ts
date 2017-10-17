import { Node } from 'typed-unist'
import { Element } from 'typed-hast'

export function isElement (node: Node, tagNames?: string | string[]): boolean {
  if (
    node.type !== 'element' ||
    typeof (node as Element).tagName !== 'string'
  ) {
    return false
  }

  if (tagNames == null) {
    return true
  }

  if (typeof tagNames === 'string') {
    return (node as Element).tagName === tagNames
  }

  return tagNames.indexOf((node as Element).tagName) !== -1
}
