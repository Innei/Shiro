import type { PropsWithChildren } from 'react'

import { Container } from './Container'

export default async ({ children }: PropsWithChildren) => (
  <Container>{children}</Container>
)
