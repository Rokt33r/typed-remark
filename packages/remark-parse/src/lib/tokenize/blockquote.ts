import { interrupt } from '../utils/interrupt'
import { TokenizeMethod, Eat, Apply } from '../tokenizer'
import { RemarkParser } from '../RemarkParser'
import { Node } from 'typed-unist'

const C_NEWLINE = '\n'
const C_TAB = '\t'
const C_SPACE = ' '
const C_GT = '>'

/* Tokenise a blockquote. */
export const blockquote: TokenizeMethod = function (this: RemarkParser, eat: Eat, value: string, silent?: boolean) {
  const self: RemarkParser = this
  const offsets = self.offset
  const tokenizers = self.blockTokenizers
  const interruptors = self.interruptBlockquote
  const now = eat.now()
  let currentLine = now.line
  let length = value.length
  const values = []
  const contents: string[] = []
  const indents = []
  let add: Apply
  let index = 0
  let character: string
  let rest: string
  let nextIndex
  let content
  let line
  let startIndex
  let prefixed
  let children: Node[]

  while (index < length) {
    character = value.charAt(index)

    if (character !== C_SPACE && character !== C_TAB) {
      break
    }

    index++
  }

  if (value.charAt(index) !== C_GT) {
    return
  }

  if (silent) {
    return true
  }

  index = 0

  while (index < length) {
    nextIndex = value.indexOf(C_NEWLINE, index)
    startIndex = index
    prefixed = false

    if (nextIndex === -1) {
      nextIndex = length
    }

    while (index < length) {
      character = value.charAt(index)

      if (character !== C_SPACE && character !== C_TAB) {
        break
      }

      index++
    }

    if (value.charAt(index) === C_GT) {
      index++
      prefixed = true

      if (value.charAt(index) === C_SPACE) {
        index++
      }
    } else {
      index = startIndex
    }

    content = value.slice(index, nextIndex)

    if (!prefixed && !content.trim()) {
      index = startIndex
      break
    }

    if (!prefixed) {
      rest = value.slice(index)

      /* Check if the following code contains a possible
       * block. */
      if (interrupt(interruptors, tokenizers, self, [eat, rest, true])) {
        break
      }
    }

    line = startIndex === index ? content : value.slice(startIndex, nextIndex)

    indents.push(index - startIndex)
    values.push(line)
    contents.push(content)

    index = nextIndex + 1
  }

  index = -1
  length = indents.length
  add = eat(values.join(C_NEWLINE))

  while (++index < length) {
    offsets[currentLine] = (offsets[currentLine] || 0) + indents[index]
    currentLine++
  }

  const exitBlock = self.enterBlock()

  children = self.tokenizeBlock(contents.join(C_NEWLINE), now)

  exitBlock()

  return add({
    type: 'blockquote',
    children,
  } as Node)
} as TokenizeMethod
