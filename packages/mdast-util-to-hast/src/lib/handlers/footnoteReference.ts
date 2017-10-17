import u from 'typed-unist-builder'
import { H } from '../'
import { Node } from 'typed-unist'
import { FootnoteReference } from 'typed-mdast'

/* Transform a reference to a footnote. */
export function footnoteReference (h: H, node: FootnoteReference): Node {
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
