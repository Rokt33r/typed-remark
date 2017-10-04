import { Node, Parent } from 'typed-unist'

export interface Visitor {
  (node: Node, index: number, parent: Node): boolean | void
}

/* Visit. */
export function visit (tree: Node, visitor: Visitor, reverse?: boolean): void
export function visit (tree: Node, type: string, visitor: Visitor, reverse?: boolean): void
export function visit (tree: Node, typeOrVisitor: string | Visitor, visitorOrReverse: Visitor | boolean, reverse?: boolean) {
  let visitor: Visitor
  let type: string
  if (typeof typeOrVisitor === 'function') {
    reverse = visitorOrReverse as boolean
    visitor = typeOrVisitor as Visitor
    type = null
  } else {
    visitor = visitorOrReverse as Visitor
    type = typeOrVisitor as string
  }

  one(tree)

  /* Visit a single node. */
  function one (node: Node, index?: number, parent?: Parent) {
    let result

    index = index || (parent ? 0 : null)

    if (!type || node.type === type) {
      result = visitor(node, index, parent || null)
    }

    if ((node as Parent).children && result !== false) {
      return all((node as Parent).children, node as Parent)
    }

    return result
  }

  /* Visit children in `parent`. */
  function all (children: Node[], parent: Parent) {
    const step = reverse ? -1 : 1
    const max = children.length
    const min = -1
    let index = (reverse ? max : min) + step
    let child

    while (index > min && index < max) {
      child = children[index]

      if (child && one(child, index, parent) === false) {
        return false
      }

      index += step
    }

    return true
  }
}
