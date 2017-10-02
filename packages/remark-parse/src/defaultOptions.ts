import {
  RemarkParserOptions
} from './RemarkParser'
import {
  blockElements
} from './blockElements'

export const defaultOptions: RemarkParserOptions = {
  position: true,
  gfm: true,
  commonmark: false,
  footnotes: false,
  pedantic: false,
  blocks: blockElements,
}
