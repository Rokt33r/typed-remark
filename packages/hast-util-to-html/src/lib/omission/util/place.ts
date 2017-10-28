import { Parent, Node } from 'typed-unist'

/** Get the position of `node` in `parent`. */
export function place (parent: Parent, child: Node) {
  return parent && parent.children && parent.children.indexOf(child)
}
