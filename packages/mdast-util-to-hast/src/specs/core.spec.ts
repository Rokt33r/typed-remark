import u from 'typed-unist-builder'
import { toHAST } from '../lib'

describe('toHast', () => {
  it('should prefer `data.hName` to tag-names', () => {
    const input = u('strong', {data: {hName: 'b'}}, [u('text', 'tango')])

    const result = toHAST(input)

    expect(result).toEqual(u('element', {tagName: 'b', properties: {}}, [u('text', 'tango')]))
  })

  it('should prefer `data.hChildren` to children', () => {
    const input = u('strong', {data: {
      hChildren: [u('element', {tagName: 'i', properties: {}}, [u('text', 'tango')])],
    }}, [u('text', 'uniform')])

    const result = toHAST(input)

    expect(result).toEqual(u('element', {tagName: 'strong', properties: {}}, [
      u('element', {tagName: 'i', properties: {}}, [u('text', 'tango')]),
    ]))
  })

  it('should patch `position`s when given', () => {
    const input =  u('emphasis', {position: {
      start: {line: 2, column: 3},
      end: {line: 2, column: 12},
    }}, [u('text', 'tango')])

    const result = toHAST(input)

    expect(result).toEqual(u('element', {
      tagName: 'em',
      properties: {},
      position: {
        start: {line: 2, column: 3},
        end: {line: 2, column: 12},
      },
    }, [u('text', 'tango')]))
  })

  it('should patch `position`s on `pre` and `code`', () => {
    const input = u('code', {position: {
      start: {line: 1, column: 1},
      end: {line: 3, column: 4},
    }}, 'tango')

    const result = toHAST(input)

    expect(result).toEqual(u('element', {
      tagName: 'pre',
      properties: {},
      position: {
        start: {line: 1, column: 1},
        end: {line: 3, column: 4},
      },
    }, [
      u('element', {
        tagName: 'code',
        properties: {},
        position: {
          start: {line: 1, column: 1},
          end: {line: 3, column: 4},
        },
      }, [
        u('text', 'tango\n'),
      ]),
    ]))
  })

  it('should transform unknown texts to `text`', () => {
    const input = u('foo', 'tango')

    const result = toHAST(input)

    expect(result).toEqual(u('text', 'tango'))
  })

  it('should transform unknown parents to `div`', () => {
    const input = u('bar', [u('text', 'tango')])

    const result = toHAST(input)

    expect(result).toEqual(u('element', {tagName: 'div', properties: {}}, [u('text', 'tango')]))
  })

  it('should transform unknown nodes to `div`', () => {
    const input = u('bar')

    const result = toHAST(input)

    expect(result).toEqual(u('element', {tagName: 'div', properties: {}}, []))
  })

  it('should transform unknown nodes with `data.h*` properties', () => {
    const input = u('foo', {data: {hName: 'code', hProperties: {className: 'charlie'}, hChildren: [u('text', 'tango')]}}, 'tango')

    const result = toHAST(input)

    expect(result).toEqual(u('element', {tagName: 'code', properties: {className: 'charlie'}}, [u('text', 'tango')]))
  })

  it('should transform unknown nodes with `data.hChildren` only to `div`', () => {
    const input = u('foo', {data: {hChildren: [u('text', 'tango')]}}, 'tango')

    const result = toHAST(input)

    expect(result).toEqual(u('element', {tagName: 'div', properties: {}}, [u('text', 'tango')]))
  })

  it('should transform unknown nodes with `data.hProperties` only to a `element` node', () => {
    const input = u('foo', {data: {hProperties: {className: 'charlie'}}}, 'tango')

    const result = toHAST(input)

    expect(result).toEqual(u('element', {tagName: 'div', properties: {className: 'charlie'}}, []))
  })
})
