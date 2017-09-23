import * as extend from 'extend'
import { VFile } from 'typed-vfile'
import { Node } from 'typed-unist'
import {
  assertUnfrozen,
  assertParser,
  assertCompiler,
  throwAsyncTransformError,
  isPromise,
  isNewable,
} from './utils'

const slice = Array.prototype.slice
const hasOwnProperty = Object.prototype.hasOwnProperty

/**
 * Extending processor
 *
 * @export
 * @interface Attacher
 * @template O Options for Attacher
 */
export interface Attacher<O> {
  (this: Processor, options: O): Transformer | void
}

/**
 * Alias of Attacher
 */
export type Plugin<O> = Attacher<O>
export type PluginOptionsPair<O> = [Attacher<O>, O]
/**
 * The below typings are used later
 */
// export type PluginList = Array<Plugin<any> | PluginOptionsPair<any> | PluginPreset>
// export interface PluginPreset {
//   plugins?: PluginList
//   settings?: {
//     [key: string]: any
//   }
// }
// export type Usable = Plugin<any> | PluginOptionsPair<any> | PluginList | PluginPreset

export interface Transformer {
  (node: Node, file: VFile): Node | Promise<Node> | void | Promise<void>
}

export interface ParserFunction {
  (input: string, file: VFile): Node
}

export interface ParserConstructor {
  new (input: string, file: VFile): ParserInstance
}

export interface ParserInstance {
  parse: () => Node
}

export type Parser = ParserFunction | ParserConstructor

export interface CompilerFunction {
  (input: Node, file: VFile): string
}

export interface CompilerConstructor {
  new (input: Node, file: VFile): CompilerInstance
}

export interface CompilerInstance {
  compile: () => string
}

export type Compiler = CompilerFunction | CompilerConstructor

export type Doc = string | Buffer | VFile

export class Processor {
  public attachers: PluginOptionsPair<any>[] = []
  private transformers: Transformer[] = []
  public namespace: {
    settings?: {}
    [key: string]: any
  } = {}
  public frozen: boolean
  public Parser: Parser
  public Compiler: Compiler

  // We should avoid using overloading
  public use <O>(plugin: Attacher<O>, options?: O): this {
    assertUnfrozen('use', this.frozen)

    this.attachers.push([plugin, options])

    return this
  }

  public freeze (): this {
    if (this.frozen) {
      return this
    }

    this.attachers.forEach(([attacher, options]) => {
      const transformer = attacher.apply(this, options)
      // Trnasformer is optional
      if (transformer) {
        this.transformers.push(transformer)
      }
    })

    this.frozen = true

    return this
  }

  public parse (doc: Doc) {
    this.freeze()

    assertParser('parse', this.Parser)

    const file = new VFile(doc)

    if (isNewable(this.Parser)) {
      return new (this.Parser as ParserConstructor)(String(file), file).parse()
    }

    return (this.Parser as ParserFunction)(String(file), file)
  }

  public stringify (node: Node, file?: VFile) {
    this.freeze()

    assertCompiler('stringify', this.Compiler)

    const aFile = new VFile(file)

    if (isNewable(this.Compiler)) {
      return new (this.Compiler as CompilerConstructor)(node, aFile).compile()
    }

    return (this.Compiler as CompilerFunction)(node, file)
  }

  public async run (node: Node, file?: VFile): Promise<Node> {
    this.freeze()

    for (const transformer of this.transformers) {
      const nextNode = await transformer(node, file)
      if (nextNode) node = nextNode
    }

    return node
  }

  public runSync (node: Node, file?: VFile): Node {
    this.freeze()

    for (const transformer of this.transformers) {
      const nextNode = transformer(node, file) as Node
      if (isPromise(nextNode)) throwAsyncTransformError('runSync', 'run')
      if (nextNode) node = nextNode
    }

    return node
  }

  public async process (doc: Doc): Promise<VFile> {
    this.freeze()

    const file = new VFile(doc)

    let node = this.parse(doc)
    node = await this.run(node, file)
    file.contents = this.stringify(node, file)

    return file
  }

  public processSync (doc: Doc): VFile {
    this.freeze()

    const file = new VFile(doc)

    let node = this.parse(doc)
    node = this.runSync(node, file)
    file.contents = this.stringify(node, file)

    return file
  }

  public clone (): Processor {
    // Instantiate new instance
    const cloned = new Processor()

    // Apply all attachers
    this.attachers.forEach(([plugin, options]) => cloned.use(plugin, options))

    // Apply data
    cloned.data(this.namespace)

    return cloned
  }

  /**
   * Getter and Setter for data
   *
   * 1. If got a key(string) and a value as arguments, set the value to the key.
   * 2. If got a key(string), return the value for the key
   * 3. If got a namespace(object), overwrite namespace(e.g. data)
   * 4. If got nothing, return namespace
   *
   * @returns {{}}
   * @memberof Unified
   */
  public data (): {}
  public data (value: {}): this
  public data (key: string, value: any): this
  public data (keyOrValue?: string | {}, value?: any): any {
    if (typeof keyOrValue === 'string') {
      if (arguments.length > 1) {
        assertUnfrozen('data', this.frozen)
        this.namespace[keyOrValue] = value
        return this
      } else {
        return this.namespace[keyOrValue]
      }
    }

    if (keyOrValue) {
      assertUnfrozen('data', this.frozen)
      this.namespace = keyOrValue as {}
      return this
    }

    return this.namespace
  }
}

export default function unified () {
  return new Processor()
}
