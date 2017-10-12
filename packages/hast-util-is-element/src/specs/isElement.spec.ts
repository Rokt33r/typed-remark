import { isElement } from '../lib'
import { Node } from 'typed-unist'

describe('isElement', () => {
  describe('isElement(node)', () => {
    it('should return `false` when without `element`', () => {
      const result = isElement({ type: 'text' })

      expect(result).toBe(false)
    })

    it('should return `false` when with invalid `element`', () => {
      const result = isElement({ type: 'element' })

      expect(result).toBe(false)
    })

    it('should return `true` when with valid `element`', () => {
      const result = isElement({
        type: 'element',
        tagName: 'div',
      } as Node)

      expect(result).toBe(true)
    })
  })

  describe('isElement(node, tagName)', () => {
    it('should return `false` when without `element`', () => {
      const result = isElement({ type: 'text' }, 'div')

      expect(result).toBe(false)
    })

    it('should return `false` when with invalid `element`', () => {
      const result = isElement({ type: 'element' }, 'div')

      expect(result).toBe(false)
    })

    it('should return `false` when without matching `element`', () => {
      const result = isElement({
        type: 'element',
        tagName: 'strong',
      } as Node, 'div')

      expect(result).toBe(false)
    })

    it('should return `true` when with matching `element`', () => {
      const result = isElement({
        type: 'element',
        tagName: 'div',
      } as Node, 'div')

      expect(result).toBe(true)
    })
  })

  describe('isElement(node, tagNames)', () => {
    it('should return `false` when without `element`', () => {
      const result = isElement({
        type: 'text',
      }, ['div'])

      expect(result).toBe(false)
    })

    it('should return `false` when with invalid `element`', () => {
      const result = isElement({type: 'element'}, ['div'])

      expect(result).toBe(false)
    })

    it('should return `false` when without matching `element`', () => {
      const result = isElement({
        type: 'element',
        tagName: 'strong',
      } as Node, ['div'])

      expect(result).toBe(false)
    })

    it('should return `true` when with matching `element` (#1)', () => {
      const result = isElement({
        type: 'element',
        tagName: 'div',
      } as Node, ['div', 'strong', 'em'])

      expect(result).toBe(true)
    })

    it('should return `true` when with matching `element` (#2)', () => {
      const result = isElement({
        type: 'element',
        tagName: 'em',
      } as Node, ['div', 'strong', 'em'])

      expect(result).toBe(true)
    })
  })
})
