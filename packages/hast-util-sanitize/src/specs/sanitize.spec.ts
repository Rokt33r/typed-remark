import { toHTML } from 'typed-hast-util-to-html'
import h from 'typed-hastscript'
import u from 'typed-unist-builder'
import gh from '../lib/github'
import { Node } from 'typed-unist'
import { sanitizeHAST, Properties } from '../lib'

describe('sanitize', () => {
  describe('unknown nodes', () => {
    it('should ignore unknown nodes', () => {
      const input: Node = u('unknown', '<xml></xml>')

      expect(toHTML(sanitizeHAST(input))).toBe('')
    })
  })

  describe('ignored nodes', () => {
    it('should ignore `raw`', () => {
      const input = u('raw', '<xml></xml>')

      expect(toHTML(sanitizeHAST(input))).toBe('')
    })

    it('should ignore declaration `directive`s', () => {
      const input = u('directive', {name: '!alpha'}, '!alpha bravo')

      expect(toHTML(sanitizeHAST(input))).toBe('')
    })

    it('should ignore processing instruction `directive`s', () => {
      const input = u('directive', {name: '?xml'}, '?xml version="1.0"')

      expect(toHTML(sanitizeHAST(input))).toBe('')
    })

    it('should ignore `characterData`s', () => {
      const input = u('characterData', 'alpha')

      expect(toHTML(sanitizeHAST(input))).toBe('')
    })

    it('should ignore `comment`s', () => {
      const input = u('comment', 'alpha')

      expect(toHTML(sanitizeHAST(input))).toBe('')
    })
  })

  describe('`text`', () => {
    it('should allow known properties', () => {
      const input = {
        type: 'text',
        tagName: 'div',
        value: 'alert(1)',
        unknown: 'alert(1)',
        properties: {href: 'javascript:alert(1)'},
        children: [h('script', ['alert(1)'])],
        data: {href: 'alert(1)'},
        position: {
          start: {line: 1, column: 1},
          end: {line: 2, column: 1},
        },
      }

      expect(sanitizeHAST(input)).toEqual({
        type: 'text',
        value: 'alert(1)',
        data: {href: 'alert(1)'},
        position: {
          start: {line: 1, column: 1},
          end: {line: 2, column: 1},
        },
      })
    })

    it('should allow `text`', () => {
      const input = u('text', 'alert(1)')

      expect(toHTML(sanitizeHAST(input))).toBe('alert(1)')
    })

    it('should ignore non-string `value`s', () => {
      const input = u('text', { toString })

      expect(toHTML(sanitizeHAST(input))).toBe('')
    })

    it('should ignore `text` in `script` elements', () => {
      const input = h('script', [u('text', 'alert(1)')])

      expect(toHTML(sanitizeHAST(input))).toBe('')
    })

    it('should show `text` in `style` elements', () => {
      const input = h('style', [u('text', 'alert(1)')])

      expect(toHTML(sanitizeHAST(input))).toBe('alert(1)')
    })
  })

  describe('`element`', () => {
    it('should allow known properties', () => {
      const input = {
        type: 'element',
        tagName: 'div',
        value: 'alert(1)',
        unknown: 'alert(1)',
        properties: {href: 'javascript:alert(1)'},
        children: [h('script', ['alert(1)'])],
        data: {href: 'alert(1)'},
        position: {
          start: {line: 1, column: 1},
          end: {line: 2, column: 1},
        },
      }

      expect(sanitizeHAST(input)).toEqual({
        type: 'element',
        tagName: 'div',
        properties: {},
        children: [],
        data: {href: 'alert(1)'},
        position: {
          start: {line: 1, column: 1},
          end: {line: 2, column: 1},
        },
      })
    })

    it('should ignore unknown elements', () => {
      const input = h('unknown', [u('text', 'alert(1)')])

      expect(sanitizeHAST(input)).toEqual(u('text', 'alert(1)'))
    })

    it('should ignore elements without name', () => {
      const input = {
        type: 'element',
        properties: {},
        children: [u('text', 'alert(1)')],
      }

      expect(sanitizeHAST(input)).toEqual(u('text', 'alert(1)'))
    })

    it('should support elements without children / properties', () => {
      const input = {
        type: 'element',
        tagName: 'div',
      }

      expect(sanitizeHAST(input)).toEqual(h())
    })
    it('should always return a valid node (#1)', () => {
      const input = h('unknown', [])

      expect(sanitizeHAST(input)).toEqual(u('root', []))
    })

    it('should always return a valid node (#2)', () => {
      const input = h('script', [])

      expect(sanitizeHAST(input)).toEqual(u('root', []))
    })

    it('should always return a valid node (#3)', () => {
      const input = h('div', [h('style', [u('text', '1'), u('text', '2')])])

      expect(sanitizeHAST(input)).toEqual(h('div', [u('text', '1'), u('text', '2')]))
    })

    it('should always return a valid node (#4)', () => {
      const input = h('unknown', [u('text', 'value')])

      expect(sanitizeHAST(input)).toEqual(u('text', 'value'))
    })

    it('should always return a valid node (#5)', () => {
      const input = h('unknown', [u('text', '1'), u('text', '2')])

      expect(sanitizeHAST(input)).toEqual(u('root', [u('text', '1'), u('text', '2')]))
    })

    it('should allow known generic properties', () => {
      const input = h('div', [], {alt: 'alpha'})

      expect(sanitizeHAST(input)).toEqual(h('div', [], {alt: 'alpha'}))
    })

    it('should allow specific properties', () => {
      const input = h('a', [], {href: '#heading'})

      expect(sanitizeHAST(input)).toEqual(h('a', [], {href: '#heading'}))
    })

    it('should ignore mismatched specific properties', () => {
      const input = h('img', [], {href: '#heading'})

      expect(sanitizeHAST(input)).toEqual(h('img'))
    })

    it('should ignore unspecified properties', () => {
      const input = h('div', [], {dataFoo: 'bar'})

      expect(sanitizeHAST(input)).toEqual(h('div'))
    })

    it('should ignore unspecified properties', () => {
      const input = h('div', [], {dataFoo: 'bar'})

      expect(sanitizeHAST(input)).toEqual(h('div'))
    })

    it('should allow `data*`', () => {
      const input = h('div', [], {dataFoo: 'bar'})
      const opts = {
        ...gh,
        attributes: {
          ...gh.attributes,
          '*': gh.attributes['*'].concat('data*'),
        },
      }

      expect(sanitizeHAST(input, opts)).toEqual(h('div', [], {dataFoo: 'bar'}))
    })

    it('should allow `string`s', () => {
      const input = h('img', [], {alt: 'hello'})

      expect(sanitizeHAST(input)).toEqual(h('img', [], {alt: 'hello'}))
    })

    it('should allow `boolean`s', () => {
      const input = h('img', [], {alt: true})

      expect(sanitizeHAST(input)).toEqual(h('img', [], {alt: true}))
    })

    it('should allow `number`s', () => {
      const input = h('img', [], {alt: 1})

      expect(sanitizeHAST(input)).toEqual(h('img', [], {alt: 1}))
    })

    it('should ignore `null`', () => {
      const input = u('element', {
        tagName: 'img',
        properties: {alt: null},
      })

      expect(sanitizeHAST(input)).toEqual(h('img'))
    })

    it('should ignore `undefined`', () => {
      const input = u('element', {
        tagName: 'img',
        properties: {alt: undefined},
      })

      expect(sanitizeHAST(input)).toEqual(h('img'))
    })

    it('should prevent clobbering (#1)', () => {
      const input = h('div', [], {id: 'getElementById'})

      expect(sanitizeHAST(input)).toEqual(h('div', [], {id: 'user-content-getElementById'}))
    })

    it('should prevent clobbering (#2)', () => {
      const input = h('div', [], {name: 'getElementById'})

      expect(sanitizeHAST(input)).toEqual(h('div', [], {name: 'user-content-getElementById'}))
    })

    it('should ignore objects', () => {
      const input = u('element', {
        tagName: 'img',
        properties: {alt: {toString}},
      })

      expect(sanitizeHAST(input)).toEqual(h('img'))
    })

    it('should supports arrays', () => {
      const input = u('element', {
        tagName: 'img',
        properties: {
          alt: [1, true, 'three', [4], {toString}],
        },
      })

      expect(sanitizeHAST(input)).toEqual(h('img', [], {alt: [1, true, 'three']}))
    })

    it('should supports arrays', () => {
      const input = u('element', {
        tagName: 'img',
        properties: {
          alt: [1, true, 'three', [4], {toString}],
        },
      })

      expect(sanitizeHAST(input)).toEqual(h('img', [], {alt: [1, true, 'three']}))
    })

    describe('`href`', () => {
      testAllURLs('a', 'href', {
        valid: {
          'anchor': '#heading',
          'relative': '/file.html',
          'search': 'example.com?foo:bar',
          'hash': 'example.com#foo:bar',
          'protocol-less': 'www.example.com',
          'mailto': 'mailto:foo@bar.com',
          'https': 'http://example.com',
          'http': 'http://example.com',
        },
        invalid: {
          'javascript': 'javascript:alert(1)',
          'Unicode LS/PS I': '\u2028javascript:alert(1)',
          'Unicode Whitespace (#1)': ' javascript:alert(1)',
          'Unicode Whitespace (#2)': ' javascript:alert(1)',
          'infinity loop': 'javascript:while(1){}',
          'data URL': 'data:,evilnastystuff',
        },
      })
    })

    describe('`cite`', () => {
      testAllURLs('blockquote', 'cite', {
        valid: {
          'anchor': '#heading',
          'relative': '/file.html',
          'search': 'example.com?foo:bar',
          'hash': 'example.com#foo:bar',
          'protocol-less': 'www.example.com',
          'https': 'http://example.com',
          'http': 'http://example.com',
        },
        invalid: {
          'mailto': 'mailto:foo@bar.com',
          'javascript': 'javascript:alert(1)',
          'Unicode LS/PS I': '\u2028javascript:alert(1)',
          'Unicode Whitespace (#1)': ' javascript:alert(1)',
          'Unicode Whitespace (#2)': ' javascript:alert(1)',
          'infinity loop': 'javascript:while(1){}',
          'data URL': 'data:,evilnastystuff',
        },
      })
    })

    describe('`src`', () => {
      testAllURLs('img', 'src', {
        valid: {
          'anchor': '#heading',
          'relative': '/file.html',
          'search': 'example.com?foo:bar',
          'hash': 'example.com#foo:bar',
          'protocol-less': 'www.example.com',
          'https': 'http://example.com',
          'http': 'http://example.com',
        },
        invalid: {
          'mailto': 'mailto:foo@bar.com',
          'javascript': 'javascript:alert(1)',
          'Unicode LS/PS I': '\u2028javascript:alert(1)',
          'Unicode Whitespace (#1)': ' javascript:alert(1)',
          'Unicode Whitespace (#2)': ' javascript:alert(1)',
          'infinity loop': 'javascript:while(1){}',
          'data URL': 'data:,evilnastystuff',
        },
      })
    })

    describe('`longDesc`', () => {
      testAllURLs('img', 'longDesc', {
        valid: {
          'anchor': '#heading',
          'relative': '/file.html',
          'search': 'example.com?foo:bar',
          'hash': 'example.com#foo:bar',
          'protocol-less': 'www.example.com',
          'https': 'http://example.com',
          'http': 'http://example.com',
        },
        invalid: {
          'mailto': 'mailto:foo@bar.com',
          'javascript': 'javascript:alert(1)',
          'Unicode LS/PS I': '\u2028javascript:alert(1)',
          'Unicode Whitespace (#1)': ' javascript:alert(1)',
          'Unicode Whitespace (#2)': ' javascript:alert(1)',
          'infinity loop': 'javascript:while(1){}',
          'data URL': 'data:,evilnastystuff',
        },
      })
    })

    describe('`li`', () => {
      it('should not allow `li` outside list', () => {
        const input = h('li', ['alert(1)'])

        expect(sanitizeHAST(input)).toEqual(u('text', 'alert(1)'))
      })

      it('should allow `li` in `ol`', () => {
        const input = h('ol', [h('li', ['alert(1)'])])

        expect(sanitizeHAST(input)).toEqual(h('ol', [h('li', ['alert(1)'])]))
      })

      it('should allow `li` in `ul`', () => {
        const input = h('ul', [h('li', ['alert(1)'])])

        expect(sanitizeHAST(input)).toEqual(h('ul', [h('li', ['alert(1)'])]))
      })

      it('should allow `li` descendant `ol`', () => {
        const input = h('ol', [h('div', [h('li', ['alert(1)'])])])

        expect(sanitizeHAST(input)).toEqual(h('ol', [h('div', [h('li', ['alert(1)'])])]))
      })

      it('should allow `li` descendant `ul`', () => {
        const input = h('ul', [h('div', [h('li', ['alert(1)'])])])

        expect(sanitizeHAST(input)).toEqual(h('ul', [h('div', [h('li', ['alert(1)'])])]))
      })
    })

    const tableTags = ['tr', 'td', 'th', 'tbody', 'thead', 'tfoot']
    tableTags.forEach(function (name: string) {
      describe('`' + name + '`', () => {
        it('should not allow `' + name + '` outside `table`', () => {
          const input = h(name, ['alert(1)'])

          expect(sanitizeHAST(input)).toEqual(u('text', 'alert(1)'))
        })

        it('should allow `' + name + '` in `table`', () => {
          const input = h('table', [h(name, ['alert(1)'])])

          expect(sanitizeHAST(input)).toEqual(h('table', [h(name, ['alert(1)'])]))
        })

        it('should allow `' + name + '` descendant `table`', () => {
          const input = h('table', [h('div', [h(name, ['alert(1)'])])])

          expect(sanitizeHAST(input)).toEqual(h('table', [h('div', [h(name, ['alert(1)'])])]))
        })
      })
    })
  })

  describe('`root`', () => {
    it('should allow known properties', () => {
      const input = {
        type: 'root',
        tagName: 'div',
        value: 'alert(1)',
        unknown: 'alert(1)',
        properties: {href: 'javascript:alert(1)'},
        children: [h('script', ['alert(1)'])],
        data: {href: 'alert(1)'},
        position: {
          start: {line: 1, column: 1},
          end: {line: 2, column: 1},
        },
      }

      expect(sanitizeHAST(input)).toEqual({
        type: 'root',
        children: [],
        data: {href: 'alert(1)'},
        position: {
          start: {line: 1, column: 1},
          end: {line: 2, column: 1},
        },
      })
    })
  })
})

/* Check */
function toString () {
  return 'alert(1);'
}

/* Test `valid` and `invalid` `url`s in `prop` on `tagName`. */
function testAllURLs (tagName: string, prop: string, all: {
  valid: {[key: string]: string}
  invalid: {[key: string]: string}
}) {
  testURLs(tagName, prop, all.valid, true)
  testURLs(tagName, prop, all.invalid, false)
}

/* Test `valid` `url`s in `prop` on `tagName`. */
function testURLs (tagName: string, prop: string, urls: {[key: string]: string}, valid: boolean) {
  Object.keys(urls).forEach(function (name) {
    it('should ' + (valid ? 'allow' : 'clean') + ' ' + name, () => {
      const props: Properties = {}
      props[prop] = urls[name]
      const input = h(tagName, [], props)

      expect(sanitizeHAST(input)).toEqual(h(tagName, [], valid ? props : {}))
    })
  })
}
