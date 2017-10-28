import { interElementWhiteSpace } from 'typed-hast-util-whitespace'
import { Parent, Node } from 'typed-unist'

export const before = siblingFactory(-1)
export const after = siblingFactory(1)

/* Factory to check siblings in a direction. */
function siblingFactory (increment: number) {
  return sibling

  /** Find applicable siblings in a direction.   */
  function sibling (parent: Parent, index: number, includeWhiteSpace?: boolean): Node {
    const siblings = parent && parent.children
    let next

    index += increment
    next = siblings && siblings[index]

    if (!includeWhiteSpace) {
      while (next && interElementWhiteSpace(next)) {
        index += increment
        next = siblings[index]
      }
    }

    return next
  }
}
