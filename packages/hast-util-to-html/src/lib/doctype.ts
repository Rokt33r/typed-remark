import { Doctype } from 'typed-hast'

/** Stringify a doctype `node`. */
export function doctype (ctx: any, node: Doctype): string {
  const pub = node.public
  const sys = node.system
  let val = '<!DOCTYPE'

  if (!node.name) {
    return val + '>'
  }

  val += ' ' + node.name

  if (pub != null) {
    val += ' PUBLIC ' + smart(pub)
  } else if (sys != null) {
    val += ' SYSTEM'
  }

  if (sys != null) {
    val += ' ' + smart(sys)
  }

  return val + '>'
}

function smart (value: string): string {
  const quote = value.indexOf('"') === -1 ? '"' : '\''
  return quote + value + quote
}
