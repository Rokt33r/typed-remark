import { InteruptRule, InteruptRuleOptions, RemarkParser } from '../RemarkParser'
import { TokenizeMethod, Eat } from '../tokenizer'

export function interrupt (interruptors: InteruptRule[], tokenizers: {[key: string]: TokenizeMethod}, ctx: RemarkParser, params: [Eat, string, boolean]) {
  let interruptor
  let config: InteruptRuleOptions
  let fn
  let ignore: boolean

  for (interruptor of interruptors) {
    config = (interruptor[1] || {}) as InteruptRuleOptions
    fn = interruptor[0]

    ignore = false
    if (config.pedantic != null && config.pedantic !== ctx.options.pedantic) {
      ignore = true
    } else if (config.commonmark != null && config.commonmark !== ctx.options.commonmark) {
      ignore = true
    }

    if (ignore) {
      continue
    }

    if (tokenizers[fn].apply(ctx, params)) {
      return true
    }
  }

  return false
}
