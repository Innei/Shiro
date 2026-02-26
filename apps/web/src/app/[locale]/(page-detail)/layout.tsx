import type { PropsWithChildren } from 'react'

import { Container } from './Container'

export default function Page(props: PropsWithChildren<unknown>) {
  return <Container>{props.children}</Container>
}
