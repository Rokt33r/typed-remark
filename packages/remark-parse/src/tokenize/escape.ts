import { TokenizeMethod, Eat } from '../tokenizer'
import { RemarkParser } from '../RemarkParser'
import { Node } from 'typed-unist'
import { locateEscape } from '../locate/escape'

export const escape: TokenizeMethod = function (this: RemarkParser, eat: Eat, value: string, silent?: boolean): Node | boolean {
  const self = this
  let character
  let node

  if (value.charAt(0) === '\\') {
    character = value.charAt(1)

    if (self.escape.indexOf(character) !== -1) {
      /* istanbul ignore if - never used (yet) */
      if (silent) {
        return true
      }

      if (character === '\n') {
        node = {type: 'break'}
      } else {
        node = {
          type: 'text',
          value: character,
        } as Node
      }

      return eat('\\' + character)(node)
    }
  }
} as TokenizeMethod

escape.locator = locateEscape
