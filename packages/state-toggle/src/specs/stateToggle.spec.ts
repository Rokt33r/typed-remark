import { stateToggleFactory } from '../lib'
interface Context {
  on: boolean
  enter: () => () => void
}

describe('stateToggleFactory', () => {
  it('works without context', () => {
    const ctx = {on: false} as Context

    ctx.enter = stateToggleFactory<Context>('on', ctx.on)

    expect(ctx.on).toBe(false)

    const exit = ctx.enter()
    expect(ctx.on).toBe(true)

    exit()
    expect(ctx.on).toBe(false)
  })

  it('works with context', () => {
    const ctx = {on: false}

    const enter = stateToggleFactory('on', ctx.on, ctx)

    expect(ctx.on).toBe(false)

    const exit = enter()
    expect(ctx.on).toBe(true)

    exit()
    expect(ctx.on).toBe(false)
  })

  it('keeps initial state', () => {
    const ctx = {on: 1}

    const enter = stateToggleFactory('on', false, ctx)

    expect(ctx.on).toBe(1)

    const exit = enter()
    expect(ctx.on).toBe(true)

    exit()
    expect(ctx.on).toBe(1)
  })

  it('works with multiple state', () => {
    const ctx = {on: false}
    const enter = stateToggleFactory('on', ctx.on, ctx)

    expect(ctx.on).toBe(false)

    const exitA = enter()
    expect(ctx.on).toBe(true)

    const exitB = enter()
    expect(ctx.on).toBe(true)

    exitB()
    expect(ctx.on).toBe(true)

    exitA()
    expect(ctx.on).toBe(false)
  })
})
