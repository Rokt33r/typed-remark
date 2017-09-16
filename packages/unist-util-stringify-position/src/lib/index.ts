import { Point, Position, Node } from 'typed-unist'

export function stringifyPosition (position: Position): string {
  return `${stringifyPoint(position.start)}-${stringifyPoint(position.end)}`
}

export function stringifyPoint (point: Point): string {
  return `${point.line}:${point.column}`
}

export function stringifyNode (node: Node): string {
  let position = node.position
  if (position == null) {
    position = {
      start: {
        line: 1,
        column: 1,
      },
      end: {
        line: 1,
        column: 1,
      },
    }
  }

  return stringifyPosition(position)
}
