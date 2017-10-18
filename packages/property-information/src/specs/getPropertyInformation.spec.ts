import getPropertyInformation from '../lib/index'

describe('getPropertyInformation(name)', () => {
  it('should work', () => {
    const result = getPropertyInformation('foo')

    expect(result).toEqual(undefined)
  })

  it('should get property information of "class"', () => {
    const result = getPropertyInformation('class')

    expect(result).toEqual({
      name: 'class',
      propertyName: 'className',
      mustUseAttribute: true,
      mustUseProperty: false,
      boolean: false,
      overloadedBoolean: false,
      numeric: false,
      positiveNumeric: false,
      commaSeparated: false,
      spaceSeparated: true,
    })
  })

  it('should get property information of "srcSet"', () => {
    const result = getPropertyInformation('srcSet')

    expect(result).toEqual({
      name: 'srcset',
      propertyName: 'srcSet',
      mustUseAttribute: true,
      mustUseProperty: false,
      boolean: false,
      overloadedBoolean: false,
      numeric: false,
      positiveNumeric: false,
      commaSeparated: true,
      spaceSeparated: false,
    })
  })

  it('should get property information of "download"', () => {
    const result = getPropertyInformation('download')

    expect(result).toEqual({
      name: 'download',
      propertyName: 'download',
      mustUseAttribute: false,
      mustUseProperty: false,
      boolean: false,
      overloadedBoolean: true,
      numeric: false,
      positiveNumeric: false,
      commaSeparated: false,
      spaceSeparated: false,
    })
  })

  it('should get property information of "itemScope"', () => {
    const result = getPropertyInformation('itemScope')

    expect(result).toEqual({
      name: 'itemscope',
      propertyName: 'itemScope',
      mustUseAttribute: true,
      mustUseProperty: false,
      boolean: true,
      overloadedBoolean: false,
      numeric: false,
      positiveNumeric: false,
      commaSeparated: false,
      spaceSeparated: false,
    })
  })

  it('should get property information of "span"', () => {
    const result = getPropertyInformation('span')

    expect(result).toEqual({
      name: 'span',
      propertyName: 'span',
      mustUseAttribute: false,
      mustUseProperty: false,
      boolean: false,
      overloadedBoolean: false,
      numeric: true,
      positiveNumeric: true,
      commaSeparated: false,
      spaceSeparated: false,
    })
  })

  it('should get property information of "value"', () => {
    const result = getPropertyInformation('value')

    expect(result).toEqual({
      name: 'value',
      propertyName: 'value',
      mustUseAttribute: false,
      mustUseProperty: true,
      boolean: false,
      overloadedBoolean: false,
      numeric: false,
      positiveNumeric: false,
      commaSeparated: false,
      spaceSeparated: false,
    })
  })

  describe('should accept attribute', () => {
    it('should return the same property information with "className" and "class".', () => {
      const resultA = getPropertyInformation('className')
      const resultB = getPropertyInformation('class')

      expect(resultA).toEqual(resultB)
    })

    it('should return the same property information with "xmlLang" and "xml:lang".', () => {
      const resultA = getPropertyInformation('xmlLang')
      const resultB = getPropertyInformation('xml:lang')

      expect(resultA).toEqual(resultB)
    })

    it('should return the same property information with "httpEquiv" and "http-equiv".', () => {
      const resultA = getPropertyInformation('httpEquiv')
      const resultB = getPropertyInformation('http-equiv')

      expect(resultA).toEqual(resultB)
    })
  })

})
