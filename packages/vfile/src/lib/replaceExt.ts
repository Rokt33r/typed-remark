// From https://github.com/gulpjs/replace-ext
import * as path from 'path'

export function replaceExt(npath: string, ext: string) {
  if (typeof npath !== 'string') {
    return npath
  }

  if (npath.length === 0) {
    return npath
  }

  const nFileName = path.basename(npath, path.extname(npath)) + ext
  return path.join(path.dirname(npath), nFileName)
}
