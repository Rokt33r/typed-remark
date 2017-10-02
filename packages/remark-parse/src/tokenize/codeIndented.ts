import { TokenizeMethod, Eat, Apply } from '../tokenizer'
import { RemarkParser } from '../RemarkParser'
import { Node } from 'typed-unist'
import { trimTrailingLines } from '../utils/trimTrailingLines'

const C_NEWLINE = '\n'
const C_TAB = '\t'
const C_SPACE = ' '

const CODE_INDENT_COUNT = 4
const CODE_INDENT = C_SPACE.repeat(CODE_INDENT_COUNT)

/* Tokenise indented code. */
export const indentedCode: TokenizeMethod = function (this: RemarkParser, eat: Eat, value: string, silent?: boolean): Node | boolean {
  let index = -1
  const length = value.length
  let subvalue = ''
  let content = ''
  let subvalueQueue = ''
  let contentQueue = ''
  let character
  let blankQueue
  let indent

  while (++index < length) {
    character = value.charAt(index)

    if (indent) {
      indent = false

      subvalue += subvalueQueue
      content += contentQueue
      subvalueQueue = ''
      contentQueue = ''

      if (character === C_NEWLINE) {
        subvalueQueue = character
        contentQueue = character
      } else {
        subvalue += character
        content += character

        while (++index < length) {
          character = value.charAt(index)

          if (!character || character === C_NEWLINE) {
            contentQueue = character
            subvalueQueue = character
            break
          }

          subvalue += character
          content += character
        }
      }
    } else if (
      character === C_SPACE &&
      value.charAt(index + 1) === character &&
      value.charAt(index + 2) === character &&
      value.charAt(index + 3) === character
    ) {
      subvalueQueue += CODE_INDENT
      index += 3
      indent = true
    } else if (character === C_TAB) {
      subvalueQueue += character
      indent = true
    } else {
      blankQueue = ''

      while (character === C_TAB || character === C_SPACE) {
        blankQueue += character
        character = value.charAt(++index)
      }

      if (character !== C_NEWLINE) {
        break
      }

      subvalueQueue += blankQueue + character
      contentQueue += character
    }
  }

  if (content) {
    if (silent) {
      return true
    }

    return eat(subvalue)({
      type: 'code',
      lang: null,
      value: trimTrailingLines(content),
    } as Node)
  }
} as TokenizeMethod
