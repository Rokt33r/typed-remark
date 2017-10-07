import unified from 'typed-unified'
import remarkParse from 'typed-remark-parse'
import { getDefinitionFactory } from '../lib'

const processor = unified().use(remarkParse)

describe('getDefinitionFactory', () => {
  it('should return a definition', () => {
    const tree = processor.parse('[example]: http://example.com "Example"')
    const getDefinition = getDefinitionFactory(tree)

    const result = getDefinition('example')

    expect(result).toEqual({
      type: 'definition',
      identifier: 'example',
      url: 'http://example.com',
      title: 'Example',
      position: {
        start: {column: 1, line: 1, offset: 0},
        end: {column: 40, line: 1, offset: 39},
        indent: [],
      },
    })
  })

  it('should return null when not found', () => {
    const tree = processor.parse('[example]: http://example.com "Example"')
    const getDefinition = getDefinitionFactory(tree)

    const result = getDefinition('foo')

    expect(result).toBe(null)
  })

  it('should work on weird identifiers', () => {
    const tree = processor.parse('[__proto__]: http://proto.com "Proto"')
    const getDefinition = getDefinitionFactory(tree)

    const result = getDefinition('__proto__')

    expect(result).toEqual({
      type: 'definition',
      identifier: '__proto__',
      url: 'http://proto.com',
      title: 'Proto',
      position: {
        start: {column: 1, line: 1, offset: 0},
        end: {column: 38, line: 1, offset: 37},
        indent: [],
      },
    })
  })

  it('should work on weird identifiers when not found', () => {
    const tree = processor.parse('[__proto__]: http://proto.com "Proto"')
    const getDefinition = getDefinitionFactory(tree)

    const result = getDefinition('toString')

    expect(result).toEqual(null)
  })

  it('should prefer the last of duplicate definitions by default', () => {
    const tree = processor.parse([
      '[example]: http://one.com',
      '[example]: http://two.com',
    ].join('\n'))

    const result = getDefinitionFactory(tree)('example').url

    expect(result).toEqual('http://two.com')
  })

  it('should prefer the first of duplicate definitions in commonmark mode', () => {
    const tree = processor.parse([
      '[example]: http://one.com',
      '[example]: http://two.com',
    ].join('\n'))

    const result = getDefinitionFactory(tree, {commonmark: true})('example').url

    expect(result).toEqual('http://one.com')
  })
})
