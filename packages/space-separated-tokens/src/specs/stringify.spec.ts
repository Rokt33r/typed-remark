import { stringify } from '../lib/index'

describe('stringify', () => {
  it('should return an empty string for an empty array', () => {
    const result = stringify([])

    expect(result).toEqual('')
  })

  it('should return an empty string for an empty entry', () => {
    const result = stringify([''])

    expect(result).toEqual('')
  })

  it('should return an empty string for two empty entries', () => {
    const result = stringify(['', ''])

    expect(result).toEqual('')
  })

  it('should ignore initial empty entries', () => {
    const result = stringify(['', 'foo'])

    expect(result).toEqual('foo')
  })

  it('should ignore final empty values', () => {
    const result = stringify(['foo', ''])

    expect(result).toEqual('foo')
  })

  it('should do its best', () => {
    const result = stringify(['a', 'b', 'd d'])

    expect(result).toEqual('a b d d')
  })
})
