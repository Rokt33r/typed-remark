import { TokenizeMethod, Eat } from '../tokenizer'
import { RemarkParser } from '../RemarkParser'
import { locateBreak } from '../locate/break'

const MIN_BREAK_LENGTH = 2

export const hardBreak: TokenizeMethod = function (this: RemarkParser, eat: Eat, value: string, silent?: boolean) {
  const length = value.length
  let index = -1
  let queue = ''
  let character

  while (++index < length) {
    character = value.charAt(index)

    if (character === '\n') {
      if (index < MIN_BREAK_LENGTH) {
        return
      }

      /* istanbul ignore if - never used (yet) */
      if (silent) {
        return true
      }

      queue += character

      return eat(queue)({type: 'break'})
    }

    if (character !== ' ') {
      return
    }

    queue += character
  }
} as TokenizeMethod

hardBreak.locator = locateBreak
