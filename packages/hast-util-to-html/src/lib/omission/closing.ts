import { is } from 'typed-unist-util-is'
import { isElement } from 'typed-hast-util-is-element'
import { after } from './util/sibling'
import { whiteSpaceLeft } from './util/whiteSpaceLeft'
import { omission } from './omission'
import { Parent, Node } from 'typed-unist'

export const closing = omission({
  html,
  head: headOrColgroupOrCaption,
  body,
  p,
  li,
  dt,
  dd,
  rt: rubyElement,
  rp: rubyElement,
  optgroup,
  option,
  menuitem,
  colgroup: headOrColgroupOrCaption,
  caption: headOrColgroupOrCaption,
  thead,
  tbody,
  tfoot,
  tr,
  td: cells,
  th: cells,
})

/** Macro for `</head>`, `</colgroup>`, and `</caption>`. */
function headOrColgroupOrCaption (node: Node, index: number, parent: Parent): boolean {
  const next = after(parent, index, true)
  return !next || (!is('comment', next) && !whiteSpaceLeft(next))
}

/** Whether to omit `</html>`. */
function html (node: Node, index: number, parent: Parent): boolean {
  const next = after(parent, index)
  return !next || !is('comment', next)
}

/** Whether to omit `</body>`. */
function body (node: Node, index: number, parent: Parent): boolean {
  const next = after(parent, index)
  return !next || !is('comment', next)
}

/** Whether to omit `</p>`. */
function p (node: Node, index: number, parent: Parent): boolean {
  const next = after(parent, index)

  if (next) {
    return isElement(next, [
      'address', 'article', 'aside', 'blockquote', 'details',
      'div', 'dl', 'fieldset', 'figcaption', 'figure', 'footer',
      'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header',
      'hgroup', 'hr', 'main', 'menu', 'nav', 'ol', 'p', 'pre',
      'section', 'table', 'ul',
    ])
  }

  return !parent || !isElement(parent, [
    'a', 'audio', 'del', 'ins', 'map', 'noscript', 'video',
  ])
}

/** Whether to omit `</li>`. */
function li (node: Node, index: number, parent: Parent): boolean {
  const next = after(parent, index)
  return !next || isElement(next, 'li')
}

/** Whether to omit `</dt>`. */
function dt (node: Node, index: number, parent: Parent): boolean {
  const next = after(parent, index)
  return next && isElement(next, ['dt', 'dd'])
}

/** Whether to omit `</dd>`. */
function dd (node: Node, index: number, parent: Parent): boolean {
  const next = after(parent, index)
  return !next || isElement(next, ['dt', 'dd'])
}

/** Whether to omit `</rt>` or `</rp>`. */
function rubyElement (node: Node, index: number, parent: Parent): boolean {
  const next = after(parent, index)
  return !next || isElement(next, ['rp', 'rt'])
}

/** Whether to omit `</optgroup>`. */
function optgroup (node: Node, index: number, parent: Parent): boolean {
  const next = after(parent, index)
  return !next || isElement(next, 'optgroup')
}

/** Whether to omit `</option>`. */
function option (node: Node, index: number, parent: Parent): boolean {
  const next = after(parent, index)
  return !next || isElement(next, ['option', 'optgroup'])
}

/** Whether to omit `</menuitem>`. */
function menuitem (node: Node, index: number, parent: Parent): boolean {
  const next = after(parent, index)
  return !next || isElement(next, ['menuitem', 'hr', 'menu'])
}

/** Whether to omit `</thead>`. */
function thead (node: Node, index: number, parent: Parent): boolean {
  const next = after(parent, index)
  return next && isElement(next, ['tbody', 'tfoot'])
}

/** Whether to omit `</tbody>`. */
function tbody (node: Node, index: number, parent: Parent): boolean {
  const next = after(parent, index)
  return !next || isElement(next, ['tbody', 'tfoot'])
}

/** Whether to omit `</tfoot>`. */
function tfoot (node: Node, index: number, parent: Parent): boolean {
  return !after(parent, index)
}

/** Whether to omit `</tr>`. */
function tr (node: Node, index: number, parent: Parent): boolean {
  const next = after(parent, index)
  return !next || isElement(next, 'tr')
}

/** Whether to omit `</td>` or `</th>`. */
function cells (node: Node, index: number, parent: Parent): boolean {
  const next = after(parent, index)
  return !next || isElement(next, ['td', 'th'])
}
