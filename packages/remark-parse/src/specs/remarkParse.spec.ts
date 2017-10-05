import * as path from 'path'
import * as fs from 'fs'
import { VFile } from 'typed-vfile'
import unified from 'typed-unified'
import remarkParse from '../lib'
import u from 'typed-unist-builder'
import { Eat, TokenizeMethod } from '../lib/tokenizer'

describe('remark-parse', () => {
  it('parses string', () => {
    const processor = unified().use(remarkParse)

    const result = processor.parse('Alfred')

    const position = {
      start: { column: 1, line: 1, offset: 0},
      end: { column: 7, line: 1, offset: 6 },
    }
    expect(result).toEqual(
      u('root', { position }, [
        u('paragraph', {
          position: {
            ...position,
            indent: [],
          },
        },
        [
          u('text', {
            position: {
              ...position,
              indent: [],
            },
          }, 'Alfred'),
        ]),
      ]),
    )
  })

  it('parses without position', () => {
    const processor = unified().use(remarkParse, {
      position: false,
    })

    const result = processor.parse('<foo></foo>')

    expect(result).toEqual(
      u('root', [
        u('paragraph', [
          u('html', '<foo>'),
          u('html', '</foo>'),
        ]),
      ]),
    )
  })

  it('parses with overrided blocks', () => {
    const processor = unified().use(remarkParse, {
      position: false,
      blocks: ['foo'],
    })

    const result = processor.parse('<foo></foo>')

    expect(result).toEqual(
      u('root', [
        u('html', '<foo></foo>'),
      ]),
    )
  })

  it('parses with overrided blocks', () => {
    const fn = jest.fn()
    const processor = unified()
      .use(remarkParse, {
        position: false,
      })
      .use(plugin)

    try {
      processor.parse('Hello *World*!')
    } catch (error) {
      expect(error.file).toBeUndefined()
      expect(error.line).toBe(1)
      expect(error.column).toBe(7)
      expect(error.reason).toBe('Found it!')
      expect(String(error)).toBe('1:7: Found it!')
    }
    expect(fn).toBeCalled()

    function plugin () {
      const emphasis: TokenizeMethod = function (eat: Eat, value: string) {
        if (value.charAt(0) === '*') {
          fn()
          eat.file.fail('Found it!', eat.now())
        }
      } as TokenizeMethod
      emphasis.locator = locator
      this.Parser.prototype.inlineTokenizers.emphasis = emphasis

      function locator (value: string, fromIndex?: number) {
        return value.indexOf('*', fromIndex)
      }
    }
  })

  it('warns when missing locators', () => {
    const processor = unified()
      .use(remarkParse, {
        position: false,
      })
      .use(plugin)

    try {
      processor.parse('Hello *World*!')
    } catch (error) {
      expect(String(error)).toBe('1:1: Missing locator: `foo`')
    }

    function plugin () {
      const methods = this.Parser.prototype.inlineMethods

      /* Tokenizer. */
      function noop () {
        // Do nothing
      }

      this.Parser.prototype.inlineTokenizers.foo = noop
      methods.splice(methods.indexOf('inlineText'), 0, 'foo')
    }
  })

  it.only('warns about entities', () => {
    const filePath = path.join(__dirname, '../../fixtures/input/entities-advanced.text')
    const file = new VFile(fs.readFileSync(filePath))
    const processor = unified().use(remarkParse)
    const notTerminated = 'Named character references must be terminated by a semicolon'
    processor.parse(file)

    expect(file.messages.map(String)).toEqual([
      '1:13: Named character references must be known',
      '5:15: ' + notTerminated,
      '9:44: ' + notTerminated,
      '11:38: ' + notTerminated,
      '13:16: ' + notTerminated,
      '14:16: ' + notTerminated,
      '14:37: ' + notTerminated,
      '16:16: ' + notTerminated,
      '17:17: ' + notTerminated,
      '18:21: ' + notTerminated,
      '21:11: ' + notTerminated,
      '23:16: ' + notTerminated,
      '23:37: ' + notTerminated,
      '27:17: ' + notTerminated,
      '28:17: ' + notTerminated,
      '29:21: ' + notTerminated,
      '32:11: ' + notTerminated,
      '35:27: ' + notTerminated,
      '36:10: ' + notTerminated,
      '40:25: ' + notTerminated,
      '41:10: ' + notTerminated,
    ])
  })
})
