import { Doc } from 'typed-unified'
import {
  Node,
  Point,
  Position,
} from 'typed-unist'
import { VFile } from 'typed-vfile'
import { parse } from './parse'
import VFileLocation from 'typed-vfile-location'
import { getEscapes } from 'typed-markdown-escapes'
import { unescape } from './unescape'
import { decoder, decodeRaw } from './decode'
import { defaultOptions } from './defaultOptions'
import { TokenizeMethod, Factory, Tokenize, factory as tokenizer } from './tokenizer'
import { autoLink } from './tokenize/autoLink'
import { blockquote } from './tokenize/blockquote'
import { strikethrough } from './tokenize/delete'
import { hardBreak } from './tokenize/break'
import { fencedCode } from './tokenize/codeFenced'
import { indentedCode } from './tokenize/codeIndented'
import { inlineCode } from './tokenize/codeInline'
import { definition } from './tokenize/definition'
import { emphasis } from './tokenize/emphasis'
import { escape } from './tokenize/escape'
import { footnoteDefinition } from './tokenize/footnoteDefinition'
import { atxHeading } from './tokenize/headingATX'
import { setextHeading } from './tokenize/headingSetext'
import { blockHTML } from './tokenize/htmlBlock'
import { inlineHTML } from './tokenize/htmlInline'
import { link } from './tokenize/link'
import { list } from './tokenize/list'
import { newline } from './tokenize/newline'
import { paragraph } from './tokenize/paragraph'
import { reference } from './tokenize/reference'
import { strong } from './tokenize/strong'
import { table } from './tokenize/table'
import { text } from './tokenize/text'
import { thematicBreak } from './tokenize/thematicBreak'
import { url } from './tokenize/url'

export interface RemarkParserOptions {
  position?: boolean,
  gfm?: boolean,
  commonmark?: boolean,
  footnotes?: boolean,
  pedantic?: boolean,
  blocks?: string[]
}

export interface InteruptRuleOptions {
  commonmark?: boolean
  pedantic?: boolean
}
export type InteruptRule = [string] | [string, InteruptRuleOptions]

export class RemarkParser {
  public options: RemarkParserOptions
  public escape: string[]
  public file: VFile
  public inList: boolean
  public inBlock: boolean
  public inLink: boolean
  public atStart: boolean
  public offset: {
    [key: number]: number
  }
  public toOffset: (potision: Point) => number
  public unescape: (value: string) => string
  public decode: (value: string, position: Point, handler: (value: string, location: Position) => void) => void
  public decodeRaw: (value: string, position: Point) => string
  public interruptParagraph: InteruptRule[]
  public interruptList: InteruptRule[]
  public interruptBlockquote: InteruptRule[]
  public eof: Point
  public inlineMethods: string[]
  public blockMethods: string[]
  public blockTokenizers: {[key: string]: TokenizeMethod}
  public inlineTokenizers: {[key: string]: TokenizeMethod}
  public tokenizeBlock: Tokenize
  public tokenizeInline: Tokenize
  public tokenizeFactory: Factory

  constructor (doc: Doc, file: VFile) {
    this.file = file
    this.offset = {}
    this.options = Object.assign({}, this.options)
    this.escape = getEscapes(this.options)

    this.inList = false
    this.inBlock = false
    this.inLink = false
    this.atStart = true

    this.toOffset = new VFileLocation(file).toOffset
  }

  public parse: (this: RemarkParser) => Node
}

RemarkParser.prototype.parse = parse
RemarkParser.prototype.unescape = unescape
RemarkParser.prototype.decode = decoder
RemarkParser.prototype.decodeRaw = decodeRaw
RemarkParser.prototype.options = defaultOptions

/* Nodes that can interupt a paragraph:
 *
 * ```markdown
 * A paragraph, followed by a thematic break.
 * ___
 * ```
 *
 * In the above example, the thematic break “interupts”
 * the paragraph. */
RemarkParser.prototype.interruptParagraph = [
  ['thematicBreak'],
  ['atxHeading'],
  ['fencedCode'],
  ['blockquote'],
  ['html'],
  ['setextHeading', {commonmark: false}],
  ['definition', {commonmark: false}],
  ['footnote', {commonmark: false}],
]

/* Nodes that can interupt a list:
 *
 * ```markdown
 * - One
 * ___
 * ```
 *
 * In the above example, the thematic break “interupts”
 * the list. */
RemarkParser.prototype.interruptList = [
  ['fencedCode', {pedantic: false}],
  ['thematicBreak', {pedantic: false}],
  ['definition', {commonmark: false}],
  ['footnote', {commonmark: false}],
]

/* Nodes that can interupt a blockquote:
 *
 * ```markdown
 * > A paragraph.
 * ___
 * ```
 *
 * In the above example, the thematic break “interupts”
 * the blockquote. */
RemarkParser.prototype.interruptBlockquote = [
  ['indentedCode', {commonmark: true}],
  ['fencedCode', {commonmark: true}],
  ['atxHeading', {commonmark: true}],
  ['setextHeading', {commonmark: true}],
  ['thematicBreak', {commonmark: true}],
  ['html', {commonmark: true}],
  ['list', {commonmark: true}],
  ['definition', {commonmark: false}],
  ['footnote', {commonmark: false}],
]

RemarkParser.prototype.blockTokenizers = {
  newline,
  indentedCode,
  fencedCode,
  blockquote,
  atxHeading,
  thematicBreak,
  list,
  setextHeading,
  html: blockHTML,
  footnote: footnoteDefinition,
  definition,
  table,
  paragraph,
}

RemarkParser.prototype.inlineTokenizers = {
  escape,
  autoLink,
  url,
  html: inlineHTML,
  link,
  reference,
  strong,
  emphasis,
  deletion: strikethrough,
  code: inlineCode,
  break: hardBreak,
  text,
}

/* Expose precedence. */
RemarkParser.prototype.blockMethods = Object.keys(RemarkParser.prototype.blockTokenizers)
RemarkParser.prototype.inlineMethods = Object.keys(RemarkParser.prototype.inlineTokenizers)

/* Tokenizers. */
RemarkParser.prototype.tokenizeBlock = tokenizer('block')
RemarkParser.prototype.tokenizeInline = tokenizer('inline')
RemarkParser.prototype.tokenizeFactory = tokenizer
