import h from 'typed-hastscript'
import { toHTML } from '../lib'
import { Node } from 'typed-unist'

describe('`element`', () => {
  it('should stringify `element`s', () => {
    const input = h('i', ['bravo'])

    expect(toHTML(input)).toBe('<i>bravo</i>')
  })

  it('should stringify unknown `element`s', () => {
    const input = h('foo')

    expect(toHTML(input)).toBe('<foo></foo>')
  })

  it('should stringify void `element`s', () => {
    const input = h('img')

    expect(toHTML(input)).toBe('<img>')
  })

  it('should stringify given void `element`s', () => {
    const input = h('foo')
    const opts = {voids: ['foo']}

    expect(toHTML(input, opts)).toBe('<foo>')
  })

  it('should stringify with ` /` in `closeSelfClosing` mode', () => {
    const input = h('img')
    const opts = {closeSelfClosing: true}

    expect(toHTML(input, opts)).toBe('<img />')
  })

  it('should stringify voids with `/` in `closeSelfClosing` and `tightSelfClosing` mode', () => {
    const input = h('img')
    const opts = {closeSelfClosing: true, tightSelfClosing: true}

    expect(toHTML(input, opts)).toBe('<img/>')
  })

  it('should stringify voids with a ` /` in if an unquoted attribute ends with `/`', () => {
    const input = h('img', [], {title: '/'})
    const opts = {
      preferUnquoted: true,
      closeSelfClosing: true,
      tightSelfClosing: true,
    }

    expect(toHTML(input, opts)).toBe('<img title=/ />')
  })

  it('should support `<template>`s content', () => {
    const input = {
      type: 'element',
      tagName: 'template',
      properties: {},
      children: [] as Node[],
      content: {
        type: 'root',
        children: [
          h('p', [
            h('b', ['Bold']),
            ' and ',
            h('i', ['italic']),
            '.',
          ]),
        ],
      },
    }

    expect(toHTML(input)).toBe('<template><p><b>Bold</b> and <i>italic</i>.</p></template>')
  })
})
