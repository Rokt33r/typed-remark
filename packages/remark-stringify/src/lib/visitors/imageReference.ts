import { RemarkCompiler } from '../RemarkCompiler'
import { stringifyLabel } from '../util/stringifyLabel'
import { ImageReference } from 'typed-mdast'

export function imageReference (this: RemarkCompiler, node: ImageReference) {
  return '![' + (this.encode(node.alt, node) || '') + ']' + stringifyLabel(node)
}
