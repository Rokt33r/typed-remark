import { TokenizeMethod, Eat } from '../tokenizer'
import { RemarkParser } from '../RemarkParser'
import { Node } from 'typed-unist'
import { isWhitespaceCharacter } from '../utils'
import { locateDelete } from '../locate/delete'

const C_TILDE = '~'
const DOUBLE = '~~'

export const strikethrough: TokenizeMethod = function (this: RemarkParser, eat: Eat, value: string, silent?: boolean): Node | boolean {
  const self = this
  let character = ''
  let previous = ''
  let preceding = ''
  let subvalue = ''
  let index
  let length
  let now

  if (
    !self.options.gfm ||
    value.charAt(0) !== C_TILDE ||
    value.charAt(1) !== C_TILDE ||
    isWhitespaceCharacter(value.charAt(2))
  ) {
    return
  }

  index = 1
  length = value.length
  now = eat.now()
  now.column += 2
  now.offset += 2

  while (++index < length) {
    character = value.charAt(index)

    if (
      character === C_TILDE &&
      previous === C_TILDE &&
      (!preceding || !isWhitespaceCharacter(preceding))
    ) {
      /* istanbul ignore if - never used (yet) */
      if (silent) {
        return true
      }

      return eat(DOUBLE + subvalue + DOUBLE)({
        type: 'delete',
        children: self.tokenizeInline(subvalue, now),
      } as Node)
    }

    subvalue += previous
    preceding = previous
    previous = character
  }
} as TokenizeMethod

strikethrough.locator = locateDelete
