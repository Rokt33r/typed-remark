import { is } from 'typed-unist-util-is'
import { isElement } from 'typed-hast-util-is-element'
import { before } from './util/sibling'
import { first } from './util/first'
import { place } from './util/place'
import { whiteSpaceLeft } from './util/whiteSpaceLeft'
import { closing } from './closing'
import { omission } from './omission'
import { Parent, Node } from 'typed-unist'
import { Element } from 'typed-hast'

const hasOwnProperty = {}.hasOwnProperty

export const opening = omission({
  html,
  head,
  body,
  colgroup,
  tbody,
})

/* Whether to omit `<html>`. */
function html (node: Node) {
  const headElement = first(node as Parent)
  return !headElement || !is('comment', headElement)
}

/* Whether to omit `<head>`. */
function head (node: Node) {
  const children = (node as Parent).children
  const length = children.length
  const map: {[key: string]: boolean} = {}
  let index = -1
  let child
  let name

  while (++index < length) {
    child = children[index]
    name = (child as Element).tagName

    if (
      child.type === 'element' &&
      (name === 'title' || name === 'base')
    ) {
      if (hasOwnProperty.call(map, name)) {
        return false
      }

      map[name] = true
    }
  }

  return Boolean(length)
}

/* Whether to omit `<body>`. */
function body (node: Node): boolean {
  const headElement = first(node as Parent, true)

  return !headElement || (
    !is('comment', headElement) &&
    !whiteSpaceLeft(headElement) &&
    !isElement(headElement, ['meta', 'link', 'script', 'style', 'template'])
  )
}

/**
 * Whether to omit `<colgroup>`.
 * The spec describes some logic for the opening tag,
 * but it’s easier to implement in the closing tag, to
 * the same effect, so we handle it there instead.
 */
function colgroup (node: Node, index: number, parent: Parent) {
  const prev = before(parent, index)
  const headElement = first(node as Parent, true)

  /* Previous colgroup was already omitted. */
  if (
    isElement(prev, 'colgroup') &&
    closing(prev, place(parent, prev), parent)
  ) {
    return false
  }

  return headElement && isElement(headElement, 'col')
}

/* Whether to omit `<tbody>`. */
function tbody (node: Node, index: number, parent: Parent) {
  const prev = before(parent, index)
  const headElement = first(node as Parent)

  /* Previous table section was already omitted. */
  if (
    isElement(prev, ['thead', 'tbody']) &&
    closing(prev, place(parent, prev), parent)
  ) {
    return false
  }

  return headElement && isElement(headElement, 'tr')
}
