import { RemarkCompiler } from '../RemarkCompiler'
import { Blockquote } from 'typed-mdast'

export function blockquote (this: RemarkCompiler, node: Blockquote) {
  const values = this.block(node).split('\n')
  const result = []
  const length = values.length
  let index = -1
  let value

  while (++index < length) {
    value = values[index]
    result[index] = (value ? ' ' : '') + value
  }

  return '>' + result.join('\n>')
}
