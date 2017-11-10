import h from '../lib'

describe('hastscript', () => {
  it('should create a `div` element without arguments', () => {
    expect(h()).toEqual({
      type: 'element',
      tagName: 'div',
      properties: {},
      children: [],
    })
  })

  it('should append to the selector’s classes', () => {
    expect(h('.bar', [], {class: 'baz'})).toEqual({
      type: 'element',
      tagName: 'div',
      properties: {className: ['bar', 'baz']},
      children: [],
    })
  })

  it('should create a `div` element when given an id selector', () => {
    expect(h('#id')).toEqual({
      type: 'element',
      tagName: 'div',
      properties: {id: 'id'},
      children: [],
    })
  })

  it('should create an element with the last ID when given multiple in a selector', () => {
    expect(h('#a#b')).toEqual({
      type: 'element',
      tagName: 'div',
      properties: {id: 'b'},
      children: [],
    })
  })

  it('should create a `div` element when given a class selector', () => {
    expect(h('.foo')).toEqual({
      type: 'element',
      tagName: 'div',
      properties: {className: ['foo']},
      children: [],
    })
  })

  it('should create a `foo` element when given a tag selector', () => {
    expect(h('foo')).toEqual({
      type: 'element',
      tagName: 'foo',
      properties: {},
      children: [],
    })
  })

  it('should create a `foo` element with an ID when given a both as a selector', () => {
    expect(h('foo#bar')).toEqual({
      type: 'element',
      tagName: 'foo',
      properties: {id: 'bar'},
      children: [],
    })
  })

  it('should create a `foo` element with a class when given a both as a selector', () => {
    expect(h('foo.bar')).toEqual({
      type: 'element',
      tagName: 'foo',
      properties: {className: ['bar']},
      children: [],
    })
  })

  it('should support multiple classes', () => {
    expect(h('.foo.bar')).toEqual({
      type: 'element',
      tagName: 'div',
      properties: {className: ['foo', 'bar']},
      children: [],
    })
  })

  it('should support unknown `string` values', () => {
    expect(h(null, [], {foo: 'bar'})).toEqual({
      type: 'element',
      tagName: 'div',
      properties: {foo: 'bar'},
      children: [],
    })
  })

  it('should support unknown `number` values', () => {
    expect(h(null, [], {foo: 3})).toEqual({
      type: 'element',
      tagName: 'div',
      properties: {foo: 3},
      children: [],
    })
  })

  it('should support unknown `boolean` values', () => {
    expect(h(null, [], {foo: true})).toEqual({
      type: 'element',
      tagName: 'div',
      properties: {foo: true},
      children: [],
    })
  })

  it('should support unknown `Array` values', () => {
    expect(h(null, [], {class: ['bar', 'baz']})).toEqual({
      type: 'element',
      tagName: 'div',
      properties: {className: ['bar', 'baz']},
      children: [],
    })
  })

  it('should ignore properties with a value of `null`', () => {
    expect(h(null, [], {foo: null})).toEqual({
      type: 'element',
      tagName: 'div',
      properties: {},
      children: [],
    })
  })

  it('should ignore properties with a value of `undefined`', () => {
    expect(h(null, [], {foo: undefined})).toEqual({
      type: 'element',
      tagName: 'div',
      properties: {},
      children: [],
    })
  })

  it('should ignore properties with a value of `NaN`', () => {
    expect(h(null, [], {foo: NaN})).toEqual({
      type: 'element',
      tagName: 'div',
      properties: {},
      children: [],
    })
  })

  it('should cast valid known `boolean` values', () => {
    expect(h(null, [], {allowFullScreen: ''})).toEqual({
      type: 'element',
      tagName: 'div',
      properties: {allowFullScreen: true},
      children: [],
    })
  })

  it('should not cast invalid known `boolean` values', () => {
    expect(h(null, [], {allowFullScreen: 'yup'})).toEqual({
      type: 'element',
      tagName: 'div',
      properties: {allowFullScreen: 'yup'},
      children: [],
    })
  })

  it('should cast valid known `numeric` values', () => {
    expect(h(null, [], {volume: '0.1'})).toEqual({
      type: 'element',
      tagName: 'div',
      properties: {volume: 0.1},
      children: [],
    })
  })

  it('should not cast invalid known `numeric` values', () => {
    expect(h(null, [], {volume: 'one'})).toEqual({
      type: 'element',
      tagName: 'div',
      properties: {volume: 'one'},
      children: [],
    })
  })

  it('should cast known empty overloaded `boolean` values', () => {
    expect(h(null, [], {download: ''})).toEqual({
      type: 'element',
      tagName: 'div',
      properties: {download: true},
      children: [],
    })
  })

  it('should cast known named overloaded `boolean` values', () => {
    expect(h(null, [], {download: 'downLOAD'})).toEqual({
      type: 'element',
      tagName: 'div',
      properties: {download: true},
      children: [],
    })
  })

  it('should not cast overloaded `boolean` values for different values', () => {
    expect(h(null, [], {download: 'example.ogg'})).toEqual({
      type: 'element',
      tagName: 'div',
      properties: {download: 'example.ogg'},
      children: [],
    })
  })

  it('should cast known `numeric` values', () => {
    expect(h('meter', [], {low: '40', high: '90'})).toEqual({
      type: 'element',
      tagName: 'meter',
      properties: {low: 40, high: 90},
      children: [],
    })
  })

  it('should cast a list of known `numeric` values', () => {
    expect(h('a', [], {coords: ['0', '0', '82', '126']})).toEqual({
      type: 'element',
      tagName: 'a',
      properties: {coords: [0, 0, 82, 126]},
      children: [],
    })
  })

  it('should cast know space-separated `array` values', () => {
    expect(h(null, [], {class: 'foo bar baz'})).toEqual({
      type: 'element',
      tagName: 'div',
      properties: {className: ['foo', 'bar', 'baz']},
      children: [],
    })
  })

  it('should cast know comma-separated `array` values', () => {
    expect(h('input', [], {type: 'file', accept: 'video/*, image/*'})).toEqual({
      type: 'element',
      tagName: 'input',
      properties: {type: 'file', accept: ['video/*', 'image/*']},
      children: [],
    })
  })

  it('should support `style` as an object', () => {
    expect(h(null, [], {style: {'color': 'red', '-webkit-border-radius': '3px'}})).toEqual({
      type: 'element',
      tagName: 'div',
      properties: {
        style: 'color: red; -webkit-border-radius: 3px',
      },
      children: [],
    })
  })

  it('should support `style` as a string', () => {
    expect(h(null, [], {style: 'color:/*red*/purple; -webkit-border-radius: 3px'})).toEqual({
      type: 'element',
      tagName: 'div',
      properties: {style: 'color:/*red*/purple; -webkit-border-radius: 3px'},
      children: [],
    })
  })

  it('should ignore no children', () => {
    expect(h('div', [], {})).toEqual({
      type: 'element',
      tagName: 'div',
      properties: {},
      children: [],
    })
  })

  it('should support `string` for a `Text`', () => {
    expect(h('div', ['foo'], {})).toEqual({
      type: 'element',
      tagName: 'div',
      properties: {},
      children: [{type: 'text', value: 'foo'}],
    })
  })

  it('should support a node', () => {
    expect(h('div', [{type: 'text', value: 'foo'}], {})).toEqual({
      type: 'element',
      tagName: 'div',
      properties: {},
      children: [{type: 'text', value: 'foo'}],
    })
  })

  it('should support a node created by `h`', () => {
    expect(h('div', [h('span', ['foo'], {})], {})).toEqual({
      type: 'element',
      tagName: 'div',
      properties: {},
      children: [{
        type: 'element',
        tagName: 'span',
        properties: {},
        children: [{type: 'text', value: 'foo'}],
      }],
    })
  })

  it('should support nodes', () => {
    expect(h('div', [
      {type: 'text', value: 'foo'},
      {type: 'text', value: 'bar'},
    ], {})).toEqual({
      type: 'element',
      tagName: 'div',
      properties: {},
      children: [
        {type: 'text', value: 'foo'},
        {type: 'text', value: 'bar'},
      ],
    })
  })

  it('should support nodes created by `h`', () => {
    expect(h('div', [
      h('span', ['foo'], {}),
      h('strong', ['bar'], {}),
    ], {})).toEqual({
      type: 'element',
      tagName: 'div',
      properties: {},
      children: [
        {
          type: 'element',
          tagName: 'span',
          properties: {},
          children: [{type: 'text', value: 'foo'}],
        },
        {
          type: 'element',
          tagName: 'strong',
          properties: {},
          children: [{type: 'text', value: 'bar'}],
        },
      ],
    })
  })

  it('should support `Array.<string>` for a `Text`s', () => {
    expect(h('div', ['foo', 'bar'], {})).toEqual({
      type: 'element',
      tagName: 'div',
      properties: {},
      children: [{type: 'text', value: 'foo'}, {type: 'text', value: 'bar'}],
    })
  })

  it('should allow omitting `properties` for a `string`', () => {
    expect(h('strong', ['foo'])).toEqual({
      type: 'element',
      tagName: 'strong',
      properties: {},
      children: [{type: 'text', value: 'foo'}],
    })
  })

  it('should allow omitting `properties` for a node', () => {
    expect(h('strong', [h('span', ['foo'])])).toEqual({
      type: 'element',
      tagName: 'strong',
      properties: {},
      children: [{
        type: 'element',
        tagName: 'span',
        properties: {},
        children: [{type: 'text', value: 'foo'}],
      }],
    })
  })

  it('should allow omitting `properties` for an array', () => {
    expect(h('strong', ['foo', 'bar'])).toEqual({
      type: 'element',
      tagName: 'strong',
      properties: {},
      children: [{type: 'text', value: 'foo'}, {type: 'text', value: 'bar'}],
    })
  })

  it('should *not* allow omitting `properties` for an `input[type=text][value]`, as those are void and clash', () => {
    expect(h('input', [], {type: 'text', value: 'foo'})).toEqual({
      type: 'element',
      tagName: 'input',
      properties: {type: 'text', value: 'foo'},
      children: [],
    })
  })

  it('should *not* allow omitting `properties` for an `[type]`, without `value` or `children`', () => {
    expect(h('a', [], {type: 'text/html'})).toEqual({
      type: 'element',
      tagName: 'a',
      properties: {type: 'text/html'},
      children: [],
    })
  })

  it('should *not* allow omitting `properties` when `children` is not set to an array', () => {
    expect(h('foo', [], {
      type: 'text/html',
      children: {bar: 'baz'},
    })).toEqual({
      type: 'element',
      tagName: 'foo',
      properties: {
        type: 'text/html',
        children: {bar: 'baz'},
      },
      children: [],
    })
  })

  it('should *not* allow omitting `properties` when a button has a valid type', () => {
    expect(h('button', [], {type: 'submit', value: 'Send'})).toEqual({
      type: 'element',
      tagName: 'button',
      properties: {type: 'submit', value: 'Send'},
      children: [],
    })
  })

  it('should *not* allow omitting `properties` when a button has a valid non-lowercase type', () => {
    expect(h('button', [], {type: 'BUTTON', value: 'Send'})).toEqual({
      type: 'element',
      tagName: 'button',
      properties: {type: 'BUTTON', value: 'Send'},
      children: [],
    })
  })

  it('should *not* allow omitting `properties` when a button has a valid type', () => {
    expect(h('button', [], {type: 'menu', value: 'Send'})).toEqual({
      type: 'element',
      tagName: 'button',
      properties: {type: 'menu', value: 'Send'},
      children: [],
    })
  })

  it('should allow omitting `properties` when a button has an invalid type', () => {
    expect(h('button', [{
      type: 'text',
      value: 'Send',
    }])).toEqual({
      type: 'element',
      tagName: 'button',
      properties: {},
      children: [{
        type: 'text',
        value: 'Send',
      }],
    })
  })

  it('empty template', () => {
    expect(h('template')).toEqual({
      type: 'element',
      tagName: 'template',
      properties: {},
      children: [],
      content: {
        type: 'root',
        children: [],
      },
    })
  })

  it('template with text', () => {
    expect(h('template', ['Alpha'])).toEqual({
      type: 'element',
      tagName: 'template',
      properties: {},
      children: [],
      content: {
        type: 'root',
        children: [{type: 'text', value: 'Alpha'}],
      },
    })
  })

  it('template with elements', () => {
    expect(h('template', [
      h('b', ['Bold']),
      ' and ',
      h('i', ['italic']),
      '.',
    ])).toEqual({
      type: 'element',
      tagName: 'template',
      properties: {},
      children: [],
      content: {
        type: 'root',
        children: [
          {
            type: 'element',
            tagName: 'b',
            properties: {},
            children: [{type: 'text', value: 'Bold'}],
          },
          {type: 'text', value: ' and '},
          {
            type: 'element',
            tagName: 'i',
            properties: {},
            children: [{type: 'text', value: 'italic'}],
          },
          {type: 'text', value: '.'},
        ],
      },
    })
  })
})
