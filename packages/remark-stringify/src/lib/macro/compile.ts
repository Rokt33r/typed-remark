import { RemarkCompiler } from '../RemarkCompiler'
import { compact } from 'typed-mdast-util-compact'

/**
 * Stringify the given tree.
 */
export function compile (this: RemarkCompiler) {
  return this.visit(compact(this.tree, this.options.commonmark));
}
