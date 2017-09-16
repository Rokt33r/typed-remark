import { Point, Position, Node } from 'typed-unist'
import {
  stringifyPoint,
  stringifyPosition,
  stringifyNode,
} from '../lib'

describe('stringifyPoint', () => {
  it('stringifies a point', () => {
    const tangoPoint: Point = {
      line: 1,
      column: 5,
    }

    const result = stringifyPoint(tangoPoint)

    expect(result).toBe('1:5')
  })
})

describe('stringifyPosition', () => {
  it('stringifies a position', () => {
    const tangoPosition: Position = {
      start: {
        line: 1,
        column: 5,
      },
      end: {
        line: 2,
        column: 3,
      },
    }

    const result = stringifyPosition(tangoPosition)

    expect(result).toBe('1:5-2:3')
  })
})

describe('stringifyNode', () => {
  it('stringifies a node', () => {
    const tangoNode: Node = {
      type: 'random',
      position: {
        start: {
          line: 1,
          column: 5,
        },
        end: {
          line: 2,
          column: 3,
        },
      },
    }

    const result = stringifyNode(tangoNode)

    expect(result).toBe('1:5-2:3')
  })

  it('stringifies a node without position', () => {
    const tangoNode: Node = {
      type: 'random',
    }

    const result = stringifyNode(tangoNode)

    expect(result).toBe('1:1-1:1')
  })
})
