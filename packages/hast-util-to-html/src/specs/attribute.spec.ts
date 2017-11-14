import h from 'typed-hastscript'
import u from 'typed-unist-builder'
import { toHTML } from '../lib'

describe('`element` attributes', () => {
  it('should stringify special camel-cased properties', () => {
    const input = h('i', ['bravo'], {className: ['alpha']})

    expect(toHTML(input)).toBe('<i class="alpha">bravo</i>')
  })

  it('should stringify camel-cased properties', () => {
    const input = h('i', ['bravo'], {dataFoo: 'alpha'})

    expect(toHTML(input)).toBe('<i data-foo="alpha">bravo</i>')
  })

  it('should stringify numeric `data-` properties', () => {
    const input = h('i', ['bravo'], {data123: 'alpha'})

    expect(toHTML(input)).toBe('<i data-123="alpha">bravo</i>')
  })

  it('should show empty string attributes', () => {
    const input = h('img', [], {alt: ''})

    expect(toHTML(input)).toBe('<img alt="">')
  })

  it('should collapse empty string attributes in `collapseEmptyAttributes` mode', () => {
    const input = h('img', [], {alt: ''})
    const opts = {collapseEmptyAttributes: true}

    expect(toHTML(input, opts)).toBe('<img alt>')
  })

  it('should stringify multiple properties', () => {
    const input = h('i', ['bravo'], {className: ['a', 'b'], title: 'c d'})

    expect(toHTML(input)).toBe('<i class="a b" title="c d">bravo</i>')
  })

  it('should stringify multiple properties tightly in `tightAttributes` mode', () => {
    const input = h('i', ['bravo'], {className: ['a', 'b'], title: 'c d'})
    const opts = {tightAttributes: true}

    expect(toHTML(input, opts)).toBe('<i class="a b"title="c d">bravo</i>')
  })

  it('should stringify space-separated attributes', () => {
    const input = h('i', ['bravo'], {className: ['alpha', 'charlie']})

    expect(toHTML(input)).toBe('<i class="alpha charlie">bravo</i>')
  })

  it('should stringify comma-separated attributes', () => {
    const input = h('input', [], {type: 'file', accept: ['jpg', 'jpeg']})

    expect(toHTML(input)).toBe('<input type="file" accept="jpg, jpeg">')
  })

  it('should stringify comma-separated attributes tighly in `tightCommaSeparatedLists` mode', () => {
    const input = h('input', [], {type: 'file', accept: ['jpg', 'jpeg']})
    const opts = {
      tightCommaSeparatedLists: true,
    }

    expect(toHTML(input, opts)).toBe('<input type="file" accept="jpg,jpeg">')
  })

  it('should stringify unknown lists as space-separated', () => {
    const input = h('span', [], {dataUnknown: ['alpha', 'bravo']})

    expect(toHTML(input)).toBe('<span data-unknown="alpha bravo"></span>')
  })

  it('should stringify known boolean attributes set to `true`', () => {
    const input = h('i', ['bravo'], {hidden: true})

    expect(toHTML(input)).toBe('<i hidden>bravo</i>')
  })

  it('should ignore known boolean attributes set to `false`', () => {
    const input = h('i', ['bravo'], {hidden: false})

    expect(toHTML(input)).toBe('<i>bravo</i>')
  })

  it('should stringify truthy known boolean attributes', () => {
    const input = h('i', ['bravo'], {hidden: 1})

    expect(toHTML(input)).toBe('<i hidden>bravo</i>')
  })

  it('should ignore falsey known boolean attributes', () => {
    const input = h('i', ['bravo'], {hidden: 0})

    expect(toHTML(input)).toBe('<i>bravo</i>')
  })

  it('should stringify unknown attributes set to `false`', () => {
    const input = h('i', ['bravo'], {dataUnknown: false})

    expect(toHTML(input)).toBe('<i data-unknown="false">bravo</i>')
  })

  it('should stringify unknown attributes set to `true`', () => {
    const input = h('i', ['bravo'], {dataUnknown: true})

    expect(toHTML(input)).toBe('<i data-unknown="true">bravo</i>')
  })

  it('should stringify positive known numeric attributes', () => {
    const input = h('i', ['bravo'], {cols: 1})

    expect(toHTML(input)).toBe('<i cols="1">bravo</i>')
  })

  it('should stringify negative known numeric attributes', () => {
    const input = h('i', ['bravo'], {cols: -1})

    expect(toHTML(input)).toBe('<i cols="-1">bravo</i>')
  })

  it('should stringify known numeric attributes set to `0`', () => {
    const input = h('i', ['bravo'], {cols: 0})

    expect(toHTML(input)).toBe('<i cols="0">bravo</i>')
  })

  it('should ignore known numeric attributes set to `NaN`', () => {
    const input = h('i', ['bravo'], {cols: NaN})

    expect(toHTML(input)).toBe('<i>bravo</i>')
  })

  it('should stringify known numeric attributes set to non-numeric', () => {
    const input = h('i', ['bravo'], {cols: {toString: () => {
      return 'yup'
    }}})

    expect(toHTML(input)).toBe('<i cols="yup">bravo</i>')
  })

  it('should stringify other attributes', () => {
    const input = h('i', ['bravo'], {id: 'alpha'})

    expect(toHTML(input)).toBe('<i id="alpha">bravo</i>')
  })

  it('should stringify other falsey attributes', () => {
    const input = h('i', ['bravo'], {id: ''})

    expect(toHTML(input)).toBe('<i id="">bravo</i>')
  })

  it('should stringify other non-string attributes', () => {
    const input = h('i', ['bravo'], {id: true})

    expect(toHTML(input)).toBe('<i id="true">bravo</i>')
  })

  it('should quote attribute values with single quotes is `quote: \'\\\'\'`', () => {
    const input = h('img', [], {alt: ''})
    const opts = {
      quote: '\'',
    }

    expect(toHTML(input, opts)).toBe('<img alt=\'\'>')
  })

  it('should throw on invalid quotes', () => {
    const input = h('img', [], {alt: ''})
    const opts = {
      quote: '`',
    }

    expect(() => {
      toHTML(input, opts)
    }).toThrow(/Invalid quote ```, expected `'` or `"`/)
  })

  it('should quote attribute values with single quotes is `quote: \'\\\'\'`', () => {
    const input = h('img', [], {alt: ''})
    const opts = {
      quote: '\'',
    }

    expect(toHTML(input, opts)).toBe('<img alt=\'\'>')
  })

  it('should quote attribute values with single quotes is `quote: \'"\'`', () => {
    const input = h('img', [], {alt: ''})
    const opts = {
      quote: '"',
    }

    expect(toHTML(input, opts)).toBe('<img alt="">')
  })

  it('should quote smartly if the other quote is less prominent (#1)', () => {
    const input = h('img', [], {alt: '"some \' stuff"'})
    const opts = {
      quote: '"',
      quoteSmart: true,
    }

    expect(toHTML(input, opts)).toBe('<img alt=\'&#x22;some &#x27; stuff&#x22;\'>')
  })

  it('should quote smartly if the other quote is less prominent (#2)', () => {
    const input = h('img', [], {alt: '\'some " stuff\''})
    const opts = {quote: '\'', quoteSmart: true}

    expect(toHTML(input, opts)).toBe('<img alt="&#x27;some &#x22; stuff&#x27;">')
  })

  it('should omit quotes in `preferUnquoted`', () => {
    const input = h('img', [], {alt: 'alpha'})
    const opts = {preferUnquoted: true}

    expect(toHTML(input, opts)).toBe('<img alt=alpha>')
  })

  it('should keep quotes in `preferUnquoted` and impossible', () => {
    const input = h('img', [], {alt: 'alpha bravo'})
    const opts =  {preferUnquoted: true}

    expect(toHTML(input, opts)).toBe('<img alt="alpha bravo">')
  })

  it('should not add `=` when omitting quotes on empty values', () => {
    const input = h('img', [], {alt: ''})
    const opts = {preferUnquoted: true}

    expect(toHTML(input, opts)).toBe( '<img alt>')
  })

  it('should encode entities in attribute names', () => {
    const input = h('i', [], {'3<5\0': 'alpha'})

    expect(toHTML(input)).toBe('<i 3&#x3C;5&#x0;="alpha"></i>')
  })

  it('should encode entities in attribute values', () => {
    const input = h('i', [], {title: '3<5\0'})

    expect(toHTML(input)).toBe('<i title="3<5&#x0;"></i>')
  })

  it('should not encode characters in attribute names which cause parse errors, but work, in `allowParseErrors` mode', () => {
    const input = h('i', [], {'3=5\0': 'alpha'})
    const opts = {allowParseErrors: true}

    expect(toHTML(input, opts)).toBe('<i 3&#x3D;5\0="alpha"></i>')
  })

  it('should not encode characters in attribute values which cause parse errors, but work, in `allowParseErrors` mode', () => {
    const input = h('i', [], {title: '3"5\0'})
    const opts = {allowParseErrors: true}

    expect(toHTML(input, opts)).toBe('<i title="3&#x22;5\0"></i>')
  })

  it('should not encode characters which cause XSS issues in older browsers, in `allowParseErrors` mode', () => {
    const input = h('i', [], {title: '3\'5'})
    const opts = {allowDangerousCharacters: true}

    expect(toHTML(input, opts)).toBe('<i title="3\'5"></i>')
  })

  it('should ignore attributes set to `null`', () => {
    const input = u('element', {
      tagName: 'i',
      properties: {id: null},
    }, [u('text', 'bravo')])

    expect(toHTML(input)).toBe('<i>bravo</i>')
  })

  it('should ignore attributes set to `undefined`', () => {
    const input = u('element', {
      tagName: 'i',
      properties: {id: undefined},
    }, [u('text', 'bravo')])

    expect(toHTML(input)).toBe('<i>bravo</i>')
  })
})
