import { isWhitespaceCharacter } from 'typed-string-utils'
import { parseEntities } from 'typed-parse-entities'
import { locateTag } from '../locate/tag'
import { TokenizeMethod, Eat } from '../tokenizer'
import { RemarkParser } from '../RemarkParser'
import {
  Parent,
  Point,
} from 'typed-unist'

const C_LT = '<'
const C_GT = '>'
const C_AT_SIGN = '@'
const C_SLASH = '/'
const MAILTO = 'mailto:'
const MAILTO_LENGTH = MAILTO.length

/* Tokenise a link. */
export const autoLink: TokenizeMethod = function (this: RemarkParser, eat: Eat, value: string, silent?: boolean) {
  if (value.charAt(0) !== C_LT) {
    return
  }

  const self = this
  const length = value.length
  let index: number = 0
  let queue: string = ''
  let hasAtCharacter: boolean = false
  let link: string = ''
  let character: string
  let content: string
  let now: Point
  let tokenize

  index++
  let subvalue: string = C_LT

  while (index < length) {
    character = value.charAt(index)

    if (
      isWhitespaceCharacter(character) ||
      character === C_GT ||
      character === C_AT_SIGN ||
      (character === ':' && value.charAt(index + 1) === C_SLASH)
    ) {
      break
    }

    queue += character
    index++
  }

  if (!queue) {
    return
  }

  link += queue
  queue = ''

  character = value.charAt(index)
  link += character
  index++

  if (character === C_AT_SIGN) {
    hasAtCharacter = true
  } else {
    if (
      character !== ':' ||
      value.charAt(index + 1) !== C_SLASH
    ) {
      return
    }

    link += C_SLASH
    index++
  }

  while (index < length) {
    character = value.charAt(index)

    if (isWhitespaceCharacter(character) || character === C_GT) {
      break
    }

    queue += character
    index++
  }

  character = value.charAt(index)

  if (!queue || character !== C_GT) {
    return
  }

  /* istanbul ignore if - never used (yet) */
  if (silent) {
    return true
  }

  link += queue
  content = link
  subvalue += link + character
  now = eat.now()
  now.column++
  now.offset++

  if (hasAtCharacter) {
    if (link.slice(0, MAILTO_LENGTH).toLowerCase() === MAILTO) {
      content = content.substr(MAILTO_LENGTH)
      now.column += MAILTO_LENGTH
      now.offset += MAILTO_LENGTH
    } else {
      link = MAILTO + link
    }
  }

  /* Temporarily remove support for escapes in autolinks. */
  tokenize = self.inlineTokenizers.escape
  self.inlineTokenizers.escape = null

  const exitLink = self.enterLink()

  const contentNodes = self.tokenizeInline(content, now)

  self.inlineTokenizers.escape = tokenize

  exitLink()

  return eat(subvalue)({
    type: 'link',
    title: null,
    url: parseEntities(link),
    children: contentNodes,
  } as Parent)
} as TokenizeMethod

autoLink.locator = locateTag
autoLink.notInLink = true
