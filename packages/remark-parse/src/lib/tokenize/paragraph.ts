import { TokenizeMethod, Eat } from '../tokenizer'
import { RemarkParser } from '../RemarkParser'
import { Node, Point } from 'typed-unist'
import {
  isDecimal,
  trimTrailingLines,
  interrupt,
  trimLeft,
} from '../utils'

const C_NEWLINE = '\n'
const C_TAB = '\t'
const C_SPACE = ' '

const TAB_SIZE = 4

/* Tokenise paragraph. */
export const paragraph: TokenizeMethod = function (this: RemarkParser, eat: Eat, value: string, silent?: boolean): Node | boolean {
  const self = this
  const settings = self.options
  const commonmark = settings.commonmark
  const gfm = settings.gfm
  const tokenizers = self.blockTokenizers
  const interruptors = self.interruptParagraph
  let index = value.indexOf(C_NEWLINE)
  const length = value.length
  let position
  let subvalue: string
  let character
  let size
  let now: Point

  while (index < length) {
    /* Eat everything if there’s no following newline. */
    if (index === -1) {
      index = length
      break
    }

    /* Stop if the next character is NEWLINE. */
    if (value.charAt(index + 1) === C_NEWLINE) {
      break
    }

    /* In commonmark-mode, following indented lines
     * are part of the paragraph. */
    if (commonmark) {
      size = 0
      position = index + 1

      while (position < length) {
        character = value.charAt(position)

        if (character === C_TAB) {
          size = TAB_SIZE
          break
        } else if (character === C_SPACE) {
          size++
        } else {
          break
        }

        position++
      }

      if (size >= TAB_SIZE) {
        index = value.indexOf(C_NEWLINE, index + 1)
        continue
      }
    }

    subvalue = value.slice(index + 1)

    /* Check if the following code contains a possible
     * block. */
    if (interrupt(interruptors, tokenizers, self, [eat, subvalue, true])) {
      break
    }

    /* Break if the following line starts a list, when
     * already in a list, or when in commonmark, or when
     * in gfm mode and the bullet is *not* numeric. */
    if (
      tokenizers.list.call(self, eat, subvalue, true) &&
      (
        self.inList ||
        commonmark ||
        (gfm && !isDecimal(trimLeft(subvalue).charAt(0)))
      )
    ) {
      break
    }

    position = index
    index = value.indexOf(C_NEWLINE, index + 1)

    if (index !== -1 && value.slice(position, index).trim() === '') {
      index = position
      break
    }
  }

  subvalue = value.slice(0, index)

  if (subvalue.trim() === '') {
    eat(subvalue)

    return null
  }

  /* istanbul ignore if - never used (yet) */
  if (silent) {
    return true
  }

  now = eat.now()
  subvalue = trimTrailingLines(subvalue)

  return eat(subvalue)({
    type: 'paragraph',
    children: self.tokenizeInline(subvalue, now),
  } as Node)
} as TokenizeMethod
