import { TokenizeMethod, Eat } from '../tokenizer'
import { RemarkParser } from '../RemarkParser'
import { Node, Point, Position } from 'typed-unist'

export const text: TokenizeMethod = function (this: RemarkParser, eat: Eat, value: string, silent?: boolean): Node | boolean {
  const self = this
  let methods
  let tokenizers
  let index
  let length
  let subvalue
  let position
  let tokenizer
  let name
  let min
  let now: Point

  /* istanbul ignore if - never used (yet) */
  if (silent) {
    return true
  }

  methods = self.inlineMethods
  length = methods.length
  tokenizers = self.inlineTokenizers
  index = -1
  min = value.length

  while (++index < length) {
    name = methods[index]

    if (name === 'text' || !tokenizers[name]) {
      continue
    }

    tokenizer = tokenizers[name].locator

    if (!tokenizer) {
      eat.file.fail('Missing locator: `' + name + '`')
    }

    position = tokenizer.call(self, value, 1)

    if (position !== -1 && position < min) {
      min = position
    }
  }

  subvalue = value.slice(0, min)
  now = eat.now()

  /**
   * When decoding happens, source argument is available.
   * Content: Decoded result of the partial of the subvalue
   * Source: Original value of the partial
   */
  self.decode(subvalue, now, function (content: string, p: Position, source?: string) {
    eat(source || content)({
      type: 'text',
      value: content,
    } as Node)
  })
} as TokenizeMethod
