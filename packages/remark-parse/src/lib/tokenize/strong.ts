import { TokenizeMethod, Eat } from '../tokenizer'
import { RemarkParser } from '../RemarkParser'
import { Node, Point } from 'typed-unist'
import { isWhitespaceCharacter } from 'typed-string-utils'
import { locateStrong } from '../locate/strong'

const C_ASTERISK = '*'
const C_UNDERSCORE = '_'

export const strong: TokenizeMethod = function (this: RemarkParser, eat: Eat, value: string, silent?: boolean): Node | boolean {
  const self = this
  let index = 0
  let character = value.charAt(index)
  let now: Point
  let pedantic
  let marker
  let queue
  let subvalue
  let length
  let prev

  if (
    (character !== C_ASTERISK && character !== C_UNDERSCORE) ||
    value.charAt(++index) !== character
  ) {
    return
  }

  pedantic = self.options.pedantic
  marker = character
  subvalue = marker + marker
  length = value.length
  index++
  queue = ''
  character = ''

  if (pedantic && isWhitespaceCharacter(value.charAt(index))) {
    return
  }

  while (index < length) {
    prev = character
    character = value.charAt(index)

    if (
      character === marker &&
      value.charAt(index + 1) === marker &&
      (!pedantic || !isWhitespaceCharacter(prev))
    ) {
      character = value.charAt(index + 2)

      if (character !== marker) {
        if (!queue.trim()) {
          return
        }

        /* istanbul ignore if - never used (yet) */
        if (silent) {
          return true
        }

        now = eat.now()
        now.column += 2
        now.offset += 2

        return eat(subvalue + queue + subvalue)({
          type: 'strong',
          children: self.tokenizeInline(queue, now),
        } as Node)
      }
    }

    if (!pedantic && character === '\\') {
      queue += character
      character = value.charAt(++index)
    }

    queue += character
    index++
  }
} as TokenizeMethod

strong.locator = locateStrong
