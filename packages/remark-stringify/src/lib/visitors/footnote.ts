import { RemarkCompiler } from '../RemarkCompiler'
import { Footnote } from 'typed-mdast'

export function footnote (this: RemarkCompiler, node: Footnote) {
  return '[^' + this.all(node).join('') + ']'
}
