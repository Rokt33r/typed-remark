import { LinkReference, ImageReference } from 'typed-mdast'

/**
 * Stringify a reference label.
 * Because link references are easily, mistakingly,
 * created (for example, `[foo]`), reference nodes have
 * an extra property depicting how it looked in the
 * original document, so stringification can cause minimal
 * changes.
 */
export function stringifyLabel (node: LinkReference | ImageReference): string {
  const type = node.referenceType
  const value = type === 'full' ? node.identifier : ''

  return type === 'shortcut' ? value : '[' + value + ']'
}
