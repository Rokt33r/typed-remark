import { H } from '../'
import { ThematicBreak } from 'typed-mdast'

/* Transform a thematic break / horizontal rule. */
export function thematicBreak (h: H, node?: ThematicBreak) {
  return h(node, 'hr')
}
