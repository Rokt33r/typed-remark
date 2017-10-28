import { text } from './text'
import { element } from './element'
import { doctype } from './doctype'
import { comment } from './comment'
import { raw } from './raw'
import { Node, Parent } from 'typed-unist'
import { Element, TextNode, Doctype, Comment } from 'typed-hast'
import { ToHTMLContext } from './'

/** Stringify `node`. */
export function one (ctx: ToHTMLContext, node: string | Node, index?: number, parent?: Parent) {
  const type = node && (node as Node).type

  switch ((node as Node).type) {
    case 'text':
      return text(ctx, node as TextNode, index, parent)
    case 'element':
      return element(ctx, node as Element, index, parent)
    case 'doctype':
      return doctype(ctx, node as Doctype)
    case 'comment':
      return comment(ctx, node as Comment)
    case 'raw':
      return raw(ctx, node as TextNode)
  }

  throw new Error('Cannot compile unknown node `' + type + '`')
}
