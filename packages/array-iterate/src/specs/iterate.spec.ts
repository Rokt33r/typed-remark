import { iterate } from '../lib'

describe('iterate', () => {
  it('should invoke `callback` each step', () => {
    const list = [0, 1, 2]
    let n = 0

    iterate(list, function (value, index, values) {
      expect(value).toBe(n)
      expect(index).toBe(n)
      expect(values).toBe(list)
      expect(this).toBe(undefined)

      n++
    })

    expect(n).toBe(3)
  })

  it('should invoke `callback` with context', () => {
    const self = {}
    let n = 0

    iterate([1, 2, 3], function () {
      expect(this).toBe(self)

      n++
    }, self)

    expect(n).toBe(3)
  })

  it('should use the given return value', () => {
    let n = 0

    iterate([0, 1, 2], function (value, index): number | void {
      n++

      expect(value).toBe(index)

      /* Stay on position `0` ten times. */
      if (n <= 10) {
        return 0
      }
    })

    expect(n).toBe(13)
  })

  it('should ignore missing values', () => {
    const magicNumber = 10
    const list = Array(magicNumber)
    const cb = jest.fn()

    list.push(magicNumber + 1)

    iterate(list, cb)

    expect(cb).toHaveBeenCalledTimes(1)
    expect(cb).toBeCalledWith(magicNumber + 1, magicNumber, list)
  })

  it('should support negative indices', () => {
    let n = 0
    const results = ['a', 'b', 'a', 'b', 'c', 'd']

    iterate(['a', 'b', 'c', 'd'], function (value): number | void {
      expect(value).toBe(results[n])
      n++

      if (n === 2) {
        return -1
      }
    })

    expect(n).toBe(results.length)
  })
})
