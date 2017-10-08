import { TokenizeMethod, Eat } from '../tokenizer'
import { RemarkParser } from '../RemarkParser'
import { Node } from 'typed-unist'
import {
  isWordCharacter,
  isWhitespaceCharacter,
} from 'typed-string-utils'
import { locateEmphasis } from '../locate/emphasis'

const C_ASTERISK = '*'
const C_UNDERSCORE = '_'

export const emphasis: TokenizeMethod = function (this: RemarkParser, eat: Eat, value: string, silent?: boolean): Node | boolean {
  const self = this
  let index = 0
  let character = value.charAt(index)
  let now
  let pedantic
  let marker
  let queue
  let subvalue
  let length
  let prev

  if (character !== C_ASTERISK && character !== C_UNDERSCORE) {
    return
  }

  pedantic = self.options.pedantic
  subvalue = character
  marker = character
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

    if (character === marker && (!pedantic || !isWhitespaceCharacter(prev))) {
      character = value.charAt(++index)

      if (character !== marker) {
        if (!queue.trim() || prev === marker) {
          return
        }

        if (!pedantic && marker === C_UNDERSCORE && isWordCharacter(character)) {
          queue += marker
          continue
        }

        /* istanbul ignore if - never used (yet) */
        if (silent) {
          return true
        }

        now = eat.now()
        now.column++
        now.offset++

        return eat(subvalue + queue + marker)({
          type: 'emphasis',
          children: self.tokenizeInline(queue, now),
        } as Node)
      }

      queue += marker
    }

    if (!pedantic && character === '\\') {
      queue += character
      character = value.charAt(++index)
    }

    queue += character
    index++
  }
} as TokenizeMethod

emphasis.locator = locateEmphasis
