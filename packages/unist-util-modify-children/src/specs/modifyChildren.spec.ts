import { modifyChildrenFactory } from '../lib'

describe('modifyChildren', () => {
  it('should invoke `fn` for each child in `parent`', () => {
    const values = [0, 1, 2, 3].map(num2Node)
    const context = {
      type: 'random',
      children: values,
    }
    let n = -1

    modifyChildrenFactory(function (child, index, parent) {
      n++
      expect(child).toBe(values[n])
      expect(index).toBe(n)
      expect(parent).toBe(context)
    })(context)
  })

  it('should work when new children are added', () => {
    const values = [0, 1, 2, 3, 4, 5, 6].map(num2Node)
    let n = -1

    modifyChildrenFactory(function (child, index, parent) {
      n++

      if (index < 3) {
        parent.children.push(num2Node(parent.children.length))
      }

      expect(child).toEqual(values[n])
      expect(index).toBe(parseInt(values[n].value, 10))
    })({type: 'random', children: [0, 1, 2, 3].map(num2Node)} as any)
  })

  it('should skip forwards', () => {
    const values = [0, 1, 2, 3].map(num2Node)
    let n = -1
    const context = {
      type: 'random',
      children: [0, 1, 3].map(num2Node),
    }

    modifyChildrenFactory(function (child, index, parent): number | void {
      expect(child).toEqual(values[++n])

      if (child.value === '1') {
        parent.children.splice(index + 1, 0, num2Node(2))
        return index + 1
      }
    })(context)

    expect(context.children).toEqual(values)
  })

  it('should skip backwards', () => {
    const invocations = [0, 1, -1, 0, 1, 2, 3].map(num2Node)
    let n = -1
    const context = {
      type: 'random',
      children: [0, 1, 2, 3].map(num2Node),
    }
    let inserted: boolean = false

    modifyChildrenFactory(function (child, index, parent): number | void {
      expect(child).toEqual(invocations[++n])

      if (!inserted && child.value === '1') {
        inserted = true
        parent.children.unshift(num2Node(-1))
        return -1
      }
    })(context)

    expect(context.children).toEqual([-1, 0, 1, 2, 3].map(num2Node))
  })
})

function num2Node (input: number) {
  return {
    type: 'text',
    value: String(input),
  }
}
