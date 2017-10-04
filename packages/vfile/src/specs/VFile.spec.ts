import { VFile } from '../lib'
import { Point, Position, Node } from 'typed-unist'

describe('VFile', () => {
  describe('constructor', () => {
    it('instantiates without any arguments', () => {
      const vfile = new VFile()

      expect(vfile).not.toBeUndefined()
      expect(vfile.contents).toBeUndefined()
      expect(vfile.history.length).toBe(0)
      expect(vfile.path).toBeUndefined()
      expect(vfile.dirname).toBeUndefined()
      expect(vfile.basename).toBeUndefined()
      expect(vfile.stem).toBeUndefined()
      expect(vfile.extname).toBeUndefined()
    })

    it('instantiates with string', () => {
      const vfile = new VFile('tango')

      expect(vfile.contents).toBe('tango')
    })

    it('instantiates with buffer', () => {
      const vfile = new VFile(new Buffer('tango'))

      expect((vfile.contents as Buffer).toString('utf-8')).toBe('tango')
    })

    it('instantiates with options', () => {
      const vfile = new VFile({
        contents: 'tango',
        path: 'test/test.md',
        data: {
          test: 'data',
        },
      })

      expect(vfile.contents).toBe('tango')
      expect(vfile.history[0]).toBe('test/test.md')
      expect(vfile.path).toBe('test/test.md')
      expect(vfile.dirname).toBe('test')
      expect(vfile.basename).toBe('test.md')
      expect(vfile.stem).toBe('test')
      expect(vfile.extname).toBe('.md')
      expect(vfile.data).toEqual({
        test: 'data',
      })
    })

    it('instantiates with options by correct order', () => {
      const vfile = new VFile({
        contents: 'tango',
        history: ['primitive/path.md'],
        path: 'test/test.md',
        basename: 'changed.md',
        stem: 'changed-again',
        extname: '.txt',
        dirname: 'yet-another-change',
      })

      expect(vfile.contents).toBe('tango')
      expect(vfile.path).toBe('yet-another-change/changed-again.txt')
      expect(vfile.history).toEqual([
        'primitive/path.md',
        'test/test.md',
        'test/changed.md',
        'test/changed-again.md',
        'test/changed-again.txt',
        'yet-another-change/changed-again.txt',
      ])
    })
  })

  describe('message', () => {
    it('creates a VFileMessage with a string', () => {
      const vfile = new VFile({
        contents: 'tango',
        path: 'test/test.md',
      })
      const point: Point = {
        line: 1,
        column: 2,
      }

      const message = vfile.message('random_reason', point, 'random_id')

      expect(message.name).toBe('test/test.md:1:2')
      expect(message.file).toBe('test/test.md')
      expect(message.reason).toBe('random_reason')
      expect(message.location).toEqual({
        start: {
          line: 1,
          column: 2,
        },
        end: {
          line: null,
          column: null,
        },
      })
      expect(message.line).toBe(1)
      expect(message.column).toBe(2)
      expect(message.ruleId).toBe('random_id')
      expect(message.fatal).toBe(false)
      expect(message.stack).toBe('')
      expect(String(message)).toBe('test/test.md:1:2: random_reason')
    })

    it('creates a VFileMessage with an error', () => {
      const vfile = new VFile({
        contents: 'tango',
        path: 'test/test.md',
      })
      const point: Point = {
        line: 1,
        column: 2,
      }
      const error = new Error('random_reason')

      const message = vfile.message(error, point, 'random_id')

      expect(message.reason).toBe('random_reason')
      expect(message.fatal).toBe(false)
      expect(message.stack).toBe(error.stack)
    })

    it('creates a VFileMessage with a position', () => {
      const vfile = new VFile({
        contents: 'tango',
        path: 'test/test.md',
      })
      const position: Position = {
        start: {
          line: 1,
          column: 2,
        },
        end: {
          line: 1,
          column: 3,
        },
      }

      const message = vfile.message('random_reason', position, 'random_id')

      expect(message.name).toBe('test/test.md:1:2-1:3')
      expect(message.location).toEqual({
        start: {
          line: 1,
          column: 2,
        },
        end: {
          line: 1,
          column: 3,
        },
      })
      expect(message.line).toBe(1)
      expect(message.column).toBe(2)
    })

    it('creates a VFileMessage with a node', () => {
      const vfile = new VFile({
        contents: 'tango',
        path: 'test/test.md',
      })
      const node: Node = {
        type: 'random_node',
        position: {
          start: {
            line: 1,
            column: 2,
          },
          end: {
            line: 1,
            column: 3,
          },
        },
      }

      const message = vfile.message('random_reason', node, 'random_id')

      expect(message.name).toBe('test/test.md:1:2-1:3')
      expect(message.location).toEqual({
        start: {
          line: 1,
          column: 2,
        },
        end: {
          line: 1,
          column: 3,
        },
      })
      expect(message.line).toBe(1)
      expect(message.column).toBe(2)
    })
  })

  describe('history', () => {
    it('stores a new path', () => {
      const vfile = new VFile({
        contents: 'tango',
        path: 'test/test.md',
      })

      vfile.path = 'test/changed.md'

      expect(vfile.history[1]).toBe('test/changed.md')
    })
  })

  describe('dirname', () => {
    it('updates path if dirname is set', () => {
      const vfile = new VFile({
        contents: 'tango',
        path: 'test/test.md',
      })

      vfile.dirname = 'changed'

      expect(vfile.path).toBe('changed/test.md')
    })

    it('throws an error if path is not set', () => {
      const vfile = new VFile()

      expect(() => {
        vfile.dirname = 'changed'
      }).toThrowError()
    })
  })

  describe('basename', () => {
    it('updates path if set', () => {
      const vfile = new VFile({
        contents: 'tango',
        path: 'test/test.md',
      })

      vfile.basename = 'changed.md'

      expect(vfile.path).toBe('test/changed.md')
    })

    it('thrown if set undefined', () => {
      const vfile = new VFile({
        contents: 'tango',
        path: 'test/test.md',
      })

      expect(() => {
        vfile.basename = undefined
      }).toThrowError()
    })

    it('thrown if set a string with path.sed', () => {
      const vfile = new VFile({
        contents: 'tango',
        path: 'test/test.md',
      })

      expect(() => {
        vfile.basename = 'changd.md/invalid'
      }).toThrowError()
    })
  })

  describe('extname', () => {
    it('updates path if set', () => {
      const vfile = new VFile({
        contents: 'tango',
        path: 'test/test.md',
      })

      vfile.extname = '.txt'

      expect(vfile.path).toBe('test/test.txt')
    })

    it('thrown if set a string with path.sed', () => {
      const vfile = new VFile({
        contents: 'tango',
        path: 'test/test.md',
      })

      expect(() => {
        vfile.extname = '.im/invalid'
      }).toThrowError()
    })

    it('throws if path is not set', () => {
      const vfile = new VFile()

      expect(() => {
        vfile.extname = '.txt'
      }).toThrowError()
    })
  })

  describe('stem', () => {
    it('updates path if set', () => {
      const vfile = new VFile({
        contents: 'tango',
        path: 'test/test.md',
      })

      vfile.stem = 'changed'

      expect(vfile.path).toBe('test/changed.md')
    })

    it('throws if set undefined', () => {
      const vfile = new VFile({
        contents: 'tango',
        path: 'test/test.md',
      })

      expect(() => {
        vfile.stem = undefined
      })
    })

    it('throws if set a string with path.sed', () => {
      const vfile = new VFile({
        contents: 'tango',
        path: 'test/test.md',
      })

      expect(() => {
        vfile.stem = 'changed/'
      })
    })
  })
})
