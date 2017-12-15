import { Doc } from 'typed-unified'
import { Node } from 'typed-unist'
import { VFile } from 'typed-vfile'
import { stateToggleFactory } from 'typed-state-toggle'

export interface RemarkStringifyOptions {
  gfm?: boolean
  commonmark?: boolean
  pedantic?: boolean
  entities?: boolean | 'numbers' | 'escape'
  setext?: boolean
  closeAtx?: boolean
  looseTable?: boolean
  spacedTable?: boolean
  paddedTable?: boolean
  stringLength?: (value: string) => number
  incrementListMarker?: boolean
  fences?: boolean
  fence?: '`' | '~'
  bullet?: '-' | '*' | '+'
  listItemIndent?: 'tab' | 'mixed' | '1'
  rule?: '*' | '-' | '_'
  ruleSpaces?: boolean
  ruleRepetition?: number,
  strong?: '*' | '_'
  emphasis?: '*' | '_'
}

export interface RemarkCompilerConstructor {
  new (doc: Doc, file: VFile): RemarkCompiler
}

export interface RemarkCompiler {
  inLink: boolean
  inTable: boolean
  tree: Node
  file: VFile
  options: RemarkStringifyOptions
  setOptions: (opts: RemarkStringifyOptions) => void
}

export const compilerFactory = (): RemarkCompiler => {
  class Compiler implements RemarkCompiler {
    public inLink: boolean
    public inTable: boolean
    public tree: Node
    public file: VFile
    public options: RemarkStringifyOptions
    public enterLink: () => () => void
    public enterTable: () => () => void
    public enterLinkReference: () => () => void
    public setOptions: (opts: RemarkStringifyOptions) => void

    constructor (tree: Node, file: VFile) {
      this.inLink = false
      this.inTable = false
      this.tree = tree
      this.file = file
      this.options = {
        ...this.options,
      }
      this.setOptions({})
    }
  }

  const proto = Compiler.prototype

  /* Enter and exit helpers. */
  proto.enterLink = stateToggleFactory('inLink', false)
  proto.enterTable = stateToggleFactory('inTable', false)
  proto.enterLinkReference = require('./util/enter-link-reference')

  /* Configuration. */
  proto.options = require('./defaults')
  proto.setOptions = require('./set-options')

  proto.compile = require('./macro/compile')
  proto.visit = require('./macro/one')
  proto.all = require('./macro/all')
  proto.block = require('./macro/block')
  proto.visitOrderedItems = require('./macro/ordered-items')
  proto.visitUnorderedItems = require('./macro/unordered-items')

  /* Expose visitors. */
  proto.visitors = {
    root: require('./visitors/root'),
    text: require('./visitors/text'),
    heading: require('./visitors/heading'),
    paragraph: require('./visitors/paragraph'),
    blockquote: require('./visitors/blockquote'),
    list: require('./visitors/list'),
    listItem: require('./visitors/list-item'),
    inlineCode: require('./visitors/inline-code'),
    code: require('./visitors/code'),
    html: require('./visitors/html'),
    thematicBreak: require('./visitors/thematic-break'),
    strong: require('./visitors/strong'),
    emphasis: require('./visitors/emphasis'),
    break: require('./visitors/break'),
    delete: require('./visitors/delete'),
    link: require('./visitors/link'),
    linkReference: require('./visitors/link-reference'),
    imageReference: require('./visitors/image-reference'),
    definition: require('./visitors/definition'),
    image: require('./visitors/image'),
    footnote: require('./visitors/footnote'),
    footnoteReference: require('./visitors/footnote-reference'),
    footnoteDefinition: require('./visitors/footnote-definition'),
    table: require('./visitors/table'),
    tableCell: require('./visitors/table-cell'),
  }


  return Compiler
}
