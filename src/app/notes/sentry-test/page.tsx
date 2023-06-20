'use client'
export default () => {
  return (
    // @ts-expect-error
    <button onClick={() => globalThis.methodDoesNotExist()}>
      Break the world
    </button>
  )
}
