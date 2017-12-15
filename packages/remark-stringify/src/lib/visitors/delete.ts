import { RemarkCompiler } from '../RemarkCompiler'
import { Delete } from 'typed-mdast'

export function strikethrough (this: RemarkCompiler, node: Delete) {
  return '~~' + this.all(node).join('') + '~~'
}
