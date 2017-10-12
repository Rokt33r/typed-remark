import { ccount } from '../lib'

describe('ccount', () => {
  const warn = console.warn

  beforeAll(() => {
    console.warn = jest.fn()
  })

  afterAll(() => {
    console.warn = warn
  })

  it('warns if a given character is not one lengh string', () => {
    expect(ccount('foo', 'offf')).toBe(2)
    expect(console.warn).toBeCalled()
  })

  it('counts characters', () => {
    expect(ccount('', 'f')).toBe(0)
    expect(ccount('foo', 'o')).toBe(2)
    expect(ccount('fo fooo fo', 'o')).toBe(5)
    expect(ccount('ooo', 'o')).toBe(3)
  })
})
