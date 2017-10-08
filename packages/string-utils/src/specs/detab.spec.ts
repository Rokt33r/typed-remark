import { detab } from '../lib'

describe('detab', () => {
  it('remove tabs and fill with spaces', () => {
    expect(detab('foo\tbar')).toBe('foo bar')
    expect(detab('fo\tbar')).toBe('fo  bar')
    expect(detab('f\tbar')).toBe('f   bar')
    expect(detab('\tbar')).toBe('    bar')
    expect(detab('\t\tbar')).toBe('        bar')
    expect(detab('al\t\tbar')).toBe('al      bar')
    expect(detab('bar\t\t')).toBe('bar     ')
  })

  const map = {
    'LF': '\n',
    'CR': '\r',
    'CR+LF': '\r\n',
  } as {
    [key: string]: string
  }

  Object.keys(map).forEach(function (name) {
    it(`detabs with ${name}`, () => {
      const chars = map[name]

      expect(detab('foo' + chars + '\tbar')).toBe('foo' + chars + '    bar')
      expect(detab('fo' + chars + '\tbar')).toBe('fo' + chars + '    bar')
      expect(detab('f' + chars + '\tbar')).toBe('f' + chars + '    bar')
      expect(detab(chars + '\tbar')).toBe(chars + '    bar')
      expect(detab('al\t' + chars + '\tbar')).toBe('al  ' + chars + '    bar')
      expect(detab('bar' + chars + '\t')).toBe('bar' + chars + '    ')
      expect(detab('bar\t' + chars)).toBe('bar ' + chars)
    })
  })
})
