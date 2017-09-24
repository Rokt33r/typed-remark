export const defaults = [
  '\\',
  '`',
  '*',
  '{',
  '}',
  '[',
  ']',
  '(',
  ')',
  '#',
  '+',
  '-',
  '.',
  '!',
  '_',
  '>',
]

export const gfm = defaults.concat(['~', '|'])

export const commonmark = gfm.concat([
  '\n',
  '"',
  '$',
  '%',
  '&',
  '\'',
  ',',
  '/',
  ':',
  ';',
  '<',
  '=',
  '?',
  '@',
  '^',
])

interface Options {
  gfm?: boolean
  commonmark?: boolean
}

/* Get markdown escapes. */
export function getEscapes(options: Options = {}) {
  if (options.commonmark) {
    return commonmark
  }

  return options.gfm ? gfm : defaults
}
