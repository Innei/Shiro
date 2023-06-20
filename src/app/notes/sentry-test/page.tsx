'use client'

import { StyledButton } from "~/components/ui/button"

export default () => {
  return (
    // @ts-expect-error
    <StyledButton onClick={() => globalThis.methodDoesNotExist()}>
      Break the world
    </StyledButton>
  )
}
