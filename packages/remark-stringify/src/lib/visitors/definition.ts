import { encloseURI } from '../util/encloseURI'
import { encloseTitle } from '../util/encloseTitle'
import { Definition } from 'typed-mdast'

/* Stringify an URL definition.
 *
 * Is smart about enclosing `url` (see `encloseURI()`) and
 * `title` (see `encloseTitle()`).
 *
 *    [foo]: <foo at bar dot com> 'An "example" e-mail'
 */
export function definition (node: Definition) {
  let content = encloseURI(node.url)

  if (node.title) {
    content += ' ' + encloseTitle(node.title)
  }

  return '[' + node.identifier + ']: ' + content
}
