import { gh } from '../util/gh'
import { issueEnd } from '../util/issueEnd'
import { locatorFactory } from '../util/regexLocator'
import { Node } from 'typed-unist'
import { TokenizeMethod, Eat } from 'typed-remark-parse'
import { RemarkGithubParser } from '..'

const C_SLASH = '/'
const C_HASH = '#'

const CC_HASH = C_HASH.charCodeAt(0)

const PREFIX = 'gh-'

/* Tokenise an issue. */
export const issue: TokenizeMethod = function (this: RemarkGithubParser, eat: Eat, value: string, silent?: boolean): Node | boolean | void {
  const self = this
  let index
  let start
  let subvalue
  let href
  let now
  let exit
  let node

  if (value.charCodeAt(0) === CC_HASH) {
    index = 1
  } else if (value.slice(0, PREFIX.length).toLowerCase() === PREFIX) {
    index = PREFIX.length
  } else {
    return
  }

  start = index
  index = issueEnd(value, index)

  if (index === -1) {
    return
  }

  /* istanbul ignore if - maybe used by plug-ins */
  if (silent) {
    return true
  }

  now = eat.now()
  href = gh(self.githubRepo) + 'issues' + C_SLASH + value.slice(start, index)
  subvalue = value.slice(0, index)

  now.column += start

  exit = self.enterLink()

  node = eat(subvalue)({
    type: 'link',
    title: null,
    url: href,
    children: self.tokenizeInline(subvalue, now),
  } as Node)

  exit()

  return node
} as TokenizeMethod

issue.locator = locatorFactory(/\bgh-|#/gi)
issue.notInLink = true
