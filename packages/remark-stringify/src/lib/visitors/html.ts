import { HTML } from 'typed-mdast'

export function html (node: HTML) {
  return node.value
}
