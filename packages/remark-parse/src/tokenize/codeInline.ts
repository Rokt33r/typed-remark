import { isWhitespaceCharacter } from '../utils/isWhitespaceCharacter'
import { TokenizeMethod, Eat } from '../tokenizer'
import { RemarkParser } from '../RemarkParser'
import { Text } from 'typed-unist'
import { locateInlineCode } from '../locate/codeInline'

const C_TICK = '`'

/* Tokenise inline code. */
export const inlineCode: TokenizeMethod = function (this: RemarkParser, eat: Eat, value: string, silent?: boolean) {
  let length = value.length
  let index = 0
  let queue = ''
  let tickQueue = ''
  let contentQueue: string
  let subqueue
  let count
  let openingCount
  let subvalue
  let character
  let found
  let next

  while (index < length) {
    if (value.charAt(index) !== C_TICK) {
      break
    }

    queue += C_TICK
    index++
  }

  if (!queue) {
    return
  }

  subvalue = queue
  openingCount = index
  queue = ''
  next = value.charAt(index)
  count = 0

  while (index < length) {
    character = next
    next = value.charAt(index + 1)

    if (character === C_TICK) {
      count++
      tickQueue += character
    } else {
      count = 0
      queue += character
    }

    if (count && next !== C_TICK) {
      if (count === openingCount) {
        subvalue += queue + tickQueue
        found = true
        break
      }

      queue += tickQueue
      tickQueue = ''
    }

    index++
  }

  if (!found) {
    if (openingCount % 2 !== 0) {
      return
    }

    queue = ''
  }

  /* istanbul ignore if - never used (yet) */
  if (silent) {
    return true
  }

  contentQueue = ''
  subqueue = ''
  length = queue.length
  index = -1

  while (++index < length) {
    character = queue.charAt(index)

    if (isWhitespaceCharacter(character)) {
      subqueue += character
      continue
    }

    if (subqueue) {
      if (contentQueue) {
        contentQueue += subqueue
      }

      subqueue = ''
    }

    contentQueue += character
  }

  return eat(subvalue)({
    type: 'inlineCode',
    value: contentQueue,
  } as Text)
} as TokenizeMethod

inlineCode.locator = locateInlineCode
