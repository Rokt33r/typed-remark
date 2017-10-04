import { visit } from 'typed-unist-util-visit'
import { Node } from 'typed-unist'

/* Remove `position`s from `tree`. */
export function removePosition (node: Node, force?: boolean): Node {
  visit(node, force ? hard : soft)
  return node
}

function hard (node: Node) {
  delete node.position
}

function soft (node: Node) {
  node.position = undefined
}
