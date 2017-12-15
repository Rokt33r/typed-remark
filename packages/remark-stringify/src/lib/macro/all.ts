import { Parent } from 'typed-unist'
import { RemarkCompiler } from '../RemarkCompiler'

/**
 * Visit all children of `parent`.
 */
export function all (this: RemarkCompiler, parent: Parent) {
  const self = this
  const children = parent.children
  const length = children.length
  const results = []
  let index = -1

  while (++index < length) {
    results[index] = self.visit(children[index], parent)
  }

  return results
}
