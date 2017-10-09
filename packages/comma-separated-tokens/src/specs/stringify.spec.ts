import { stringify } from '../lib'

describe('stringify', () => {
  it('should be a function', () => {
    const result = typeof stringify

    expect(result).toBe('function')
  })

  it('should return an empty string for an empty array', () => {
    const result = stringify([])

    expect(result).toEqual('')
  })

  it('should return a single comma for an empty entry', () => {
    const result = stringify([''])

    expect(result).toEqual(',')
  })

  it('should return two comma’s for two empty entries', () => {
    const result = stringify(['', ''])

    expect(result).toEqual(', ,')
  })

  it('should add an initial comma', () => {
    const result = stringify(['', 'foo'])

    expect(result).toEqual(', foo')
  })
})
