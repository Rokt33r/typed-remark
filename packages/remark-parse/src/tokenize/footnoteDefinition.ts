import { TokenizeMethod, Eat, Apply } from '../tokenizer'
import { RemarkParser } from '../RemarkParser'
import { Node, Point } from 'typed-unist'
import { isWhitespaceCharacter } from '../utils/isWhitespaceCharacter'
import { normalize } from '../utils/normalize'

const C_BACKSLASH = '\\'
const C_NEWLINE = '\n'
const C_TAB = '\t'
const C_SPACE = ' '
const C_BRACKET_OPEN = '['
const C_BRACKET_CLOSE = ']'
const C_CARET = '^'
const C_COLON = ':'

const EXPRESSION_INITIAL_TAB = /^( {4}|\t)?/gm

export const footnoteDefinition: TokenizeMethod = function (this: RemarkParser, eat: Eat, value: string, silent?: boolean): Node | boolean {
  const self = this
  const offsets = self.offset
  let index: number
  let length: number
  let subvalue: string
  let now: Point
  let currentLine: number
  let content: string
  let queue: string
  let subqueue: string
  let character: string
  let identifier: string
  let add: Apply

  if (!self.options.footnotes) {
    return
  }

  index = 0
  length = value.length
  subvalue = ''
  now = eat.now()
  currentLine = now.line

  while (index < length) {
    character = value.charAt(index)

    if (!isWhitespaceCharacter(character)) {
      break
    }

    subvalue += character
    index++
  }

  if (
    value.charAt(index) !== C_BRACKET_OPEN ||
    value.charAt(index + 1) !== C_CARET
  ) {
    return
  }

  subvalue += C_BRACKET_OPEN + C_CARET
  index = subvalue.length
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

  if (silent) {
    return true
  }

  identifier = normalize(queue)
  subvalue += queue + C_BRACKET_CLOSE + C_COLON
  index = subvalue.length

  while (index < length) {
    character = value.charAt(index)

    if (character !== C_TAB && character !== C_SPACE) {
      break
    }

    subvalue += character
    index++
  }

  now.column += subvalue.length
  now.offset += subvalue.length
  queue = ''
  content = ''
  subqueue = ''

  while (index < length) {
    character = value.charAt(index)

    if (character === C_NEWLINE) {
      subqueue = character
      index++

      while (index < length) {
        character = value.charAt(index)

        if (character !== C_NEWLINE) {
          break
        }

        subqueue += character
        index++
      }

      queue += subqueue
      subqueue = ''

      while (index < length) {
        character = value.charAt(index)

        if (character !== C_SPACE) {
          break
        }

        subqueue += character
        index++
      }

      if (subqueue.length === 0) {
        break
      }

      queue += subqueue
    }

    if (queue) {
      content += queue
      queue = ''
    }

    content += character
    index++
  }

  subvalue += content

  content = content.replace(EXPRESSION_INITIAL_TAB, function (line) {
    offsets[currentLine] = (offsets[currentLine] || 0) + line.length
    currentLine++

    return ''
  })

  add = eat(subvalue)

  // Enter Block
  self.inBlock = true

  const children: Node[] = self.tokenizeBlock(content, now)

  // Exit Block
  self.inBlock = false

  return add({
    type: 'footnoteDefinition',
    identifier,
    children,
  } as Node)
} as TokenizeMethod

footnoteDefinition.notInList = true
footnoteDefinition.notInBlock = true
