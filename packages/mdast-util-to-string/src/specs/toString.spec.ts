import { toString } from '../lib'

describe('mdast-util-to-string', () => {
  it('should not fail on unrecognised nodes', () => {
    const input = {type: 'anything', value: 'foo'}

    expect(toString(input)).toBe('foo')
  })

  it('should prefer `value` over all others', () => {
    const input = {
      type: 'anything',
      value: 'foo',
      children: [{value: 'foo'}, {alt: 'bar'}, {title: 'baz'}],
    }

    expect(toString(input)).toBe('foo')
  })

  it('should prefer `value` over `alt` or `title`', () => {
    const input = {
      type: 'anything',
      value: 'foo',
      alt: 'bar',
      title: 'baz',
    }

    expect(toString(input)).toBe('foo')
  })

  it('should prefer `alt` over `title`', () => {
    const input = {
      type: 'anything',
      alt: 'bar',
      title: 'baz',
    }

    expect(toString(input)).toEqual('bar')
  })

  it('should use `title` over `children`', () => {
    const input = {
      type: 'anything',
      title: 'baz',
      children: [{value: 'foo'}, {alt: 'bar'}, {title: 'baz'}],
    }

    expect(toString(input)).toBe('baz')
  })

  it('should prefer `children`', () => {
    const input = {
      type: 'anything',
      children: [{value: 'foo'}, {alt: 'bar'}, {title: 'baz'}],
    }

    expect(toString(input)).toBe('foobarbaz')
  })

  it('should fall back on an empty string', () => {
    const input = {
      type: 'anything',
    }

    expect(toString(input)).toBe('')
  })
})
