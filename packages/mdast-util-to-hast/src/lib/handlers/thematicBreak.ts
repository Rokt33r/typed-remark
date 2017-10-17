import { H } from '../'
import { Node } from 'typed-unist'
import { ThematicBreak } from 'typed-mdast'

/* Transform a thematic break / horizontal rule. */
export function thematicBreak (h: H, node?: ThematicBreak): Node {
  return h(node, 'hr')
}
