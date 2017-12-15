import { RemarkCompiler } from '../RemarkCompiler'
import { InlineCode } from 'typed-mdast'
import { longestStreak } from 'typed-string-utils'

/* Stringify inline code.
 *
 * Knows about internal ticks (`\``), and ensures one more
 * tick is used to enclose the inline code:
 *
 *     ```foo ``bar`` baz```
 *
 * Even knows about inital and final ticks:
 *
 *     `` `foo ``
 *     `` foo` ``
 */
export function inlineCode (this: RemarkCompiler, node: InlineCode) {
  const value = node.value
  const ticks = '`'.repeat(longestStreak(value, '`') + 1)
  let start = ticks
  let end = ticks

  if (value.charAt(0) === '`') {
    start += ' '
  }

  if (value.charAt(value.length - 1) === '`') {
    end = ' ' + end
  }

  return start + value + end
}
