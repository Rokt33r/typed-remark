import {
  convertToKebabCase,
  revertFromKebabCase,
} from '../lib'

describe('convertToKebabCase', () => {
  it('converts with uppercased letters', () => {
    expect(convertToKebabCase('helloWorld')).toBe('hello-world')
    expect(convertToKebabCase('hello World!')).toBe('hello -world!')
  })

  it('converts without uppercased letters', () => {
    expect(convertToKebabCase('hello world')).toBe('hello world')
    expect(convertToKebabCase('-- hello world --')).toBe('-- hello world --')
  })

  it('converts with leading uppercased letters', () => {
    expect(convertToKebabCase('WebkitTransform')).toBe('-webkit-transform')
    expect(convertToKebabCase('Mr. Kebab')).toBe('-mr. -kebab')
  })

  it('converts with international uppercased letters', () => {
    expect(convertToKebabCase('ølÜberÅh')).toBe('øl-über-åh')
    expect(convertToKebabCase('Érnest')).toBe('-érnest')
  })
})

describe('revertFromKebabCase', () => {
  it('reverts', () => {
    const original = 'Hallå, Mr. Kebab Überstein! How you doin\'?-'
    const converted = convertToKebabCase(original)

    expect(revertFromKebabCase(converted)).toBe(original)
  })
})
