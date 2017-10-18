import u from 'typed-unist-builder'
import { all } from './all'
import {
  Node,
  Text,
  Parent,
} from 'typed-unist'
import { H, HNode } from './'

const hasOwnProperty = {}.hasOwnProperty

/* Transform an unknown node. */
function unknown (h: H, node: Node): Node {
  if (shouldNodeRenderAsText(node)) {
    return h.augment(node, u('text', (node as Text).value))
  }

  return h(node, 'div', all(h, node as Parent))
}

/* Visit a node. */
export function one (h: H, node: Node, parent?: Parent) {
  const type = node && node.type
  const fn = hasOwnProperty.call(h.handlers, type) ? h.handlers[type] : null

  /* Fail on non-nodes. */
  if (!type) {
    throw new Error('Expected node, got `' + node + '`')
  }

  return (typeof fn === 'function' ? fn : unknown)(h, node, parent)
}

/* Check if the node should be renderered a text node. */
function shouldNodeRenderAsText (node: Node) {
  const data = (node as HNode).data || {}

  if (hasOwnProperty.call(data, 'hName') || hasOwnProperty.call(data, 'hProperties') || hasOwnProperty.call(data, 'hChildren')) {
    return false
  }

  return 'value' in node
}
