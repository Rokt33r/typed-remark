import * as path from 'path'

/* Assert that `part` is not a path (i.e., does
 * not contain `path.sep`). */
export function assertPart (part: string, name: string) {
  if (part.indexOf(path.sep) !== -1) {
    throw new Error('`' + name + '` cannot be a path: did not expect `' + path.sep + '`')
  }
}

export function assertNonEmpty (part: any, name: string) {
  if (!part) {
    throw new Error('`' + name + '` cannot be empty')
  }
}

export function assertPathExists (p: string, name: string) {
  if (!p) {
    throw new Error('Setting `' + name + '` requires `path` to be set too')
  }
}
