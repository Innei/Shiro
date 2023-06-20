'use client'

import { StyledButton } from '~/components/ui/button'

export default () => {
  return (
    <StyledButton
      onClick={() => {
        Promise.resolve().then(() => {
          throw new Error('Promise rejection')
        })
        // @ts-expect-error
        globalThis.methodDoesNotExist()
      }}
    >
      Break the world
    </StyledButton>
  )
}
