import { interElementWhiteSpace } from '../lib/index'
import { Node } from 'typed-unist'

describe('interElementWhiteSpace', () => {
  it('should return `false` without text', () => {
    const result = interElementWhiteSpace({
      type: 'element',
      tagName: 'div',
    } as Node)

    expect(result).toBe(false)
  })

  it('should return `false` for other white-space', () => {
    const result = interElementWhiteSpace({
      type: 'text',
      value: '\v',
    } as Node)

    expect(result).toBe(false)
  })

  it('should return `true` for inter-element white-space', () => {
    const result = interElementWhiteSpace({
      type: 'text',
      value: ' \t\r\n\f',
    } as Node)

    expect(result).toBe(true)
  })

  it('should return `true` for `text` without value', () => {
    const result = interElementWhiteSpace({ type: 'text' })

    expect(result).toBe(true)
  })

  it('should return `false` for a `string` of text', () => {
    const result = interElementWhiteSpace(' \v')

    expect(result).toBe(false)
  })

  it('should return `true` for a `string` of inter-element white-space', () => {
    const result = interElementWhiteSpace(' \t\r\n\f')

    expect(result).toBe(true)
  })
})
