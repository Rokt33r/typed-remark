import { parse } from '../lib/index'

describe('parse()', () => {
    it('should return an empty array for an empty value', () => {
      const result = parse('')

      expect(result).toEqual([])
    })

    it('should return an empty array for a white-space', () => {
      const result = parse(' ')

      expect(result).toEqual([])
    })

    it('should return an empty array for a white-spaces', () => {
      const result = parse('\n\t\t ')

      expect(result).toEqual([])
    })

    it('should return ["foo", "bar", "💩"]', () => {
      const result = parse(' foo bar 💩\t\n\t ')

      expect(result).toEqual(['foo', 'bar', '💩'])
    })
})
