import h from 'typed-hastscript'
import { toHTML } from '../lib'

['rp', 'rt'].forEach(function (tagName, index, values) {
  describe('`' + tagName + '` (closing)', () => {
    const other = values[index ? 0 : 1]

    it('should omit tag without parent', () => {
      const input = h(tagName)
      const opts = {omitOptionalTags: true}

      expect(toHTML(input, opts)).toBe('<' + tagName + '>')
    })

    it('should omit tag without following', () => {
      const input = h('ruby', [h(tagName)])
      const opts = {omitOptionalTags: true}

      expect(toHTML(input, opts)).toBe('<ruby><' + tagName + '></ruby>')
    })

    it('should omit tag without following', () => {
      const input = h('ruby', [h(tagName)])
      const opts = {omitOptionalTags: true}

      expect(toHTML(input, opts)).toBe('<ruby><' + tagName + '></ruby>')
    })

    it('should omit tag followed by `' + tagName + '`', () => {
      const input = h('ruby', [h(tagName), h(tagName)])
      const opts = {omitOptionalTags: true}

      expect(toHTML(input, opts)).toBe('<ruby><' + tagName + '><' + tagName + '></ruby>')
    })

    it('should omit tag followed by `' + other + '`', () => {
      const input = h('ruby', [h(tagName), h(other)])
      const opts = {omitOptionalTags: true}

      expect(toHTML(input, opts)).toBe('<ruby><' + tagName + '><' + other + '></ruby>')
    })

    it('should not omit tag followed by others', () => {
      const input = h('ruby', [h(tagName), h('p')])
      const opts = {omitOptionalTags: true}

      expect(toHTML(input, opts)).toBe('<ruby><' + tagName + '></' + tagName + '><p></ruby>')
    })
  })
})
