import { Point, Position, Node } from 'typed-unist'

export function stringifyPosition (position: Position): string {
  return `${stringifyPoint(position.start)}-${stringifyPoint(position.end)}`
}

export function stringifyPoint (point: Point): string {
  return `${point.line}:${point.column}`
}

export function stringifyNode (node: Node): string {
  const position = node.position
  if (position == null) {
    return stringifyPoint({
      line: 1,
      column: 1,
    })
  }

  return stringifyPosition(position)
}

export function stringify (input: Point | Position | Node): string {
  if ((input as Node).type != null) return stringifyNode((input as Node))
  if ((input as Position).start != null) return stringifyPosition((input as Position))
  if ((input as Point).line != null) return stringifyPoint((input as Point))
  throw new Error(`Invalid argument: the argument must be Point, Position or Node. But got ${input}`)
}
