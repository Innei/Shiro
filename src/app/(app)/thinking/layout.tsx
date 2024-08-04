import type { Metadata } from 'next'
import type { PropsWithChildren } from 'react'

import { NormalContainer } from '~/components/layout/container/Normal'

export const metadata: Metadata = {
  title: 'Thoughts',
}
export default async function Layout(props: PropsWithChildren) {
  return <NormalContainer>{props.children}</NormalContainer>
}
