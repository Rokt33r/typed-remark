import { parse } from '../lib'

describe('parse', () => {
  it('should be a function', () => {
    const result = typeof parse

    expect(result).toBe('function')
  })

  it('should return one empty entry for a single comma', () => {
    const result = parse(',')

    expect(result).toEqual([''])
  })

  it('should return two empty entry for a two comma’s', () => {
    const result = parse(',,')

    expect(result).toEqual(['', ''])
  })

  it('should work', () => {
    const result = parse(' a ,b,,d d ')

    expect(result).toEqual(['a', 'b', '', 'd d'])
  })
})
