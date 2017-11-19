import { gh } from '../util/gh'
import { usernameEnd } from '../util/usernameEnd'
import { Node } from 'typed-unist'
import { TokenizeMethod, Eat } from 'typed-remark-parse'
import { RemarkGithubParser } from '..'
import { locateMention } from '../locator/mention'

const own = {}.hasOwnProperty

const C_SLASH = '/'
const C_AT = '@'

const CC_SLASH = C_SLASH.charCodeAt(0)
const CC_AT = C_AT.charCodeAt(0)

/* Map of overwrites for at-mentions.
 * GitHub does some fancy stuff with `@mention`, by linking
 * it to their blog-post introducing the feature.
 * To my knowledge, there are no other magical usernames. */
const OVERWRITES = {
  mention: 'blog/821',
  mentions: 'blog/821',
}

/* Tokenise a mention. */
export const mention: TokenizeMethod = function (this: RemarkGithubParser, eat: Eat, value: string, silent?: boolean): Node | boolean | void {
  const self = this
  let index
  let subvalue
  let handle
  let href
  let node
  let exit
  let now

  if (value.charCodeAt(0) !== CC_AT) {
    return
  }

  index = usernameEnd(value, 1)

  if (index === -1) {
    return
  }

  /* Support teams. */
  if (value.charCodeAt(index) === CC_SLASH) {
    index = usernameEnd(value, index + 1)

    if (index === -1) {
      return
    }
  }

  /* istanbul ignore if - maybe used by plug-ins */
  if (silent) {
    return true
  }

  now = eat.now()
  handle = value.slice(1, index)
  subvalue = C_AT + handle

  href = gh()
  href += own.call(OVERWRITES, handle) ? OVERWRITES[handle] : handle

  now.column++

  exit = self.enterLink()

  node = eat(subvalue)({
    type: 'link',
    title: null,
    url: href,
    children: self.tokenizeInline(subvalue, now),
  } as Node)

  exit()

  if (self.githubOptions.mentionStrong !== false) {
    node.children = [{
      type: 'strong',
      children: node.children,
    }]
  }

  return node
} as TokenizeMethod

mention.locator = locateMention
mention.notInLink = true
