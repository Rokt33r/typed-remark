import { text } from './text'
import { ToHTMLContext } from './'
import { TextNode } from 'typed-hast'

/** Stringify `raw`. */
export function raw (ctx: ToHTMLContext, node: TextNode) {
  return ctx.dangerous ? node.value : text(ctx, node)
}
