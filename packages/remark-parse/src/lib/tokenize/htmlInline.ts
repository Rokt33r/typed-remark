import { TokenizeMethod, Eat } from '../tokenizer'
import { RemarkParser } from '../RemarkParser'
import { Node } from 'typed-unist'
import { isAlphabetical } from '../utils/isAlphabetical'
import { locateTag } from '../locate/tag'
import { tag } from '../utils/html'

const EXPRESSION_HTML_LINK_OPEN = /^<a /i
const EXPRESSION_HTML_LINK_CLOSE = /^<\/a>/i

export const inlineHTML: TokenizeMethod = function (this: RemarkParser, eat: Eat, value: string, silent?: boolean): Node | boolean {
  const self = this
  const length = value.length
  let character
  let subvalue

  if (value.charAt(0) !== '<' || length < 3) {
    return
  }

  character = value.charAt(1)

  if (
    !isAlphabetical(character) &&
    character !== '?' &&
    character !== '!' &&
    character !== '/'
  ) {
    return
  }

  subvalue = value.match(tag)

  if (!subvalue) {
    return
  }

  /* istanbul ignore if - not used yet. */
  if (silent) {
    return true
  }

  subvalue = subvalue[0]

  if (!self.inLink && EXPRESSION_HTML_LINK_OPEN.test(subvalue)) {
    self.inLink = true
  } else if (self.inLink && EXPRESSION_HTML_LINK_CLOSE.test(subvalue)) {
    self.inLink = false
  }

  return eat(subvalue)({type: 'html', value: subvalue} as Node)
} as TokenizeMethod

inlineHTML.locator = locateTag
