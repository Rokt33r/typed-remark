import { Processor, Attacher } from 'typed-unified'
import { RemarkParserOptions, RemarkParser } from './RemarkParser'

const RemarkParseAttacher: Attacher<RemarkParserOptions> = function (this: Processor, options: RemarkParserOptions) {
  this.Parser = class ClonedParser extends RemarkParser {}
  this.Parser.prototype.options = Object.assign({}, RemarkParser.prototype.options, options)
}

export default RemarkParseAttacher
