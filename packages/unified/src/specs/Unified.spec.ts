import unified, {
  Processor,
  Doc,
  ParserFunction,
  ParserConstructor
} from '../lib/Unified'
import { Node, Text } from 'typed-unist'
import { VFile } from 'typed-vfile'

describe('unified', () => {
  it('create a processor', () => {
    const processor = unified()

    expect(processor).not.toBeUndefined()
  })
})

describe('Processor', () => {
  describe('use', () => {
    it('stores a plugin', () => {
      const attacher = (aProcessor: Processor) => (node: Node) => node
      const options = {}
      const processor = new Processor()

      processor.use(attacher, options)

      expect(processor.attachers).toEqual([[attacher, options]])
    })
  })

  describe('freeze', () => {
    it('sets frozen true', () => {
      const processor = new Processor()

      processor.freeze()

      expect(processor.frozen).toBe(true)
    })
  })

  describe('parse', () => {
    const parserFunctionPlugin = function (this: Processor) {
      this.Parser = (doc: Doc) => ({type: 'random_node', value: String(doc)})
    }
    const parserClassPlugin = function (this: Processor) {
      this.Parser = class {
        public input: string
        constructor (input: Doc) {
          this.input = String(input)
        }

        public parse () {
          return {
            type: 'random_node',
            value: this.input,
          }
        }
      }
    }

    it('freezes processor', () => {
      const processor = new Processor()
      processor.use(parserFunctionPlugin)

      const result = processor.parse('hello')

      expect(processor.frozen).toBe(true)
    })

    it('parses string into node with ParserFunction', () => {
      const processor = new Processor()
      processor.use(parserFunctionPlugin)

      const result = processor.parse('hello')

      expect(result).toEqual({
        type: 'random_node',
        value: 'hello',
      })
    })

    it('parses string into node with ParserClass', () => {
      const processor = new Processor()
      processor.use(parserClassPlugin)

      const result = processor.parse('hello')

      expect(result).toEqual({
        type: 'random_node',
        value: 'hello',
      })
    })

    it('throws an error if parser is not set', () => {
      const processor = new Processor()

      expect(() => {
        processor.parse('hello')
      }).toThrowError()
    })
  })

  describe('stringify', () => {
    const compilerFunctionPlugin = function (this: Processor) {
      this.Compiler = (node: Node) => node.type
    }
    const compilerClassPlugin = function (this: Processor) {
      this.Compiler = class {
        public node: Node

        constructor (node: Node) {
          this.node = node
        }

        public compile () {
          return this.node.type
        }
      }
    }

    it('freezes processor', () => {
      const processor = new Processor()
      processor.use(compilerFunctionPlugin)

      processor.stringify({
        type: 'random_node',
      })

      expect(processor.frozen).toBe(true)
    })

    it('stringifies a node into string with CompilerFunction', () => {
      const processor = new Processor()
      processor.use(compilerFunctionPlugin)

      const result = processor.stringify({
        type: 'random_node',
      })

      expect(result).toBe('random_node')
    })

    it('stringifies a node into string with CompilerClass', () => {
      const processor = new Processor()
      processor.use(compilerClassPlugin)

      const result = processor.stringify({
        type: 'random_node',
      })

      expect(result).toBe('random_node')
    })

    it('throws an error if compiler is not set', () => {
      const processor = new Processor()

      expect(() => {
        processor.stringify({
          type: 'random_node',
        })
      }).toThrowError()
    })
  })

  describe('run', () => {
    it('freezes processor', async () => {
      const processor = new Processor()

      const result = await processor.run({
        type: 'random_node',
      })

      expect(processor.frozen).toBe(true)
    })

    it('transforms node', async () => {
      const mockFn = jest.fn().mockReturnValue({
        type: 'transformed_node',
      })
      const attacher = function (this: Processor) {
        return mockFn
      }
      const processor = new Processor()
      processor.use(attacher)

      const result = await processor.run({
        type: 'random_node',
      })

      expect(result).toEqual({
        type: 'transformed_node',
      })
      expect(mockFn).toBeCalled()
    })

    it('transforms node with async transformer', async () => {
      const mockFn = jest.fn().mockReturnValue(Promise.resolve({
        type: 'transformed_node',
      }))
      const attacher = function (this: Processor) {
        return mockFn
      }
      const processor = new Processor()
      processor.use(attacher)

      const result = await processor.run({
        type: 'random_node',
      })

      expect(result).toEqual({
        type: 'transformed_node',
      })
      expect(mockFn).toBeCalled()
    })
  })

  describe('runSync', () => {
    it('transforms node', () => {
      const mockFn = jest.fn().mockReturnValue({
        type: 'transformed_node',
      })
      const attacher = function (this: Processor) {
        return mockFn
      }
      const processor = new Processor()
      processor.use(attacher)

      const result = processor.runSync({
        type: 'random_node',
      })

      expect(result).toEqual({
        type: 'transformed_node',
      })
      expect(processor.frozen).toBe(true)
      expect(mockFn).toBeCalled()
    })

    it('throws an error if processor has async transformer', () => {
      const mockFn = jest.fn().mockReturnValue(Promise.resolve({
        type: 'transformed_node',
      }))
      const attacher = function (this: Processor) {
        return mockFn
      }
      const processor = new Processor()
      processor.use(attacher)

      expect(() => {
        processor.runSync({
          type: 'random_node',
        })
      }).toThrowError()
    })
  })

  describe('process and processSync', () => {
    const plugin = function (this: Processor) {
      this.Parser = (doc: Doc) => ({type: 'random_node', value: String(doc)})
      this.Compiler = (node: Node) => node.type + (node as Text).value
    }

    it('processes string into a VFile and freezes processor', async () => {
      const processor = new Processor()
      processor.use(plugin)

      const result = await processor.process('hello')
      expect(result).toBeInstanceOf(VFile)
      expect(result.contents).toBe('random_node' + 'hello')
      expect(processor.frozen).toBe(true)
    })

    it('processes string into a VFile synchronously', () => {
      const processor = new Processor()
      processor.use(plugin)

      const result = processor.processSync('hello')

      expect(result).toBeInstanceOf(VFile)
      expect(result.contents).toBe('random_node' + 'hello')
      expect(processor.frozen).toBe(true)
    })
  })

  describe('clone', () => {
    it('clones processor', () => {
      const plugin = function (this: Processor) {
        // Do nothing
      }
      const opts = {}
      const processor = new Processor()
      processor.use(plugin, opts)

      const result = processor.clone()

      expect(result).toBeInstanceOf(Processor)
      expect(result.attachers).toEqual([[plugin, opts]])
    })
  })

  describe('data', () => {
    it('initializes data', () => {
      const processor = new Processor()

      processor.data({
        test: 'hello',
      })

      expect(processor.namespace).toEqual({
        test: 'hello',
      })
    })

    it('retrieves data', () => {
      const processor = new Processor()
      processor.data({
        test: 'hello',
      })

      const result = processor.data()

      expect(result).toEqual({
        test: 'hello',
      })
    })

    it('sets a value for a key', () => {
      const processor = new Processor()

      processor.data('test', 'hello')

      expect(processor.namespace).toEqual({
        test: 'hello',
      })
    })

    it('retrieves a value for a key', () => {
      const processor = new Processor()
      processor.data({
        test: 'hello',
      })

      const result = processor.data('test')

      expect(result).toBe('hello')
    })

    it('throws an error when initializing data to frozen processor', () => {
      const processor = new Processor()
      processor.freeze()

      expect(() => {
        processor.data({
          test: 'hello',
        })
      }).toThrowError()
    })

    it('throws an error when setting data to frozen processor', () => {
      const processor = new Processor()
      processor.freeze()

      expect(() => {
        processor.data('test', 'hello')
      }).toThrowError()
    })
  })
})
