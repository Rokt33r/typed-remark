import { VFile } from 'typed-vfile'
import { Point } from 'typed-unist'

export default class VFileLocation {
  private content: string
  private indicesOfLineBreaks: number[]

  constructor (doc: string | Buffer | VFile) {
    this.content = String(doc)
    this.indicesOfLineBreaks = this.getIndiciesOfLineBreaks()
  }

  private getIndiciesOfLineBreaks () {
    const result = []
    let index = this.content.indexOf('\n')

    while (index !== -1) {
      result.push(index + 1)
      index = this.content.indexOf('\n', index + 1)
    }

    result.push(this.content.length + 1)

    return result
  }

  public toPosition (offset: number): Point {
    let index = -1
    const length = this.indicesOfLineBreaks.length

    if (offset < 0) {
      throw new Error(`Invalid Offset: offset must be positive number`)
    }

    while (++index < length) {
      if (this.indicesOfLineBreaks[index] > offset) {
        return {
          line: index + 1,
          column: (offset - (this.indicesOfLineBreaks[index - 1] || 0)) + 1,
          offset,
        }
      }
    }

    throw new Error(`Out Of Range: the maximum length is ${length}.`)
  }

  public toOffset (position: Point): number {
    const {
      line,
      column,
    } = position

    if (!isNaN(line) && !isNaN(column) && line - 1 in this.indicesOfLineBreaks) {
      return ((this.indicesOfLineBreaks[line - 2] || 0) + column - 1) || 0
    }

    return -1
  }
}
