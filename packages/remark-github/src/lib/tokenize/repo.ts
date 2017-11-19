import { locateRepoReference } from '../locator/repo'
import { abbreviate } from '../util/abbreviate'
import { gh } from '../util/gh'
import { usernameEnd } from '../util/usernameEnd'
import { projectEnd as projectEndPos } from '../util/projectEnd'
import { shaEnd } from '../util/shaEnd'
import { issueEnd } from '../util/issueEnd'
import { usernameCharacter } from '../util/usernameCharacter'
import { Node } from 'typed-unist'
import { TokenizeMethod, Eat } from 'typed-remark-parse'
import { RemarkGithubParser } from '..'
import { Link } from 'typed-mdast'

const C_SLASH = '/'

const CC_SLASH = C_SLASH.charCodeAt(0)
const CC_HASH = '#'.charCodeAt(0)
const CC_AT = '@'.charCodeAt(0)

/* Tokenise a reference. */
export const repoReference: TokenizeMethod = function (this: RemarkGithubParser, eat: Eat, value: string, silent?: boolean): Node | boolean | void {
  const self = this
  let delimiter
  let href
  let index = 0
  let code
  let handle
  let handleEnd
  let project
  let projectStart
  let projectEnd
  let referenceStart
  let reference
  let subvalue
  let test
  let suffix
  let content
  let node
  let exit
  let add

  index = usernameEnd(value, index)

  if (index === -1) {
    return
  }

  handleEnd = index
  code = value.charCodeAt(index)

  if (code === CC_SLASH) {
    index++
    projectStart = index
    index = projectEndPos(value, projectStart)

    if (index === -1) {
      return
    }

    projectEnd = index
    code = value.charCodeAt(projectEnd)
  }

  if (code === CC_HASH) {
    suffix = 'issues'
    test = issueEnd
  } else if (code === CC_AT) {
    suffix = 'commit'
    test = shaEnd
  } else {
    return
  }

  delimiter = value.charAt(index)
  index++
  referenceStart = index

  index = test(value, referenceStart)

  if (index === -1 || usernameCharacter(value.charCodeAt(index))) {
    return
  }

  reference = value.slice(referenceStart, index)
  content = reference

  /* istanbul ignore if - maybe used by plug-ins */
  if (silent) {
    return true
  }

  handle = value.slice(0, handleEnd)
  project = projectEnd && value.slice(projectStart, projectEnd)
  href = gh(handle, project as string || self.githubRepo.project)
  subvalue = value.slice(0, index)
  handle += (project ? C_SLASH + project : '') + delimiter
  add = eat(subvalue)
  href += suffix + C_SLASH + reference
  exit = self.enterLink()

  if (suffix === 'commit') {
    node = add({
      type: 'link',
      title: null,
      url: href,
      children: self.tokenizeInline(handle, eat.now()),
    } as Node) as Link

    node.children.push({type: 'inlineCode', value: abbreviate(content)} as Node)
  } else {
    node = add({
      type: 'link',
      title: null,
      url: href,
      children: self.tokenizeInline(handle + content, eat.now()),
    } as Node)
  }

  exit()

  return node
} as TokenizeMethod

repoReference.locator = locateRepoReference
repoReference.notInLink = true
