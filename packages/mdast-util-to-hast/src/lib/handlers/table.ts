import { wrap } from '../wrap'
import { all } from '../all'
import { H } from '../'
import { Node } from 'typed-unist'
import { Table, TableRow, TableCell } from 'typed-mdast'
import { Element } from 'typed-hast'

/* Transform a table. */
export function table (h: H, node: Table) {
  const rows = node.children as TableRow[]
  let index = rows.length
  const align = node.align
  const alignLength = align.length
  const result: Element[] = []
  let pos
  let row
  let out
  let name
  let cell

  while (index--) {
    row = rows[index].children
    name = index === 0 ? 'th' : 'td'
    pos = alignLength
    out = []

    while (pos--) {
      cell = row[pos] as TableCell
      out[pos] = h(cell, name, {
        align: align[pos],
      }, cell ? wrap(all(h, cell)) : [])
    }

    result[index] = h(rows[index], 'tr', wrap(out, true)) as Element
  }

  return h(node, 'table', wrap([
    h({
      position: result[0].position,
    } as Node, 'thead', wrap([result[0]], true)),
    h({
      position: (result[1].position || result[result.length - 1].position) && {
        start: result[1].position && result[1].position.start,
        end: result[result.length - 1].position && result[result.length - 1].position.end,
      },
    } as Node, 'tbody', wrap(result.slice(1), true)),
  ], true))
}
