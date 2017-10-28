import { stringifyEntities } from 'typed-stringify-entities'
import { ToHTMLContext } from './'
import { TextNode, Element } from 'typed-hast'
import { Parent } from 'typed-unist'

/** Stringify `text`. */
export function text (ctx: ToHTMLContext, node: TextNode, index?: number, parent?: Parent) {
  const value = node.value
  return isLiteral(parent) ? value : stringifyEntities(value, {
    ...ctx.entities,
    subset: ['<', '&'],
  })
}

/** Check if content of `node` should be escaped. */
function isLiteral (node: Parent) {
  return node && ((node as Element).tagName === 'script' || (node as Element).tagName === 'style')
}
