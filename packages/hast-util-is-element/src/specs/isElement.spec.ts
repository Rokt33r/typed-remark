import { isElement } from '../lib'

describe('isElement(node)', () => {
  it('should return `false` when without `element`', () => {
    const result = isElement({type: 'text'})

    expect(result).toBe(false)
  })

  it('should return `false` when with invalid `element`', () => {
    const result = isElement({type: 'element'})

    expect(result).toBe(false)
  })

  it('should return `true` when with valid `element`', () => {
    const result = isElement({type: 'element', tagName: 'div'})

    expect(result).toBe(true)
  })
})
