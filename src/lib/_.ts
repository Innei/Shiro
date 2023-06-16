export const debounce = <F extends (...args: any[]) => any>(
  func: F,
  wait: number,
  immediate = false,
): ((...args: Parameters<F>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout> | undefined

  return function (this: any, ...args: Parameters<F>) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const context = this

    const doLater = () => {
      timeoutId = undefined
      if (!immediate) {
        func.apply(context, args)
      }
    }

    const shouldCallNow = immediate && timeoutId === undefined

    if (timeoutId !== undefined) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(doLater, wait)

    if (shouldCallNow) {
      func.apply(context, args)
    }
  }
}

export const throttle = <F extends (...args: any[]) => any>(
  func: F,
  wait: number,
): ((...args: Parameters<F>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout> | undefined
  let lastArgs: Parameters<F> | undefined

  const doLater = () => {
    timeoutId = undefined
    if (lastArgs !== undefined) {
      func.apply(this, lastArgs)
      lastArgs = undefined
      timeoutId = setTimeout(doLater, wait)
    }
  }

  return function (this: any, ...args: Parameters<F>) {
    if (timeoutId === undefined) {
      func.apply(this, args)
      timeoutId = setTimeout(doLater, wait)
    } else {
      lastArgs = args
    }
  }
}

export const isUndefined = (val: any): val is undefined =>
  typeof val === 'undefined'

export const cloneDeep = <T>(val: T): T => {
  if (Array.isArray(val)) {
    return val.map(cloneDeep) as any
  } else if (typeof val === 'object' && val !== null) {
    const result: any = {}
    for (const key in val) {
      result[key] = cloneDeep(val[key])
    }
    return result
  } else {
    return val
  }
}

export const range = (start: number, end: number): number[] => {
  const result: number[] = []
  for (let i = start; i < end; i++) {
    result.push(i)
  }
  return result
}
