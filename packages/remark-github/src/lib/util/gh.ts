import { Repository } from '../'

/**
 * Return a URL to GitHub, relative to an optional `repo` object, or `user`
 * and `project`.
 */
export function gh (): string
export function gh (repo: Repository): string
export function gh (user: string, project: string): string
export function gh (repoOrUser?: string | Repository, project?: string): string {
  let base: string = 'https://github.com/'
  let repo: Repository | null = null

  if (project) {
    repo = {user: repoOrUser as string, project}
  }

  if (repo) {
    base += repo.user + '/' + repo.project + '/'
  }

  return base
}
