import { Parent, Node } from 'typed-unist'
import { after } from './sibling'

/** Get the first child in `parent`. */
export function first (parent: Parent, includeWhiteSpace?: boolean): Node {
  return after(parent, -1, includeWhiteSpace)
}
