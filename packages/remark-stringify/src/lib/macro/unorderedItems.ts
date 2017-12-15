import { Node } from 'typed-unist'
import { RemarkCompiler } from '../RemarkCompiler'

/* Visit unordered list items.
 * Uses `options.bullet` as each item's bullet.
 */
export function unorderedItems (this: RemarkCompiler, node: Node) {
  const self = this
  const bullet = self.options.bullet
  const fn = self.visitors.listItem
  const children = node.children
  const length = children.length
  let index = -1
  const values = []

  while (++index < length) {
    values[index] = fn.call(self, children[index], node, index, bullet)
  }

  return values.join('\n')
}
