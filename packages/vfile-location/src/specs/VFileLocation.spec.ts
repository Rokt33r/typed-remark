import VFileLocation from '../lib'
import { Point } from 'typed-unist'

describe('VFileLocation', () => {
  const location = new VFileLocation('foo\nbar\nbaz')

  describe('toPosition', () => {
    it('throws an error if a given offset is negative number', () => {
      expect(() => {
        location.toPosition(-1)
      }).toThrowError()
    })

    it('throws an error if a given offset is out of range', () => {
      expect(() => {
        location.toPosition(12)
      }).toThrowError()
    })

    it('returns a point(Regression Test)', () => {
      const qnaTuples: [number, Point][] = [
        [5, {line: 2, column: 2, offset: 5}],
        [0, {line: 1, column: 1, offset: 0}],
        [11, {line: 3, column: 4, offset: 11}],
      ]

      qnaTuples.forEach(([position, offset]) => {
        const result = location.toPosition(position)

        expect(result).toEqual(offset)
      })
    })
  })

  describe('toOffset', () => {
    it('returns -1 for an invalid position', () => {
      const result = location.toOffset({
        line: -1,
        column: -1,
      })

      expect(result).toBe(-1)
    })

    it('returns an offset(Regression Test)', () => {
      const qnaTuples: [Point, number][] = [
        [{line: 2, column: 2}, 5],
        [{line: 1, column: 1}, 0],
        [{line: 3, column: 4}, 11],
      ]

      qnaTuples.forEach(([position, offset]) => {
        const result = location.toOffset(position)

        expect(result).toEqual(offset)
      })
    })
  })
})
