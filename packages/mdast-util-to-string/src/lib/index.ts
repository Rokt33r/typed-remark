import { Node } from 'typed-unist'

/* Get the text content of a node.  If the node itself
 * does not expose plain-text fields, `toString` will
 * recursivly try its children. */
export function toString (node: Node) {
  return valueOf(node) ||
    (node.children && node.children.map(toString).join('')) ||
    ''
}

/* Get the value of `node`.  Checks, `value`,
 * `alt`, and `title`, in that order. */
function valueOf (node: Node): string {
  if (!node) {
    return ''
  }
  return node.value ? node.value : (node.alt ? node.alt : node.title) || ''
}
