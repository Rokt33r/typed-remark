import u from 'typed-unist-builder'
import { wrap } from '../wrap'
import { all } from '../all'
import { H } from '../'
import { Parent } from 'typed-unist'
import { List, ListItem } from 'typed-mdast'

/* Transform a list-item. */
export function listItem (h: H, node: ListItem, parent: List) {
  const children = node.children
  const head = children[0]
  const props: {
    className?: string[]
  } = {}
  let single = false
  let result
  let container

  if ((!parent || !parent.loose) && children.length === 1 && head.type === 'paragraph') {
    single = true
  }

  result = all(h, single ? head as Parent : node)

  if (typeof node.checked === 'boolean') {
    if (!single && (!head || head.type !== 'paragraph')) {
      result.unshift(h(null, 'p', []))
    }

    container = single ? result : (result[0] as Parent).children

    if (container.length !== 0) {
      container.unshift(u('text', ' '))
    }

    container.unshift(h(null, 'input', {
      type: 'checkbox',
      checked: node.checked,
      disabled: true,
    }))

    /* According to github-markdown-css, this class hides bullet. */
    props.className = ['task-list-item']
  }

  if (!single && result.length !== 0) {
    result = wrap(result, true)
  }

  return h(node, 'li', props, result)
}
