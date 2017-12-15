import { toHAST, ToHastOptions } from 'typed-mdast-util-to-hast'
import { toHTML } from 'typed-hast-util-to-html'
import { sanitizeHAST, SanitizeSchema } from 'typed-hast-util-sanitize'
import { Node } from 'typed-unist'
import { VFile } from 'typed-vfile'

export interface RemarkHTMLOptions extends ToHastOptions {
  sanitize?: SanitizeSchema
}

function plugin (options: RemarkHTMLOptions) {
  const settings: RemarkHTMLOptions = options || {}
  const clean = settings.sanitize
  const schema = clean && typeof clean === 'object' ? clean : null
  const handlers = settings.handlers || {}

  this.Compiler = compiler

  function compiler (node: Node, file: VFile) {
    const root = node && node.type && node.type === 'root'
    let hast = toHAST(node, {allowDangerousHTML: !clean, handlers})
    let result

    if (file.extname) {
      file.extname = '.html'
    }

    if (clean) {
      hast = sanitizeHAST(hast, schema)
    }

    result = toHTML(hast, {
      ...settings,
      allowDangerousHTML: !clean,
    } as ToHastOptions)

    /* Add a final newline. */
    if (root && result.charAt(result.length - 1) !== '\n') {
      result += '\n'
    }

    return result
  }
}

export default plugin
