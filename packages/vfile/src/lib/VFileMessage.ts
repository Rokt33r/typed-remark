import { Position } from 'typed-unist'

export interface VMessageParams {
  name: string
  file: string
  reason: string
  ruleId?: string
  source?: string
  stack?: string
  fatal?: boolean
  line?: number
  column?: number
  location?: Position
}

export class VMessage {
  public name: string
  public file: string
  public reason: string
  public message: string
  public ruleId?: string
  public source?: string
  public stack?: string
  public fatal?: boolean
  public line?: number
  public column?: number
  public location?: Position

  constructor (params: VMessageParams) {
    Object.assign(this, params)
    this.message = params.reason
  }

  public toString () {
    return `${this.name}: ${this.message}`
  }
}

VMessage.prototype.file = ''
VMessage.prototype.name = ''
VMessage.prototype.reason = ''
VMessage.prototype.message = ''
VMessage.prototype.stack = ''
VMessage.prototype.fatal = null
VMessage.prototype.column = null
VMessage.prototype.line = null
