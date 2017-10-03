import { TokenizeMethod, Eat } from '../tokenizer'
import { RemarkParser } from '../RemarkParser'
import { Node, Point } from 'typed-unist'

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

  // FIXME: source is never used by parseEntiites
  // self.decode(subvalue, now, function (content: string, position: Point, source: string) {
  self.decode(subvalue, now, function (content: string) {
    eat(content)({
      type: 'text',
      value: content,
    } as Node)
  })
} as TokenizeMethod
