import type { Metadata } from 'next'
import type { PropsWithChildren } from 'react'

import { NormalContainer } from '~/components/layout/container/Normal'

export const metadata: Metadata = {
  title: '朋友们',
}
export default async function (props: PropsWithChildren) {
  return <NormalContainer>{props.children}</NormalContainer>
}
