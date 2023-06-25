import type { PropsWithChildren } from 'react'

import { Container } from './Container'

export default (props: PropsWithChildren) => {
  return <Container>{props.children}</Container>
}
