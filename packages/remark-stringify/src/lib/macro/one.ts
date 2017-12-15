import { Node, Parent } from 'typed-unist'
import { RemarkCompiler } from '../RemarkCompiler'

export function one (this: RemarkCompiler, node: Node, parent: Parent) {
  const self = this
  const visitors = self.visitors

  /* Fail on unknown nodes. */
  if (typeof visitors[node.type] !== 'function') {
    self.file.fail(
      new Error(
        'Missing compiler for node of type `' +
        node.type + '`: `' + node + '`',
      ),
      node,
    )
  }

  return visitors[node.type].call(self, node, parent)
}
