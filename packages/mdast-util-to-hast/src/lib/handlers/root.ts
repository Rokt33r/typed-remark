import u from 'typed-unist-builder'
import { wrap } from '../wrap'
import { all } from '../all'
import { H } from '../'
import { Node } from 'typed-unist'
import { Root } from 'typed-hast'

/* Transform a `root`. */
export function root (h: H, node: Root): Node {
  return h.augment(node, u('root', wrap(all(h, node))) as Root)
}
