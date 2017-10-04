import * as path from 'path'
import * as buffer from 'buffer'
import {
  stringify
} from 'typed-unist-util-stringify-position'
import {
  Point,
  Position,
  Node,
} from 'typed-unist'
import { replaceExt } from './replaceExt'
import {
  assertNonEmpty,
  assertPart,
  assertPathExists,
} from './assert'
import { VMessage } from './VFileMessage'

export interface VFileOptions {
  contents: Buffer | string | null
  cwd: string
  path: string
  basename: string
  stem: string
  extname: string
  dirname: string
  history: string[]
  messages: VMessage[]
  data: any
}

export class VFile {
  public contents: Buffer | string
  public cwd: string
  public path: string
  public basename: string
  public stem: string
  public extname: string
  public dirname: string
  public history: string[]
  public messages: VMessage[]
  public data: any

  constructor (input?: Partial<VFileOptions> | string | Buffer) {
    this.data = {}
    this.messages = []
    this.history = []
    this.cwd = process.cwd()

    // Resolve options by input
    const options: Partial<VFileOptions> = !input
      ? {}
      : typeof input === 'string' || Buffer.isBuffer(input)
      ? { contents: input }
      : input

    // Location related props. These props must be set by this order.
    // history -> path -> basename -> stem  -> extname -> dirname
    if (options.history) this.history = options.history
    if (options.path) this.path = options.path
    if (options.basename) this.basename = options.basename
    if (options.stem) this.stem = options.stem
    if (options.extname) this.extname = options.extname
    if (options.dirname) this.dirname = options.dirname

    // Set non-path related properties
    if (options.data) this.data = options.data
    if (options.messages) this.messages = options.messages
    if (options.cwd) this.cwd = options.cwd
    if (options.contents) this.contents = options.contents
  }

  public toString (encoding?: string): string {
    const value = this.contents || ''

    return Buffer.isBuffer(value)
      ? value.toString(encoding)
      : String(value)
  }

  public message (reason: string | Error, position?: Point | Position | Node, ruleId?: string): VMessage {
    const filePath = this.path
    const range = stringify(position)
    let location: Position = {
      start: {line: null, column: null},
      end: {line: null, column: null},
    }

    if (position && (position as Node).position) {
      position = (position as Node).position
    }

    if (position) {
      /* Location. */
      if ((position as Position).start) {
        location = position as Position
      } else {
        location.start = position as Point
      }
    }

    const error = new VMessage({
      name: (filePath ? filePath + ':' : '') + range,
      file: filePath,
      reason: (reason as Error).message || (reason as string),
      location,
      line: location.start.line,
      column:  location.start.column,
      ruleId,
      fatal: false,
    })

    if ((reason as Error).stack) {
      error.stack = (reason as Error).stack
    }

    this.messages.push(error)

    return error
  }

  public info (reason: string | Error, position?: Point | Position | Node, ruleId?: string): VMessage {
    const error = this.message(reason, position, ruleId)
    error.fatal = null

    return error
  }

  public fail (reason: string | Error, position?: Point | Position | Node, ruleId?: string) {
    const error = this.message(reason, position, ruleId)
    error.fatal = true

    throw error
  }
}

/* Access full path (`~/index.min.js`). */
Object.defineProperty(VFile.prototype, 'path', {
  get (this: VFile) {
    return this.history[this.history.length - 1]
  },
  set (this: VFile, value: string) {
    assertNonEmpty(value, 'path')

    if (value !== this.path) {
      this.history.push(value)
    }
  },
})

/* Access parent path (`~`). */
Object.defineProperty(VFile.prototype, 'dirname', {
  get (this: VFile) {
    return typeof this.path === 'string'
      ? path.dirname(this.path)
      : undefined
  },
  set (this: VFile, dirname: string) {
    assertPathExists(this.path, 'dirname')
    this.path = path.join(dirname || '', this.basename)
  },
})

/* Access basename (`index.min.js`). */
Object.defineProperty(VFile.prototype, 'basename', {
  get (this: VFile) {
    return typeof this.path === 'string'
      ? path.basename(this.path)
      : undefined
  },
  set (this: VFile, basename) {
    assertNonEmpty(basename, 'basename')
    assertPart(basename, 'basename')
    this.path = path.join(this.dirname || '', basename)
  },
})

/* Access extname (`.js`). */
Object.defineProperty(VFile.prototype, 'extname', {
  get (this: VFile) {
    return typeof this.path === 'string'
      ? path.extname(this.path)
      : undefined
  },
  set (this: VFile, extname: string) {
    const ext = extname || ''

    assertPart(ext, 'extname')
    assertPathExists(this.path, 'extname')

    if (ext) {
      if (ext.charAt(0) !== '.') {
        throw new Error('`extname` must start with `.`')
      }

      if (ext.indexOf('.', 1) !== -1) {
        throw new Error('`extname` cannot contain multiple dots')
      }
    }

    this.path = replaceExt(this.path, ext)
  },
})

/* Access stem (`index.min`). */
Object.defineProperty(VFile.prototype, 'stem', {
  get (this: VFile) {
    return typeof this.path === 'string'
      ? path.basename(this.path, this.extname)
      : undefined
  },
  set (this: VFile, stem: string) {
    assertNonEmpty(stem, 'stem')
    assertPart(stem, 'stem')
    this.path = path.join(this.dirname || '', stem + (this.extname || ''))
  },
})
