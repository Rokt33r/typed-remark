import { parseEntities, Options } from '../lib'
import { Point, Position } from 'typed-unist'

describe('parseEntities', () => {
  it('decodes entities(Regression Text, checking returned values only)', () => {
    const qnas: [string, string][] = [
      ['I’m &notit; though', 'I’m ¬it; though'],
      ['I’m &notin; though', 'I’m ∉ though'],
    ]

    qnas.forEach(([question, answer]) => {
      const result = parseEntities(question)

      expect(result).toBe(answer)
    })
  })

  it('should work on a named reference', () => {
    const result = assert('foo &amp; bar')

    expect(result).toEqual({
      result: 'foo & bar',
      reference: [
        ['&', location(1, 5, 4, 1, 10, 9), '&amp;'],
      ],
      text: [
        ['foo ', location(1, 1, 0, 1, 5, 4)],
        [' bar', location(1, 10, 9, 1, 14, 13)],
      ],
      warning: [],
    })
  })

  it('should work on a decimal reference', () => {
    const result = assert('foo &#123; bar')

    expect(result).toEqual({
      result: 'foo { bar',
      reference: [
        ['{', location(1, 5, 4, 1, 11, 10), '&#123;']
      ],
      text: [
        ['foo ', location(1, 1, 0, 1, 5, 4)],
        [' bar', location(1, 11, 10, 1, 15, 14)]
      ],
      warning: []
    })
  })

  it('should work on a hexadecimal reference', () => {
    const result = assert('foo &#x123; bar')

    expect(result).toEqual({
      result: 'foo ģ bar',
      reference: [
        ['ģ', location(1, 5, 4, 1, 12, 11), '&#x123;']
      ],
      text: [
        ['foo ', location(1, 1, 0, 1, 5, 4)],
        [' bar', location(1, 12, 11, 1, 16, 15)]
      ],
      warning: []
    })
  })

  it('should work when the entity is initial', () => {
    const result = assert('&amp; bar')

    expect(result).toEqual({
      result: '& bar',
      reference: [
        ['&', location(1, 1, 0, 1, 6, 5), '&amp;']
      ],
      text: [
        [' bar', location(1, 6, 5, 1, 10, 9)]
      ],
      warning: []
    })
  })


  it('should work when the entity is final', () => {
    const result = assert('foo &amp;')

    expect(result).toEqual({
      result: 'foo &',
      reference: [
        ['&', location(1, 5, 4, 1, 10, 9), '&amp;']
      ],
      text: [
        ['foo ', location(1, 1, 0, 1, 5, 4)]
      ],
      warning: []
    })
  })

  it('should work for adjacent entities', () => {
    const result = assert('&amp;&#123;&#x123;')

    expect(result).toEqual({
      result: '&{ģ',
      reference: [
        ['&', location(1, 1, 0, 1, 6, 5), '&amp;'],
        ['{', location(1, 6, 5, 1, 12, 11), '&#123;'],
        ['ģ', location(1, 12, 11, 1, 19, 18), '&#x123;']
      ],
      text: [],
      warning: []
    })
  })

  it('should work when named but warn without terminal semicolon', () => {
    const result = assert('foo &amp bar')
    
    expect(result).toEqual({
      result: 'foo & bar',
      reference: [
        ['&', location(1, 5, 4, 1, 9, 8), '&amp']
      ],
      text: [
        ['foo ', location(1, 1, 0, 1, 5, 4)],
        [' bar', location(1, 9, 8, 1, 13, 12)]
      ],
      warning: [[
        'Named character references must be terminated by a semicolon',
        point(1, 9, 8),
        1
      ]]
    })
  })

  it('should work if `nonTerminated` is given', () => {
    const result = assert('foo &amp bar', {nonTerminated: false})

    expect(result).toEqual({
      result: 'foo &amp bar',
      reference: [],
      text: [
        ['foo &amp bar', location(1, 1, 0, 1, 13, 12)]
      ],
      warning: []
    })
  })

  it('should fail when numerical and without terminal semicolon', () => {
    const result = assert('foo &#123 bar')

    expect(result).toEqual({
      result: 'foo { bar',
      reference: [
        ['{', location(1, 5, 4, 1, 10, 9), '&#123']
      ],
      text: [
        ['foo ', location(1, 1, 0, 1, 5, 4)],
        [' bar', location(1, 10, 9, 1, 14, 13)]
      ],
      warning: [[
        'Numeric character references must be terminated by a semicolon',
        point(1, 10, 9),
        2
      ]]
    })
  })

  it('should work on an ampersand followed by a tab', () => {
    const result = assert('Foo &\tbar')

    expect(result).toEqual({
      result: 'Foo &\tbar',
      reference: [],
      text: [
          ['Foo &\tbar', location(1, 1, 0, 1, 10, 9)]
      ],
      warning: []
    })
  })

  it('should work on an ampersand followed by a newline', () => {
    const result = assert('Foo &\nbar')

    expect(result).toEqual({
      result: 'Foo &\nbar',
      reference: [],
      text: [
        ['Foo &\nbar', location(1, 1, 0, 2, 4, 9)]
      ],
      warning: []
    })
  })

  it('should work on an ampersand followed by a form-feed', () => {
    const result = assert('Foo &\fbar')

    expect(result).toEqual({
      result: 'Foo &\fbar',
      reference: [],
      text: [
        ['Foo &\fbar', location(1, 1, 0, 1, 10, 9)]
      ],
      warning: []
    })
  })

  it('should work on an ampersand followed by a space', () => {
    const result = assert('Foo & bar')

    expect(result).toEqual({
      result: 'Foo & bar',
      reference: [],
      text: [
        ['Foo & bar', location(1, 1, 0, 1, 10, 9)]
      ],
      warning: []
    })
  })

  it('should work on an ampersand followed by a `<`', () => {
    const result = assert('Foo &<bar')

    expect(result).toEqual({
      result: 'Foo &<bar',
      reference: [],
      text: [
        ['Foo &<bar', location(1, 1, 0, 1, 10, 9)]
      ],
      warning: []
    })
  })

  it('should work on an ampersand followed by another ampersand', () => {
    const result = assert('Foo &&bar')

    expect(result).toEqual({
      result: 'Foo &&bar',
      reference: [],
      text: [
        ['Foo &&bar', location(1, 1, 0, 1, 10, 9)]
      ],
      /* The warning here is for the following ampersand,
       * followed by `bar`, which is not an entity. */
      warning: [[
        'Named character references cannot be empty',
        point(1, 7, 6),
        3
      ]]
    })
  })

  it('should work on an ampersand followed by EOF', () => {
    const result = assert('Foo &')

    expect(result).toEqual({
      result: 'Foo &',
      reference: [],
      text: [
        ['Foo &', location(1, 1, 0, 1, 6, 5)]
      ],
      warning: []
    })
  })

  it('should work on an ampersand followed by an additional character', () => {
    const result = assert('Foo &"', {additional: '"'})

    expect(result).toEqual({
      result: 'Foo &"',
      reference: [],
      text: [
        ['Foo &"', location(1, 1, 0, 1, 7, 6)]
      ],
      warning: []
    })
  })

  it('should work on an attribute #1', () => {
    const result = assert('foo&ampbar', {attribute: true})

    expect(result).toEqual({
      result: 'foo&ampbar',
      reference: [],
      text: [
        ['foo&ampbar', location(1, 1, 0, 1, 11, 10)]
      ],
      warning: []
    })
  })

  it('should work on an attribute #2', () => {
    const result = assert('foo&amp;bar', {attribute: true})

    expect(result).toEqual({
      result: 'foo&bar',
      reference: [
        ['&', location(1, 4, 3, 1, 9, 8), '&amp;']
      ],
      text: [
        ['foo', location(1, 1, 0, 1, 4, 3)],
        ['bar', location(1, 9, 8, 1, 12, 11)]
      ],
      warning: []
    })
  })

  it('should work on an attribute #3', () => {
    const result = assert('foo&amp;', {attribute: true})

    expect(result).toEqual({
      result: 'foo&',
      reference: [
        ['&', location(1, 4, 3, 1, 9, 8), '&amp;']
      ],
      text: [
        ['foo', location(1, 1, 0, 1, 4, 3)]
      ],
      warning: []
    })
  })

  it('should work on an attribute #4', () => {
    const result = assert('foo&amp=', {attribute: true})

    expect(result).toEqual({
      result: 'foo&amp=',
      reference: [],
      text: [
        ['foo&amp=', location(1, 1, 0, 1, 9, 8)]
      ],
      warning: [[
        'Named character references must be terminated by a semicolon',
        point(1, 8, 7),
        1
      ]]
    })
  })

  it('should work on an attribute #5', () => {
    const result = assert('foo&amp', {attribute: true})

    expect(result).toEqual({
      result: 'foo&',
      reference: [
        ['&', location(1, 4, 3, 1, 8, 7), '&amp']
      ],
      text: [
        ['foo', location(1, 1, 0, 1, 4, 3)]
      ],
      warning: [[
        'Named character references must be terminated by a semicolon',
        point(1, 8, 7),
        1
      ]]
    })
  })

  it('should work on an attribute #6', () => {
    const result = assert('foo&amplol', {attribute: true})

    expect(result).toEqual({
      result: 'foo&amplol',
      reference: [],
      text: [
        ['foo&amplol', location(1, 1, 0, 1, 11, 10)]
      ],
      warning: []
    })
  })

  it('should warn when numeric and empty', () => {
    const result = assert('Foo &#')

    expect(result).toEqual({
      result: 'Foo &#',
      reference: [],
      text: [
        ['Foo &#', location(1, 1, 0, 1, 7, 6)]
      ],
      warning: [[
        'Numeric character references cannot be empty',
        point(1, 7, 6),
        4
      ]]
    })
  })

  it('should not warn when empty and not numeric', () => {
    const result = assert('Foo &=')

    expect(result).toEqual({
      result: 'Foo &=',
      reference: [],
      text: [
        ['Foo &=', location(1, 1, 0, 1, 7, 6)]
      ],
      warning: []
    })
  })

  it('should warn when unknown and terminated', () => {
    const result = assert('Foo &bar; baz')

    expect(result).toEqual({
      result: 'Foo &bar; baz',
      reference: [],
      text: [
        ['Foo &bar; baz', location(1, 1, 0, 1, 14, 13)]
      ],
      warning: [[
        'Named character references must be known',
        point(1, 6, 5),
        5
      ]]
    })
  })

  it('should warn when prohibited', () => {
    const result = assert('Foo &#xD800; baz')

    expect(result).toEqual({
      result: 'Foo \uFFFD baz',
      reference: [
        ['\uFFFD', location(1, 5, 4, 1, 13, 12), '&#xD800;']
      ],
      text: [
        ['Foo ', location(1, 1, 0, 1, 5, 4)],
        [' baz', location(1, 13, 12, 1, 17, 16)]
      ],
      warning: [[
        'Numeric character references cannot be outside the permissible ' +
        'Unicode range',
        point(1, 13, 12),
        7
      ]]
    })
  })

  it('should warn when invalid', () => {
    const result = assert('Foo &#128; baz')

    expect(result).toEqual({
      result: 'Foo € baz',
      reference: [
        ['€', location(1, 5, 4, 1, 11, 10), '&#128;']
      ],
      text: [
        ['Foo ', location(1, 1, 0, 1, 5, 4)],
        [' baz', location(1, 11, 10, 1, 15, 14)]
      ],
      warning: [[
        'Numeric character references cannot be disallowed',
        point(1, 11, 10),
        6
      ]]
    })
  })

  it('should warn when disallowed', () => {
    const result = assert('Foo &#xfdee; baz')

    expect(result).toEqual({
      result: 'Foo \uFDEE baz',
      reference: [
        ['\uFDEE', location(1, 5, 4, 1, 13, 12), '&#xfdee;']
      ],
      text: [
        ['Foo ', location(1, 1, 0, 1, 5, 4)],
        [' baz', location(1, 13, 12, 1, 17, 16)]
      ],
      warning: [[
        'Numeric character references cannot be disallowed',
        point(1, 13, 12),
        6
      ]]
    })
  })

  it('should work when resulting in multiple characters', () => {
    const result = assert('Foo &#x1F44D; baz')

    expect(result).toEqual({
      result: 'Foo 👍 baz',
      reference: [
        ['👍', location(1, 5, 4, 1, 14, 13), '&#x1F44D;']
      ],
      text: [
        ['Foo ', location(1, 1, 0, 1, 5, 4)],
        [' baz', location(1, 14, 13, 1, 18, 17)]
      ],
      warning: []
    })
  })

  it('when given positional information', () => {
    const result = assert('foo&amp;bar\n&not;baz', {
      position: point(3, 5, 12)
    })

    expect(result).toEqual({
      result: 'foo&bar\n¬baz',
      reference: [
        ['&', location(3, 8, 15, 3, 13, 20), '&amp;'],
        ['¬', location(4, 1, 24, 4, 6, 29), '&not;']
      ],
      text: [
        ['foo', location(3, 5, 12, 3, 8, 15)],
        ['bar\n', location(3, 13, 20, 4, 1, 24)],
        ['baz', location(4, 6, 29, 4, 9, 32)]
      ],
      warning: []
    })
  })

  it('when given location information', () => {
    const result = assert('foo&amp;bar\n&not;baz', {
      position: location(3, 5, 12, 4, 9, 32)
    })

    expect(result).toEqual({
      result: 'foo&bar\n¬baz',
      reference: [
        ['&', location(3, 8, 15, 3, 13, 20), '&amp;'],
        ['¬', location(4, 1, 24, 4, 6, 29), '&not;']
      ],
      text: [
        ['foo', location(3, 5, 12, 3, 8, 15)],
        ['bar\n', location(3, 13, 20, 4, 1, 24)],
        ['baz', location(4, 6, 29, 4, 9, 32)]
      ],
      warning: []
    })
  })

  it('when given indentation', () => {
    const result = assert('foo&amp;bar\n&not;baz', {
      position: {
        start: point(3, 5, 12),
        end: point(4, 9, 32),
        indent: [5]
      }
    })

    expect(result).toEqual({
      result: 'foo&bar\n¬baz',
      reference: [
        ['&', location(3, 8, 15, 3, 13, 20), '&amp;'],
        ['¬', location(4, 5, 24, 4, 10, 29), '&not;']
      ],
      text: [
        ['foo', location(3, 5, 12, 3, 8, 15)],
        ['bar\n', location(3, 13, 20, 4, 5, 24)],
        ['baz', location(4, 10, 29, 4, 13, 32)]
      ],
      warning: []
    })
  })

  it('example #1', () => {
    const result = assert('I’m &notit; though')

    expect(result).toEqual({
      result: 'I’m ¬it; though',
      reference: [
        ['¬', location(1, 5, 4, 1, 9, 8), '&not']
      ],
      text: [
        ['I’m ', location(1, 1, 0, 1, 5, 4)],
        ['it; though', location(1, 9, 8, 1, 19, 18)]
      ],
      warning: [[
        'Named character references must be terminated by a semicolon',
        point(1, 9, 8),
        1
      ]]
    })
  })

  it('example #2', () => {
    const result = assert('I’m &notin; though')

    expect(result).toEqual({
      result: 'I’m ∉ though',
      reference: [
        ['∉', location(1, 5, 4, 1, 12, 11), '&notin;']
      ],
      text: [
        ['I’m ', location(1, 1, 0, 1, 5, 4)],
        [' though', location(1, 12, 11, 1, 19, 18)]
      ],
      warning: []
    })
  })

  it('legacy entity characters', () => {
    const result = assert('I’m &AMPed though')

    expect(result).toEqual({
      result: 'I’m &ed though',
      reference: [
        ['&', location(1, 5, 4, 1, 9, 8), '&AMP']
      ],
      text: [
        ['I’m ', location(1, 1, 0, 1, 5, 4)],
        ['ed though', location(1, 9, 8, 1, 18, 17)]
      ],
      warning: [[
        'Named character references must be terminated by a semicolon',
        point(1, 9, 8),
        1
      ]]
    })
  })

  it('non-legacy entity characters', () => {
    const result = assert('I’m &circled though')

    expect(result).toEqual({
      result: 'I’m &circled though',
      reference: [],
      text: [
        ['I’m &circled though', location(1, 1, 0, 1, 20, 19)]
      ],
      warning: [[
        'Named character references cannot be empty',
        point(1, 6, 5),
        3
      ]]
    })
  })
  
  // t.end();

  // function assert(fixture, options) {
  //   var settings = options || {};
  //   var result = {
  //     text: [],
  //     reference: [],
  //     warning: []
  //   };

  //   /* Construct an `add`er for `type`. */
  //   function addFactory(type) {
  //     return function () {
  //       result[type].push([].slice.apply(arguments));
  //     };
  //   }

  //   settings.text = addFactory('text');
  //   settings.reference = addFactory('reference');
  //   settings.warning = addFactory('warning');

  //   result.result = decode(fixture, settings);

  //   return result;
  // }
})


interface Result {
  text: [string, Position][]
  reference: [string, Position, string][]
  warning: [string, Position, number][]
  result: string
}

function assert (fixture: string, options?: Options<any>) {
  const settings = options || {}
  const result: Result = {
    text: [],
    reference: [],
    warning: [],
    result: null,
  }

  settings.text = (text: string, position: Position) => {
    result.text.push([text, position])
  }
  settings.reference = (text: string, position: Position, source: string) => {
    result.reference.push([text, position, source])
  }
  settings.warning = (reason: string, position: Position, code: number) => {
    result.warning.push([reason, position, code])
  }

  result.result = parseEntities(fixture, settings)

  return result
}





/* Utility to create a `location`. */
function location (aLine: number, aColumn: number, aOffset: number, bLine: number, bColumn: number, bOffset: number): Position {
  return {
    start: point(aLine, aColumn, aOffset),
    end: point(bLine, bColumn, bOffset),
  }
}

/* Utility to create a `position`. */
function point (line: number, column: number, offset: number): Point {
  return {
    line,
    column,
    offset,
  }
}
