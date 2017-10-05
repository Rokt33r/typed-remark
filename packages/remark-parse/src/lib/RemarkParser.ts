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

export abstract class RemarkParser {
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
  public decode: (value: string, position: Point, handler: (value: string, location: Position, source: string) => void) => void
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
  public parse: (this: RemarkParser) => Node
}

export const parserFactory = () => {
  class Parser implements RemarkParser {
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
    public decode: (value: string, position: Point, handler: (value: string, location: Position, source: string) => void) => void
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

      const vFileLocation = new VFileLocation(file)
      this.toOffset = vFileLocation.toOffset.bind(vFileLocation)
    }

    public parse: (this: RemarkParser) => Node
  }

  Parser.prototype.parse = parse
  Parser.prototype.unescape = unescape
  Parser.prototype.decode = decoder
  Parser.prototype.decodeRaw = decodeRaw
  Parser.prototype.options = defaultOptions

  /* Nodes that can interupt a paragraph:
   *
   * ```markdown
   * A paragraph, followed by a thematic break.
   * ___
   * ```
   *
   * In the above example, the thematic break “interupts”
   * the paragraph. */
  Parser.prototype.interruptParagraph = [
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
  Parser.prototype.interruptList = [
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
  Parser.prototype.interruptBlockquote = [
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

  Parser.prototype.blockTokenizers = {
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

  Parser.prototype.inlineTokenizers = {
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
  Parser.prototype.blockMethods = Object.keys(Parser.prototype.blockTokenizers)
  Parser.prototype.inlineMethods = Object.keys(Parser.prototype.inlineTokenizers)

  /* Tokenizers. */
  Parser.prototype.tokenizeBlock = tokenizer('block')
  Parser.prototype.tokenizeInline = tokenizer('inline')
  Parser.prototype.tokenizeFactory = tokenizer

  return Parser
}
