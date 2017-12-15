import { LinkReference } from 'typed-mdast'
import { RemarkCompiler } from '../RemarkCompiler'
import {
  copyIdentifierEncoding,
  stringifyLabel,
} from '../util'

export function linkReference (this: RemarkCompiler, node: LinkReference) {
  const self = this
  const type = node.referenceType
  const exit = self.enterLinkReference(self, node)
  let value = self.all(node).join('')

  exit()

  if (type === 'shortcut' || type === 'collapsed') {
    value = copyIdentifierEncoding(value, node.identifier)
  }

  return '[' + value + ']' + stringifyLabel(node)
}
