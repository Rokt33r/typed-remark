import { RemarkCompiler } from '../RemarkCompiler'

export function lineBreak (this: RemarkCompiler) {
  return this.options.commonmark
    ? '\\\n'
    : '  \n'
}
