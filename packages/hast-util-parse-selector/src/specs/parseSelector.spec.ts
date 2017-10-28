import { parseSelector } from '../lib'

describe('parseSelector', () => {
  it('should return an empty element without selector', () => {
    expect(parseSelector()).toEqual({
      type: 'element',
      tagName: 'div',
      properties: {},
      children: [],
    })
  })

  it('should return an element with a tag-name when given a tag-name', () => {
    expect(parseSelector('foo')).toEqual({
      type: 'element',
      tagName: 'foo',
      properties: {},
      children: [],
    })
  })

  it('should return a `div` element when given a class', () => {
    expect(parseSelector('.bar')).toEqual({
      type: 'element',
      tagName: 'div',
      properties: {className: ['bar']},
      children: [],
    })
  })

  it('should return a `div` element when given an ID', () => {
    expect(parseSelector('#bar')).toEqual({
      type: 'element',
      tagName: 'div',
      properties: {id: 'bar'},
      children: [],
    })
  })

  it('should return attributes', () => {
    expect(parseSelector('foo#bar.baz.qux')).toEqual({
      type: 'element',
      tagName: 'foo',
      properties: {
        id: 'bar',
        className: ['baz', 'qux'],
      },
      children: [],
    })
  })

  it('should return the last ID if multiple are found', () => {
    expect(parseSelector('foo#bar#baz')).toEqual({
      type: 'element',
      tagName: 'foo',
      properties: {id: 'baz'},
      children: [],
    })
  })

  it('should *not* case the tag-name', () => {
    expect(parseSelector('Foo')).toEqual({
      type: 'element',
      tagName: 'Foo',
      properties: {},
      children: [],
    })
  })
})
