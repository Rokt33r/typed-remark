import { toString } from 'typed-mdast-util-to-string'
import { issueEnd } from './issueEnd'
import { Node } from 'typed-unist'
import { usernameEnd } from './usernameEnd'
import { shaEnd } from './shaEnd'
import { Link } from '../'

export enum LinkTypes {
  COMMIT = 'commit',
  ISSUE = 'issues',
  PULL = 'pull',
}

const GH_URL_PREFIX = 'https://github.com/'
const GH_URL_PREFIX_LENGTH = GH_URL_PREFIX.length

const CC_SLASH = '/'.charCodeAt(0)
const CC_HASH = '#'.charCodeAt(0)

/* Parse a link and determine whether it links to GitHub. */
export function parseLink (node: Node) {
  const link: Link = {}
  const url = node.url || node.href || ''
  let start
  let end
  let page

  if (
    url.slice(0, GH_URL_PREFIX_LENGTH) !== GH_URL_PREFIX ||
    node.children.length !== 1 ||
    node.children[0].type !== 'text' ||
    toString(node).slice(0, GH_URL_PREFIX_LENGTH) !== GH_URL_PREFIX
  ) {
    return
  }

  start = GH_URL_PREFIX_LENGTH
  end = usernameEnd(url, GH_URL_PREFIX_LENGTH)

  if (end === -1 || url.charCodeAt(end) !== CC_SLASH) {
    return
  }

  link.user = url.slice(start, end)

  start = end + 1
  end = usernameEnd(url, start)

  if (end === -1 || url.charCodeAt(end) !== CC_SLASH) {
    return
  }

  link.project = url.slice(start, end)

  start = end + 1
  end = url.indexOf('/', start)

  if (end === -1) {
    return
  }

  page = url.slice(start, end)

  if (page !== LinkTypes.COMMIT && page !== LinkTypes.ISSUE && page !== LinkTypes.PULL) {
    return
  }

  link.page = page
  start = end + 1

  if (page === LinkTypes.COMMIT) {
    end = shaEnd(url, start, true)
  } else {
    end = issueEnd(url, start)
  }

  if (end === -1) {
    return
  }

  link.reference = url.slice(start, end)
  link.comment = url.charCodeAt(end) === CC_HASH &&
    url.length > end + 1

  return link
}
