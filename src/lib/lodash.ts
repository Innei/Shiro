export const debounce = <F extends (...args: any[]) => any>(
  func: F,
  wait: number,
  immediate = false,
): ((...args: Parameters<F>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout> | undefined

  return function (this: any, ...args: Parameters<F>) {
    const doLater = () => {
      timeoutId = undefined
      if (!immediate) {
        func.apply(this, args)
      }
    }

    const shouldCallNow = immediate && timeoutId === undefined

    if (timeoutId !== undefined) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(doLater, wait)

    if (shouldCallNow) {
      func.apply(this, args)
    }
  }
}

export const throttle = <F extends (...args: any[]) => any>(
  func: F,
  wait: number,
  options: {
    leading?: boolean
    trailing?: boolean
  } = {},
): ((...args: Parameters<F>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout> | undefined
  let lastArgs: Parameters<F> | undefined
  let lastCallTime: number | undefined

  const doLater = () => {
    timeoutId = undefined
    if (lastArgs !== undefined) {
      func.apply(this, lastArgs)
      lastArgs = undefined
      lastCallTime = Date.now()
      timeoutId = setTimeout(doLater, wait)
    }
  }

  return function (this: any, ...args: Parameters<F>) {
    const currentTime = Date.now()

    if (lastCallTime === undefined && options.leading === false) {
      lastCallTime = currentTime
    }

    const remainingTime = wait - (currentTime - (lastCallTime ?? 0))

    if (remainingTime <= 0 || remainingTime > wait) {
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId)
      }
      func.apply(this, args)
      lastCallTime = currentTime
      timeoutId = setTimeout(doLater, wait)
    } else if (options.trailing !== false) {
      lastArgs = args
      if (timeoutId === undefined) {
        timeoutId = setTimeout(doLater, remainingTime)
      }
    }
  }
}

export const isUndefined = (val: any): val is undefined => val === undefined

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

export const sample = <T>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)]

export const shuffle = <T>(arr: T[]): T[] => {
  const result = [...arr]
  for (let i = 0; i < result.length; i++) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = result[i]
    result[i] = result[j]
    result[j] = temp
  }
  return result
}

export const isShallowEqualArray = <T>(arr1: T[], arr2: T[]): boolean => {
  if (arr1.length !== arr2.length) {
    return false
  }

  for (const [i, element] of arr1.entries()) {
    if (!Object.is(element, arr2[i])) {
      return false
    }
  }

  return true
}

export const merge = <T extends object, U extends object>(
  ...objs: (T | U)[]
): T & U => {
  const result: any = {}

  for (const obj of objs) {
    for (const key in obj) {
      result[key] = (obj as any)[key]
    }
  }

  return result
}

export function uniqBy<T, K>(array: T[], iteratee: (item: T) => K): T[] {
  const seen = new Set<K>()
  return array.filter((item) => {
    const key = iteratee(item)
    if (!seen.has(key)) {
      seen.add(key)
      return true
    }
    return false
  })
}

export function get(target: object, path: string) {
  const keys = path.split('.')
  let result = target as any
  for (const key of keys) {
    result = result[key]
    if (result === undefined) {
      return result
    }
  }
  return result
}

export const uniq = <T>(arr: T[]): T[] => Array.from(new Set(arr))

export const omit = <T extends object, K extends keyof T>(
  obj: T,
  ...keys: K[]
): Omit<T, K> => {
  const result = { ...obj }
  for (const key of keys) {
    delete result[key]
  }
  return result
}
