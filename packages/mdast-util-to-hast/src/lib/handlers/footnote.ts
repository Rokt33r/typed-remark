import { footnoteReference } from './footnoteReference'
import { H } from '../'
import { Footnote, FootnoteDefinition, FootnoteReference } from 'typed-mdast'

/* Transform an inline footnote. */
export function footnote (h: H, node: Footnote) {
  const identifiers = []
  let identifier = 1
  const footnotes = h.footnotes
  const length = footnotes.length
  let index = -1

  while (++index < length) {
    identifiers[index] = footnotes[index].identifier
  }

  while (identifiers.indexOf(String(identifier)) !== -1) {
    identifier++
  }

  footnotes.push({
    type: 'footnoteDefinition',
    identifier: String(identifier),
    children: node.children,
    position: node.position,
  } as FootnoteDefinition)

  return footnoteReference(h, {
    type: 'footnoteReference',
    identifier: String(identifier),
    position: node.position,
  } as FootnoteReference)
}
