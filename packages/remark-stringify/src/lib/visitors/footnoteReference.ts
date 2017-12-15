import { RemarkCompiler } from '../RemarkCompiler'
import { FootnoteReference } from 'typed-mdast'

export function footnoteReference (this: RemarkCompiler, node: FootnoteReference) {
  return '[^' + node.identifier + ']'
}
