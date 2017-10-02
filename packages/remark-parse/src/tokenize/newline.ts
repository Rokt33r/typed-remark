import { TokenizeMethod, Eat } from '../tokenizer'
import { RemarkParser } from '../RemarkParser'
import { isWhitespaceCharacter } from '../utils/isWhitespaceCharacter'

/* Tokenise newline. */
export const newline: TokenizeMethod = function (this: RemarkParser, eat: Eat, value: string, silent?: boolean): void | boolean {
  let character = value.charAt(0)
  let length
  let subvalue
  let queue
  let index

  if (character !== '\n') {
    return
  }

  /* istanbul ignore if - never used (yet) */
  if (silent) {
    return true
  }

  index = 1
  length = value.length
  subvalue = character
  queue = ''

  while (index < length) {
    character = value.charAt(index)

    if (!isWhitespaceCharacter(character)) {
      break
    }

    queue += character

    if (character === '\n') {
      subvalue += queue
      queue = ''
    }

    index++
  }

  eat(subvalue)
} as TokenizeMethod
