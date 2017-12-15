import { Processor, Attacher } from 'typed-unified'
import {
  compilerFactory,
  RemarkStringifyOptions,
} from './RemarkCompiler'

const RemarkStringifyAttacher: Attacher<RemarkStringifyOptions> = function (this: Processor, options: RemarkStringifyOptions) {
  this.Compiler = compilerFactory()
  this.Compiler.prototype.options = Object.assign({}, this.Compiler.prototype.options, options)
}

export default RemarkStringifyAttacher
