import { collapseLines } from '../lib'

describe('collapseLines', () => {
  it('collapses lines', () => {
    expect(collapseLines(' foo\t\n\n bar \n\tbaz ')).toBe(' foo\nbar\nbaz ')
  })
})
