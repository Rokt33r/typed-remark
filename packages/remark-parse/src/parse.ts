import { RemarkParser } from './RemarkParser'
import {
  Parent,
  Node,
  Point,
} from 'typed-unist'

const C_NEWLINE = '\n'
const EXPRESSION_LINE_BREAKS = /\r\n|\r/g

export function parse (this: RemarkParser): Node {
  let value: string = String(this.file)
  const start: Point = { line: 1, column: 1, offset: 0 }
  const content = { ...start }

  /* Clean non-unix newlines: `\r\n` and `\r` are all
   * changed to `\n`.  This should not affect positional
   * information. */
  value = value.replace(EXPRESSION_LINE_BREAKS, C_NEWLINE)

  /**
   * If value is started from 0xFEFF, discard the char.
   */
  if (value.charCodeAt(0) === 0xFEFF) {
    value = value.slice(1)

    content.column++
    content.offset++
  }

  const node: Parent = {
    type: 'root',
    children: this.tokenizeBlock(value, content),
    position: {
      start,
      end: this.eof || { ...start },
    },
  }

  // FIXME: Add unist-util-remove-position later
  // if (!this.options.position) {
  //   removePosition(node, true)
  // }

  return node
}
