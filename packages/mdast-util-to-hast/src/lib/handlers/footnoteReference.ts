import u from 'typed-unist-builder'
import { Node } from 'typed-unist'
import { H } from '../'
import { FootnoteReference } from 'typed-mdast'

/* Transform a reference to a footnote. */
export function footnoteReference (h: H, node: FootnoteReference) {
  const identifier = node.identifier

  return h({
    position: node.position,
  } as Node, 'sup', {id: 'fnref-' + identifier}, [
    h(node, 'a', {
      href: '#fn-' + identifier,
      className: ['footnote-ref'],
    }, [u('text', identifier)]),
  ])
}
