import { collapseWhitespace } from '../lib'

describe('collapseWhitespace', () => {
  it('collapses whitespace', () => {
    expect(collapseWhitespace(' \t\nbar \nbaz\t')).toBe(' bar baz ')
    expect(collapseWhitespace('   bar\t\t\tbaz\n\n\n')).toBe(' bar baz ')
    expect(collapseWhitespace(' \n bar\t\n\tbaz\r\n')).toBe(' bar baz ')
  })
})
