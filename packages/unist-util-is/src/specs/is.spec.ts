import { is } from '../lib'
import { Node, Parent } from 'typed-unist'

describe('is', () => {
  const node: Node = { type: 'strong' }
  const parent: Parent = {
    type: 'paragraph',
    children: [],
  }

  it('should throw when `index` is invalid (#1)', () => {
    expect(() => is(null, node, -1, parent)).toThrowError(/Expected positive finite index or child node/)
  })

  it('should throw when `index` is invalid (#2)', () => {
    expect(() => is(null, node, Infinity, parent)).toThrowError(/Expected positive finite index or child node/)
  })

  it('should check if given a node', () => {
    expect(is(null, node)).toBe(true)
  })

  it('should match types (#1)', () => {
    expect(is('strong', node)).toBe(true)
  })

  it('should match types (#2)', () => {
    expect(is('emphasis', node)).toBe(false)
  })

  it('should match partially (#1)', () => {
    expect(is(node, node)).toBe(true)
  })

  it('should match partially (#2)', () => {
    expect(is({type: 'strong'}, node)).toBe(true)
  })

  it('should match partially (#3)', () => {
    expect(is({type: 'paragraph'}, parent)).toBe(true)
  })

  it('should match partially (#4)', () => {
    expect(is({type: 'paragraph'}, node)).toBe(false)
  })

  it('should accept a test', () => {
    function test (input: Node, index: number) {
      return index === 5
    }

    expect(is(test, node)).toBe(false)
    expect(is(test, node, 0, parent)).toBe(false)
    expect(is(test, node, 5, parent)).toBe(true)
  })

  it('should invoke test', () => {
    const context = {foo: 'bar'}
    const fn = jest.fn()
    function test (a: Node, b: number, c: Parent) {
      expect(this).toBe(context)
      expect(a).toBe(node)
      expect(b).toBe(5)
      expect(c).toBe(parent)
      fn()
      return true
    }

    expect(() => is(test, node, 5, parent, context)).not.toThrow()
    expect(fn).toBeCalled()
  })
})
