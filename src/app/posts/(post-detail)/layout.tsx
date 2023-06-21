import type { PropsWithChildren } from 'react'

import { Container } from './Container'

export default async ({ children }: PropsWithChildren) => {
  return <Container>{children}</Container>
}
