import { toHTML } from '../lib'
import u from 'typed-unist-builder'

describe('toHTML', () => {
  it('should throw on unknown nodes', () => {
    expect(() => {
      toHTML(u('foo', []))
    }).toThrowError(/Cannot compile unknown node `foo`/)
  })
})
