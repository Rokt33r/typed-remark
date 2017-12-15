import { RemarkCompiler } from '../RemarkCompiler'
import { Emphasis } from 'typed-mdast'

/**
 * Stringify an `emphasis`.
 *
 * The marker used is configurable through `emphasis`, which
 * defaults to an underscore (`'_'`) but also accepts an
 * asterisk (`'*'`):
 *
 *     *foo*
 */
export function emphasis (this: RemarkCompiler, node: Emphasis) {
  const marker = this.options.emphasis
  return marker + this.all(node).join('') + marker
}
