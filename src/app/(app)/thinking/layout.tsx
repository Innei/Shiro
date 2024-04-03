import type { Metadata } from 'next'
import type { PropsWithChildren } from 'react'

import { NormalContainer } from '~/components/layout/container/Normal'

export const metadata: Metadata = {
  title: '思考',
  alternates: {
    types: {
      'application/rss+xml': [
        { url: 'thinking/feed', title: '思考 - RSS 订阅' },
      ],
    },
  },
}
export default async function Layout(props: PropsWithChildren) {
  return <NormalContainer>{props.children}</NormalContainer>
}
