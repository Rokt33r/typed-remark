/* Count characters */
export function ccount (value: string, character: string) {
  let count = 0
  let index

  if (character.length !== 1) {
    // tslint:disable-next-line:no-console
    console.warn('character must be one length string')
    character = character.charAt(0)
  }

  index = value.indexOf(character)

  while (index !== -1) {
    count++
    index = value.indexOf(character, index + 1)
  }

  return count
}
