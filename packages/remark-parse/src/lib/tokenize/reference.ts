import { TokenizeMethod, Eat } from '../tokenizer'
import { RemarkParser } from '../RemarkParser'
import { Node, Parent, Point } from 'typed-unist'
import { normalize } from '../utils'
import { isWhitespaceCharacter } from 'typed-string-utils'
import { locateLink } from '../locate/link'

const T_LINK = 'link'
const T_IMAGE = 'image'
const T_FOOTNOTE = 'footnote'
const REFERENCE_TYPE_SHORTCUT = 'shortcut'
const REFERENCE_TYPE_COLLAPSED = 'collapsed'
const REFERENCE_TYPE_FULL = 'full'
const C_CARET = '^'
const C_BACKSLASH = '\\'
const C_BRACKET_OPEN = '['
const C_BRACKET_CLOSE = ']'

export const reference: TokenizeMethod = function (this: RemarkParser, eat: Eat, value: string, silent?: boolean): Node | boolean {
  const self = this
  let character = value.charAt(0)
  let index = 0
  const length = value.length
  let subvalue = ''
  let intro = ''
  let type = T_LINK
  let referenceType = REFERENCE_TYPE_SHORTCUT
  let content
  let identifier
  let now: Point
  let node
  let queue
  let bracketed
  let depth

  /* Check whether we’re eating an image. */
  if (character === '!') {
    type = T_IMAGE
    intro = character
    character = value.charAt(++index)
  }

  if (character !== C_BRACKET_OPEN) {
    return
  }

  index++
  intro += character
  queue = ''

  /* Check whether we’re eating a footnote. */
  if (
    self.options.footnotes &&
    type === T_LINK &&
    value.charAt(index) === C_CARET
  ) {
    intro += C_CARET
    index++
    type = T_FOOTNOTE
  }

  /* Eat the text. */
  depth = 0

  while (index < length) {
    character = value.charAt(index)

    if (character === C_BRACKET_OPEN) {
      bracketed = true
      depth++
    } else if (character === C_BRACKET_CLOSE) {
      if (!depth) {
        break
      }

      depth--
    }

    if (character === C_BACKSLASH) {
      queue += C_BACKSLASH
      character = value.charAt(++index)
    }

    queue += character
    index++
  }

  subvalue = queue
  content = queue
  character = value.charAt(index)

  if (character !== C_BRACKET_CLOSE) {
    return
  }

  index++
  subvalue += character
  queue = ''

  while (index < length) {
    character = value.charAt(index)

    if (!isWhitespaceCharacter(character)) {
      break
    }

    queue += character
    index++
  }

  character = value.charAt(index)

  /* Inline footnotes cannot have an identifier. */
  if (type !== T_FOOTNOTE && character === C_BRACKET_OPEN) {
    identifier = ''
    queue += character
    index++

    while (index < length) {
      character = value.charAt(index)

      if (character === C_BRACKET_OPEN || character === C_BRACKET_CLOSE) {
        break
      }

      if (character === C_BACKSLASH) {
        identifier += C_BACKSLASH
        character = value.charAt(++index)
      }

      identifier += character
      index++
    }

    character = value.charAt(index)

    if (character === C_BRACKET_CLOSE) {
      referenceType = identifier ? REFERENCE_TYPE_FULL : REFERENCE_TYPE_COLLAPSED
      queue += identifier + character
      index++
    } else {
      identifier = ''
    }

    subvalue += queue
    queue = ''
  } else {
    if (!content) {
      return
    }

    identifier = content
  }

  /* Brackets cannot be inside the identifier. */
  if (referenceType !== REFERENCE_TYPE_FULL && bracketed) {
    return
  }

  subvalue = intro + subvalue

  if (type === T_LINK && self.inLink) {
    return null
  }

  /* istanbul ignore if - never used (yet) */
  if (silent) {
    return true
  }

  if (type === T_FOOTNOTE && content.indexOf(' ') !== -1) {
    return eat(subvalue)({
      type: 'footnote',
      children: this.tokenizeInline(content, eat.now()),
    } as Node)
  }

  now = eat.now()
  now.column += intro.length
  now.offset += intro.length
  identifier = referenceType === REFERENCE_TYPE_FULL ? identifier : content

  node = {
    type: type + 'Reference',
    identifier: normalize(identifier),
  } as Node

  if (type === T_LINK || type === T_IMAGE) {
    // FIXME: We should NOT use `as any`
    (node as any).referenceType = referenceType
  }

  if (type === T_LINK) {
    const exitLink = this.enterLink();

    // FIXME: We should NOT use `as any`
    (node as Parent).children = self.tokenizeInline(content, now)

    exitLink()
  } else if (type === T_IMAGE) {
    // FIXME: We should NOT use `as any`
    (node as any).alt = self.decodeRaw(self.unescape(content), now) || null
  }

  return eat(subvalue)(node)
} as TokenizeMethod

reference.locator = locateLink
