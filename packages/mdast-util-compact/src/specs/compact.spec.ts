import u from 'typed-unist-builder'
import { compact } from '../lib'

describe('compact', () => {
  it('should compact texts', () => {
    const input = u('paragraph', [
      u('text', 'alpha'),
      u('text', ' '),
      u('text', 'bravo'),
    ])
    expect(compact(input)).toEqual(u('paragraph', [u('text', 'alpha bravo')]))
  })

  it('should merge positions', () => {
    const input = u('paragraph', [
      u('text', {position: {
        start: {line: 1, column: 1},
        end: {line: 1, column: 6},
      }}, 'alpha'),
      u('text', {position: {
        start: {line: 1, column: 6},
        end: {line: 1, column: 7},
      }}, ' '),
      u('text', {position: {
        start: {line: 1, column: 7},
        end: {line: 1, column: 12},
      }}, 'bravo'),
    ])

    expect(compact(input)).toEqual(u('paragraph', [u('text', {position: {
      start: {line: 1, column: 1},
      end: {line: 1, column: 12},
    }}, 'alpha bravo')]))
  })

  it('should not compact texts with incompatible positions', () => {
    const input = u('paragraph', [
      u('text', 'at'),
      u('text', {position: {
        start: {line: 1, column: 3},
        end: {line: 1, column: 8},
      }}, '&'),
      u('text', 't'),
    ])

    expect(input).toEqual(u('paragraph', [
      u('text', 'at'),
      u('text', {position: {
        start: {line: 1, column: 3},
        end: {line: 1, column: 8},
      }}, '&'),
      u('text', 't'),
    ]))
  })

  it('should not compact blockquotes', () => {
    const input = u('root', [
      u('blockquote', [u('paragraph', [u('text', 'Alpha.')])]),
      u('blockquote', [u('paragraph', [u('text', 'Bravo.')])]),
    ])

    expect(compact(input)).toEqual(u('root', [
      u('blockquote', [u('paragraph', [u('text', 'Alpha.')])]),
      u('blockquote', [u('paragraph', [u('text', 'Bravo.')])]),
    ]))
  })

  it('should compact blockquotes in commonmark mode', () => {
    const input = u('root', [
      u('blockquote', [u('paragraph', [u('text', 'Alpha.')])]),
      u('blockquote', [u('paragraph', [u('text', 'Bravo.')])]),
    ])

    expect(compact(input, true)).toEqual(u('root', [
      u('blockquote', [
        u('paragraph', [u('text', 'Alpha.')]),
        u('paragraph', [u('text', 'Bravo.')]),
      ]),
    ]))
  })
})
