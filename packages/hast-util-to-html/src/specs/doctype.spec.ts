import u from 'typed-unist-builder'
import { toHTML } from '../lib'

describe('doctype', () => {
  it('should stringify doctypes without `name`', () => {
    const input = u('doctype')

    expect(toHTML(input)).toBe('<!DOCTYPE>')
  })

  it('should stringify doctypes with `name`', () => {
    const input = u('doctype', {name: 'html'})

    expect(toHTML(input)).toBe('<!DOCTYPE html>')
  })

  it('should stringify doctypes with a public identifier', () => {
    const input = u('doctype', {
      name: 'html',
      public: '-//W3C//DTD XHTML 1.0 Transitional//EN',
    })

    expect(toHTML(input)).toBe('<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN">')
  })

  it('should stringify doctypes with a system identifier', () => {
    const input = u('doctype', {
      name: 'html',
      system: 'about:legacy-compat',
    })

    expect(toHTML(input)).toBe('<!DOCTYPE html SYSTEM "about:legacy-compat">')
  })

  it('should stringify doctypes with both identifiers', () => {
    const input = u('doctype', {
      name: 'html',
      public: '-//W3C//DTD HTML 4.01//',
      system: 'http://www.w3.org/TR/html4/strict.dtd',
    })

    expect(toHTML(input)).toBe('<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//" "http://www.w3.org/TR/html4/strict.dtd">')
  })

  it('should quote smartly', () => {
    const input = u('doctype', {
      name: 'html',
      system: 'taco"',
    })

    expect(toHTML(input)).toBe('<!DOCTYPE html SYSTEM \'taco"\'>')
  })
})
