const MIN_SHA_LENGTH = 7

/** Abbreviate a SHA. */
export function abbreviate (sha: string): string {
  return sha.slice(0, MIN_SHA_LENGTH)
}
