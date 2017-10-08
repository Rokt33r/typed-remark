import { stringifyEntities, escape } from '../lib'

describe('stringifyEntities', () => {
  it('represents Other non-ASCII symbols through hexadecimal escapes', () => {
    const result = stringifyEntities('foo\xA9bar\uD834\uDF06baz\u2603qux')

    expect(result).toBe('foo&#xA9;bar&#x1D306;baz&#x2603;qux')
  })

  it('uses named entities if `useNamedReferences` and possible', () => {
    const result = stringifyEntities('foo\xA9bar\uD834\uDF06baz\u2603qux', {
      useNamedReferences: true,
    })

    expect(result).toBe('foo&copy;bar&#x1D306;baz&#x2603;qux')
  })

  it('uses shortest entities if `useShortestReferences`', () => {
    const result = stringifyEntities('alpha © bravo ≠ charlie 𝌆 delta', {
      useShortestReferences: true,
    })

    expect(result).toBe('alpha &#xA9; bravo &ne; charlie &#x1D306; delta')
  })

  it('encodes `escape`’s characters without using named references', () => {
    const result = stringifyEntities('\'"<>&')

    expect(result).toBe('&#x27;&#x22;&#x3C;&#x3E;&#x26;')
  })

  it('encodes with a `subset`', () => {
    const result = stringifyEntities('\'"<>&', {
      subset: ['&'],
    })

    expect(result).toBe('\'"<>&#x26;')
  })

  it('encodes with a `subset` and `useNamedReferences`', () => {
    const result = stringifyEntities('\'"<>&', {
      subset: ['&'],
      useNamedReferences: true,
    })

    expect(result).toBe('\'"<>&amp;')
  })

  it('omits semi-colons', () => {
    const result = stringifyEntities('&such', {
      omitOptionalSemicolons: true,
    })

    expect(result).toBe('&#x26such')
  })

  it('omits semi-colons (named)', () => {
    const result = stringifyEntities('&such', {
      useNamedReferences: true,
      omitOptionalSemicolons: true,
    })

    expect(result).toBe('&ampsuch')
  })

  it('doesn\'t omit semi-colons, when numeric, and the next is hexadecimal ', () => {
    const result = stringifyEntities('&bada55', {
      omitOptionalSemicolons: true,
    })

    expect(result).toBe('&#x26;bada55')
  })

  it('omits semi-colons (named in attribute)', () => {
    const result = stringifyEntities('& such', {
      attribute: true,
      useNamedReferences: true,
      omitOptionalSemicolons: true,
    })

    expect(result).toBe('&amp such')
  })

  it('doesn\'t omit semi-colons, when named in attribute, and the next character is alphanumeric', () => {
    const result = stringifyEntities('&such', {
      attribute: true,
      useNamedReferences: true,
      omitOptionalSemicolons: true,
    })

    expect(result).toBe('&amp;such')
  })

  it('doesn\'t omit semi-colons, when named in attribute, and the next character is alphanumeric', () => {
    const result = stringifyEntities('&such', {
      attribute: true,
      useNamedReferences: true,
      omitOptionalSemicolons: true,
    })

    expect(result).toBe('&amp;such')
  })

  it('doesn\'t omit semi-colons, when named in attribute, and the next character is `=`', () => {
    const result = stringifyEntities('&=such', {
      attribute: true,
      useNamedReferences: true,
      omitOptionalSemicolons: true,
    })

    expect(result).toBe('&amp;=such')
  })

  it('does\'t omit semi-colons when conflicting', () => {
    const result = stringifyEntities('¬it;', {
      useNamedReferences: true,
      omitOptionalSemicolons: true,
    })

    expect(result).toBe('&not;it;')
  })

  it('omits semi-colons when named, not in an attribute, and the next character is alphanumeric', () => {
    const result = stringifyEntities('&amp', {
      useNamedReferences: true,
      omitOptionalSemicolons: true,
    })

    expect(result).toBe('&ampamp')
  })

  it('omits semi-colons when named, not in an attribute, and the next character is `=`', () => {
    const result = stringifyEntities('&=', {
      useNamedReferences: true,
      omitOptionalSemicolons: true,
    })

    expect(result).toBe('&amp=')
  })

  it('omits semi-colons when named, not in an attribute, and the next character is `=`', () => {
    const result = stringifyEntities('&=', {
      useNamedReferences: true,
      omitOptionalSemicolons: true,
    })

    expect(result).toBe('&amp=')
  })

  it('encodes lone high surrogate (lowest)', () => {
    const result = stringifyEntities('foo\uD800bar')

    expect(result).toBe('foo&#xD800;bar')
  })

  it('encodes lone high surrogate (highest)', () => {
    const result = stringifyEntities('foo\uDBFFbar')

    expect(result).toBe('foo&#xDBFF;bar')
  })

  it('encodes lone high surrogate at the start of a string (lowest)', () => {
    const result = stringifyEntities('\uD800bar')

    expect(result).toBe('&#xD800;bar')
  })

  it('encodes lone high surrogate at the start of a string (highest)', () => {
    const result = stringifyEntities('\uDBFFbar')

    expect(result).toBe('&#xDBFF;bar')
  })

  it('encodes lone high surrogate at the end of a string (lowest)', () => {
    const result = stringifyEntities('foo\uD800')

    expect(result).toBe('foo&#xD800;')
  })

  it('encodes lone high surrogate at the end of a string (highest)', () => {
    const result = stringifyEntities('foo\uDBFF')

    expect(result).toBe('foo&#xDBFF;')
  })

  it('encodes lone low surrogate (lowest)', () => {
    const result = stringifyEntities('foo\uDC00bar')

    expect(result).toBe('foo&#xDC00;bar')
  })

  it('encodes lone low surrogate (highest)', () => {
    const result = stringifyEntities('foo\uDFFFbar')

    expect(result).toBe('foo&#xDFFF;bar')
  })

  it('encodes lone low surrogate at the start of a string (lowest)', () => {
    const result = stringifyEntities('\uDC00bar')

    expect(result).toBe('&#xDC00;bar')
  })

  it('encodes lone low surrogate at the start of a string (highest)', () => {
    const result = stringifyEntities('\uDFFFbar')

    expect(result).toBe('&#xDFFF;bar')
  })

  it('encodes lone low surrogate at the end of a string (lowest)', () => {
    const result = stringifyEntities('foo\uDC00')

    expect(result).toBe('foo&#xDC00;')
  })

  it('encodes lone low surrogate at the end of a string (highest)', () => {
    const result = stringifyEntities('foo\uDFFF')

    expect(result).toBe('foo&#xDFFF;')
  })

  it('encodes disallowed code points in input, except those whose character references would refer to another code point', () => {

    const result = stringifyEntities('\0\x01\x02\x03\x04\x05\x06\x07\b\x0B\x0E\x0F\x10\x11\x12\x13\x14\x15\x16\x17\x18\x19\x1A\x1B\x1C\x1D\x1E\x1F\x7F\x80\x81\x82\x83\x84\x85\x86\x87\x88\x89\x8A\x8B\x8C\x8D\x8E\x8F\x90\x91\x92\x93\x94\x95\x96\x97\x98\x99\x9A\x9B\x9C\x9D\x9E\x9F\uFDD0\uFDD1\uFDD2\uFDD3\uFDD4\uFDD5\uFDD6\uFDD7\uFDD8\uFDD9\uFDDA\uFDDB\uFDDC\uFDDD\uFDDE\uFDDF\uFDE0\uFDE1\uFDE2\uFDE3\uFDE4\uFDE5\uFDE6\uFDE7\uFDE8\uFDE9\uFDEA\uFDEB\uFDEC\uFDED\uFDEE\uFDEF\uFFFE\uFFFF\uD83F\uDFFE\uD83F\uDFFF\uD87F\uDFFE\uD87F\uDFFF\uD8BF\uDFFE\uD8BF\uDFFF\uD8FF\uDFFE\uD8FF\uDFFF\uD93F\uDFFE\uD93F\uDFFF\uD97F\uDFFE\uD97F\uDFFF\uD9BF\uDFFE\uD9BF\uDFFF\uD9FF\uDFFE\uD9FF\uDFFF\uDA3F\uDFFE\uDA3F\uDFFF\uDA7F\uDFFE\uDA7F\uDFFF\uDABF\uDFFE\uDABF\uDFFF\uDAFF\uDFFE\uDAFF\uDFFF\uDB3F\uDFFE\uDB3F\uDFFF\uDB7F\uDFFE\uDB7F\uDFFF\uDBBF\uDFFE\uDBBF\uDFFF\uDBFF\uDFFE\uDBFF\uDFFF')

    expect(result).toBe('\0&#x1;&#x2;&#x3;&#x4;&#x5;&#x6;&#x7;&#x8;&#xB;&#xE;&#xF;&#x10;&#x11;&#x12;&#x13;&#x14;&#x15;&#x16;&#x17;&#x18;&#x19;&#x1A;&#x1B;&#x1C;&#x1D;&#x1E;&#x1F;&#x7F;\x80&#x81;\x82\x83\x84\x85\x86\x87\x88\x89\x8A\x8B\x8C&#x8D;\x8E&#x8F;&#x90;\x91\x92\x93\x94\x95\x96\x97\x98\x99\x9A\x9B\x9C&#x9D;\x9E\x9F&#xFDD0;&#xFDD1;&#xFDD2;&#xFDD3;&#xFDD4;&#xFDD5;&#xFDD6;&#xFDD7;&#xFDD8;&#xFDD9;&#xFDDA;&#xFDDB;&#xFDDC;&#xFDDD;&#xFDDE;&#xFDDF;&#xFDE0;&#xFDE1;&#xFDE2;&#xFDE3;&#xFDE4;&#xFDE5;&#xFDE6;&#xFDE7;&#xFDE8;&#xFDE9;&#xFDEA;&#xFDEB;&#xFDEC;&#xFDED;&#xFDEE;&#xFDEF;&#xFFFE;&#xFFFF;&#x1FFFE;&#x1FFFF;&#x2FFFE;&#x2FFFF;&#x3FFFE;&#x3FFFF;&#x4FFFE;&#x4FFFF;&#x5FFFE;&#x5FFFF;&#x6FFFE;&#x6FFFF;&#x7FFFE;&#x7FFFF;&#x8FFFE;&#x8FFFF;&#x9FFFE;&#x9FFFF;&#xAFFFE;&#xAFFFF;&#xBFFFE;&#xBFFFF;&#xCFFFE;&#xCFFFF;&#xDFFFE;&#xDFFFF;&#xEFFFE;&#xEFFFF;&#xFFFFE;&#xFFFFF;&#x10FFFE;&#x10FFFF;')
  })

  it('does not encode invalid code points whose character references would refer to another code point', () => {
    const result = stringifyEntities('\0\x89')

    expect(result).toBe('\0\x89')
  })
})

describe('escape', () => {
  it('simply encodes entities', () => {
    const result = escape(
      '<img src=\'x\' onerror="prompt(1)">' +
      '<script>alert(1)</script>' +
      '<img src="x` `' +
      '<script>alert(1)</script>"` `>',
    )

    expect(result).toBe(
      '&lt;img src=&#x27;x&#x27; onerror=&quot;prompt(1)&quot;&gt;' +
      '&lt;script&gt;alert(1)&lt;/script&gt;' +
      '&lt;img src=&quot;x&#x60; &#x60;' +
      '&lt;script&gt;alert(1)&lt;/script&gt;&quot;&#x60; &#x60;&gt;',
    )
  })
})
