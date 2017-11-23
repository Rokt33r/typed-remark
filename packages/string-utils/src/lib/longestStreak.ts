/**
 * Get the count of the longest repeating streak of
 * `character` in `value`.
 */
export function longestStreak (value: string, character: string) {
  let count = 0
  let maximum = 0
  let expected
  let index

  if (character.length !== 1) {
    throw new Error('Expected character')
  }

  value = String(value)
  index = value.indexOf(character)
  expected = index

  while (index !== -1) {
    count++

    if (index === expected) {
      if (count > maximum) {
        maximum = count
      }
    } else {
      count = 1
    }

    expected = index + 1
    index = value.indexOf(character, expected)
  }

  return maximum
}
