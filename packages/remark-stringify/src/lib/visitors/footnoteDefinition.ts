import { RemarkCompiler } from '../RemarkCompiler'
import { FootnoteDefinition } from 'typed-mdast'

export function footnoteDefinition (this: RemarkCompiler, node: FootnoteDefinition) {
  const id = node.identifier.toLowerCase()
  const content = this.all(node).join('\n\n' + ' '.repeat(4))

  return '[^' + id + ']: ' + content
}
