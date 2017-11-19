import { Node, Parent } from 'typed-unist'
import { visit } from 'typed-unist-util-visit'
import { modifyChildrenFactory } from 'typed-unist-util-modify-children'

/**
 * Make an MDAST tree compact by merging adjacent text
 * nodes.
 */
export function compact (tree: Node, commonmark: boolean = false) {
  const modifier = modifyChildrenFactory(iterator)

  visit(tree, visitor)

  return tree

  function visitor (node: Parent) {
    if (node.children) {
      modifier(node)
    }
  }

  function iterator (child: Node, index: number, parent: Parent): number | void {
    const siblings = parent.children
    const prev = index && siblings[index - 1]

    if (
      prev &&
      child.type === prev.type &&
      mergeable(prev, commonmark) &&
      mergeable(child, commonmark)
    ) {
      if (child.value) {
        prev.value += child.value
      }

      if (child.children) {
        prev.children = prev.children.concat(child.children)
      }

      siblings.splice(index, 1)

      if (prev.position && child.position) {
        prev.position.end = child.position.end
      }

      return index
    }
  }
}

function mergeable (node: Node, commonmark: boolean) {
  if (node.type === 'text') {
    if (!node.position) {
      return true
    }

    const start = node.position.start
    const end = node.position.end

    /* Only merge nodes which occupy the same size as their `value`. */
    return start.line !== end.line ||
      end.column - start.column === node.value.length
  }

  return commonmark && node.type === 'blockquote'
}
