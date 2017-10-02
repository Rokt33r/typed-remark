import { interrupt } from '../utils/interrupt'
import { TokenizeMethod, Eat, Apply } from '../tokenizer'
import { RemarkParser } from '../RemarkParser'
import { Node } from 'typed-unist'
import { locateBreak } from '../locate/break'

const MIN_BREAK_LENGTH = 2

export const hardBreak = function (this: RemarkParser, eat: Eat, value: string, silent?: boolean) {
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
