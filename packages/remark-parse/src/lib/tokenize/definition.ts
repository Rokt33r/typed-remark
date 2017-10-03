import { TokenizeMethod, Eat } from '../tokenizer'
import { RemarkParser } from '../RemarkParser'
import { Node } from 'typed-unist'
import { isWhitespaceCharacter } from '../utils/isWhitespaceCharacter'
import { normalize } from '../utils/normalize'

const C_DOUBLE_QUOTE = '"'
const C_SINGLE_QUOTE = '\''
const C_BACKSLASH = '\\'
const C_NEWLINE = '\n'
const C_TAB = '\t'
const C_SPACE = ' '
const C_BRACKET_OPEN = '['
const C_BRACKET_CLOSE = ']'
const C_PAREN_OPEN = '('
const C_PAREN_CLOSE = ')'
const C_COLON = ':'
const C_LT = '<'
const C_GT = '>'

export const definition: TokenizeMethod = function (this: RemarkParser, eat: Eat, value: string, silent?: boolean): Node | boolean {
  const self = this
  const commonmark: boolean = self.options.commonmark
  let index: number = 0
  const length = value.length
  let subvalue = ''
  let beforeURL: string
  let beforeTitle: string
  let queue: string
  let character: string
  let test: string
  let identifier: string
  let url: string
  let title: string

  while (index < length) {
    character = value.charAt(index)

    if (character !== C_SPACE && character !== C_TAB) {
      break
    }

    subvalue += character
    index++
  }

  character = value.charAt(index)

  if (character !== C_BRACKET_OPEN) {
    return
  }

  index++
  subvalue += character
  queue = ''

  while (index < length) {
    character = value.charAt(index)

    if (character === C_BRACKET_CLOSE) {
      break
    } else if (character === C_BACKSLASH) {
      queue += character
      index++
      character = value.charAt(index)
    }

    queue += character
    index++
  }

  if (
    !queue ||
    value.charAt(index) !== C_BRACKET_CLOSE ||
    value.charAt(index + 1) !== C_COLON
  ) {
    return
  }

  identifier = queue
  subvalue += queue + C_BRACKET_CLOSE + C_COLON
  index = subvalue.length
  queue = ''

  while (index < length) {
    character = value.charAt(index)

    if (
      character !== C_TAB &&
      character !== C_SPACE &&
      character !== C_NEWLINE
    ) {
      break
    }

    subvalue += character
    index++
  }

  character = value.charAt(index)
  queue = ''
  beforeURL = subvalue

  if (character === C_LT) {
    index++

    while (index < length) {
      character = value.charAt(index)

      if (!isEnclosedURLCharacter(character)) {
        break
      }

      queue += character
      index++
    }

    character = value.charAt(index)

    // if (character === isEnclosedURLCharacter.delimiter) {
    if (character === C_GT) {
      subvalue += C_LT + queue + character
      index++
    } else {
      if (commonmark) {
        return
      }

      index -= queue.length + 1
      queue = ''
    }
  }

  if (!queue) {
    while (index < length) {
      character = value.charAt(index)

      if (!isUnclosedURLCharacter(character)) {
        break
      }

      queue += character
      index++
    }

    subvalue += queue
  }

  if (!queue) {
    return
  }

  url = queue
  queue = ''

  while (index < length) {
    character = value.charAt(index)

    if (
      character !== C_TAB &&
      character !== C_SPACE &&
      character !== C_NEWLINE
    ) {
      break
    }

    queue += character
    index++
  }

  character = value.charAt(index)
  test = null

  if (character === C_DOUBLE_QUOTE) {
    test = C_DOUBLE_QUOTE
  } else if (character === C_SINGLE_QUOTE) {
    test = C_SINGLE_QUOTE
  } else if (character === C_PAREN_OPEN) {
    test = C_PAREN_CLOSE
  }

  if (!test) {
    queue = ''
    index = subvalue.length
  } else if (queue) {
    subvalue += queue + character
    index = subvalue.length
    queue = ''

    while (index < length) {
      character = value.charAt(index)

      if (character === test) {
        break
      }

      if (character === C_NEWLINE) {
        index++
        character = value.charAt(index)

        if (character === C_NEWLINE || character === test) {
          return
        }

        queue += C_NEWLINE
      }

      queue += character
      index++
    }

    character = value.charAt(index)

    if (character !== test) {
      return
    }

    beforeTitle = subvalue
    subvalue += queue + character
    index++
    title = queue
    queue = ''
  } else {
    return
  }

  while (index < length) {
    character = value.charAt(index)

    if (character !== C_TAB && character !== C_SPACE) {
      break
    }

    subvalue += character
    index++
  }

  character = value.charAt(index)

  if (!character || character === C_NEWLINE) {
    if (silent) {
      return true
    }

    const beforeURLEndPosition = eat(beforeURL).test().end
    url = self.decodeRaw(self.unescape(url), beforeURLEndPosition)

    if (title) {
      const beforeTitleEndPosition = eat(beforeTitle).test().end
      title = self.decodeRaw(self.unescape(title), beforeTitleEndPosition)
    }

    return eat(subvalue)({
      type: 'definition',
      identifier: normalize(identifier),
      title: title || null,
      url,
    } as Node)
  }
} as TokenizeMethod

/* Check if `character` can be inside an enclosed URI. */
function isEnclosedURLCharacter (character: string): boolean {
  return character !== C_GT &&
    character !== C_BRACKET_OPEN &&
    character !== C_BRACKET_CLOSE
}

/* Check if `character` can be inside an unclosed URI. */
function isUnclosedURLCharacter (character: string): boolean {
  return character !== C_BRACKET_OPEN &&
    character !== C_BRACKET_CLOSE &&
    !isWhitespaceCharacter(character)
}

definition.notInList = true
definition.notInBlock = true
