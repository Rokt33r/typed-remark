import { Processor, Attacher } from 'typed-unified'
import { RemarkParserOptions, parserFactory } from './RemarkParser'

const RemarkParseAttacher: Attacher<RemarkParserOptions> = function (this: Processor, options: RemarkParserOptions) {
  this.Parser = parserFactory()
  this.Parser.prototype.options = Object.assign({}, this.Parser.prototype.options, options)
}

export default RemarkParseAttacher
