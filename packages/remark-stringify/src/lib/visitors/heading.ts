import { RemarkCompiler } from '../RemarkCompiler'
import { Heading } from 'typed-mdast'

/**
 * Stringify a heading.
 *
 * In `setext: true` mode and when `depth` is smaller than
 * three, creates a setext header:
 *
 *     Foo
 *     ===
 *
 * Otherwise, an ATX header is generated:
 *
 *     ### Foo
 *
 * In `closeAtx: true` mode, the header is closed with
 * hashes:
 *
 *     ### Foo ###
 */
export function heading (this: RemarkCompiler, node: Heading) {
  const self = this
  const depth = node.depth
  const setext = self.options.setext
  const closeAtx = self.options.closeAtx
  const content = self.all(node).join('')
  let prefix

  if (setext && depth < 3) {
    return content + '\n' + (depth === 1 ? '=' : '-').repeat(content.length)
  }

  prefix = '#'.repeat(node.depth)

  return prefix + ' ' + content + (closeAtx ? ' ' + prefix : '')
}
