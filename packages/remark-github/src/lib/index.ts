import { Attacher } from 'typed-unified'
import { Node } from 'typed-unist'
import { visit } from 'typed-unist-util-visit'
import { RemarkParser } from 'typed-remark-parse'
import { parseLink, LinkTypes } from './util/parseLink'
import { abbreviate } from './util/abbreviate'
import { repoReference } from './tokenize/repo'
import { mention } from './tokenize/mention'
import { issue } from './tokenize/issue'
import { hash } from './tokenize/hash'

export interface Repository {
  user: string
  project: string
}

export interface RemarkGithubOptions {
  mentionStrong: boolean
  repository: Repository | string
}

export interface RemarkGithubParser extends RemarkParser {
  githubRepo: Repository
  githubOptions: RemarkGithubOptions
}

export interface Link {
  user?: string
  project?: string
  page?: string
  reference?: string
  comment?: boolean
}

/* Hide process use from browserify. */
const proc = typeof global !== 'undefined' && global.process

/* Load `fs` and `path` if available. */
let fs: any
let path: any

try {
  fs = require('fs')
  path = require('path')
} catch (err) {
  // Do nothing.
}

/* Username may only contain alphanumeric characters or
 * single hyphens, and cannot begin or end with a hyphen.
 *
 * `PERSON` is either a user or an organization, but also
 * matches a team:
 *
 *   https://github.com/blog/1121-introducing-team-mentions
 */
const NAME = '(?:[a-z0-9]{1,2}|[a-z0-9][a-z0-9-]{1,37}[a-z0-9])'
const USER = '(' + NAME + ')'
const PROJECT = '((?:[a-z0-9-]|\\.git[a-z0-9-]|\\.(?!git))+)'
const REPO = USER + '\\/' + PROJECT

/* Match a repo from a git / github URL. */
const REPOSITORY = new RegExp('(?:^|/(?:repos/)?)' + REPO + '(?=\\.git|[\\/#@]|$)', 'i')

const github: Attacher<RemarkGithubOptions> = function (options: RemarkGithubOptions) {
  const settings = options || {}
  let repositoryOrURL: Repository | string = settings.repository
  let repository: Repository
  const proto = this.Parser.prototype
  const scope = proto.inlineTokenizers
  const methods = proto.inlineMethods
  let pack

  /* Get the repository from `package.json`. */
  if (!repositoryOrURL) {
    try {
      pack = JSON.parse(fs.readFileSync(path.join((proc as NodeJS.Process).cwd(), 'package.json')))
    } catch (err) {
      pack = {}
    }

    if (pack.repository) {
      repositoryOrURL = pack.repository.url || pack.repository
    } else {
      repositoryOrURL = ''
    }
  }

  /* Parse the URL: See the tests for all possible kinds. */
  const repositoryMatch = REPOSITORY.exec(repositoryOrURL as string)

  REPOSITORY.lastIndex = 0

  if (!repositoryMatch) {
    throw new Error('Missing `repository` field in `options`')
  }

  repository = {user: repositoryMatch[1], project: repositoryMatch[2]}

  /* Add helpers. */
  proto.githubRepo = repository
  proto.githubOptions = settings

  /* Add tokenizers to the `Parser`. */
  scope.mention = mention
  scope.issue = issue
  scope.hash = hash
  scope.repoReference = repoReference

  /* Specify order (just before `inlineText`). */
  methods.splice(methods.indexOf('inlineText'), 0,
    'mention',
    'issue',
    'hash',
    'repoReference',
  )

  return transformer

  function transformer (tree: Node) {
    visit(tree, 'link', visitor)
  }

  function visitor (node: Node) {
    const link = parseLink(node)
    let children
    let base
    let comment

    if (!link) {
      return
    }

    comment = link.comment ? ' (comment)' : ''

    if (link.project !== repository.project) {
      base = link.user + '/' + link.project
    } else if (link.user === repository.user) {
      base = ''
    } else {
      base = link.user
    }

    if (link.page === LinkTypes.COMMIT) {
      children = []

      if (base) {
        children.push({type: 'text', value: base + '@'})
      }

      children.push({type: 'inlineCode', value: abbreviate(link.reference as string)})

      if (link.comment) {
        children.push({type: 'text', value: comment})
      }
    } else {
      base += '#'

      children = [{
        type: 'text',
        value: base + abbreviate(link.reference as string) + comment,
      }]
    }

    node.children = children
  }
}

export default github
