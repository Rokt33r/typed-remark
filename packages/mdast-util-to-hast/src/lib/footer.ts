import { wrap } from './wrap'
import { H } from './'
import { Node } from 'typed-unist'
import { FootnoteDefinition, Link, ListItem } from 'typed-mdast'
import { list } from './handlers/list'
import { thematicBreak } from './handlers/thematicBreak'

/* Transform all footnote definitions, if any. */
export function generateFootnotes (h: H) {
  const footnotes = h.footnotes
  const length = footnotes.length
  let index = -1
  const listItems = []
  let def: FootnoteDefinition

  if (!length) {
    return null
  }

  while (++index < length) {
    def = footnotes[index]

    listItems[index] = {
      type: 'listItem',
      data: {hProperties: {id: 'fn-' + def.identifier}},
      children: def.children.concat({
        type: 'link',
        url: '#fnref-' + def.identifier,
        data: {hProperties: {className: ['footnote-backref']}},
        children: [{
          type: 'text',
          value: '↩',
        } as Node],
      } as Link),
      position: def.position,
      loose: false,
    } as ListItem
  }

  return h(null, 'div', {
    className: ['footnotes'],
  }, wrap([
    thematicBreak(h),
    list(h, {
      type: 'list',
      ordered: true,
      children: listItems,
    }),
  ], true))
}
