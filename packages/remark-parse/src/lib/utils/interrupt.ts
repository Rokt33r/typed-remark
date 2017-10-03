import { InteruptRule, InteruptRuleOptions, RemarkParser } from '../RemarkParser'
import { TokenizeMethod, Eat } from '../tokenizer'

export function interrupt (interruptors: InteruptRule[], tokenizers: {[key: string]: TokenizeMethod}, ctx: RemarkParser, params: [Eat, string, boolean]) {
  let interruptor
  let config: InteruptRuleOptions
  let fn
  let offset
  let ignore: boolean = false

  for (interruptor of interruptors) {
    config = (interruptor[1] || {}) as InteruptRuleOptions
    fn = interruptor[0]
    offset = -1

    /**
     * 1. Don't ignore if interrupt rule has no config
     * 2. Ignore if ctx.options is set while interrupt rule config is set false
     */
    ignore = config.commonmark != null || config.pedantic != null
      ? ctx.options.commonmark && !config.commonmark || ctx.options.pedantic && !config.pedantic
      : false

    if (ignore) {
      continue
    }

    if (tokenizers[fn].apply(ctx, params)) {
      return true
    }
  }

  return false
}
