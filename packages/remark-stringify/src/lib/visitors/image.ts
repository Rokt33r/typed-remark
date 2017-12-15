import { RemarkCompiler } from '../RemarkCompiler'
import { Image } from 'typed-mdast'
import { encloseTitle } from '../util/encloseTitle'
import { encloseURI } from '../util/encloseURI'

/**
 * Stringify an image.
 *
 * Is smart about enclosing `url` (see `encloseURI()`) and
 * `title` (see `encloseTitle()`).
 *
 *    ![foo](</fav icon.png> 'My "favourite" icon')
 *
 * Supports named entities in `url`, `alt`, and `title`
 * when in `settings.encode` mode.
 */
export function image (this: RemarkCompiler, node: Image) {
  const self = this
  let content = encloseURI(self.encode(node.url || '', node))
  const exit = self.enterLink()
  const alt = self.encode(self.escape(node.alt || '', node))

  exit()

  if (node.title) {
    content += ' ' + encloseTitle(self.encode(node.title, node))
  }

  return '![' + alt + '](' + content + ')'
}
