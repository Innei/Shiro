import type { Metadata } from 'next'
import type { PropsWithChildren } from 'react'

import { WiderContainer } from '~/components/layout/container/Wider'

export const metadata: Metadata = {
  title: '一言',

  alternates: {
    types: {
      'application/rss+xml': [{ url: 'says/feed', title: '一言 - RSS 订阅' }],
    },
  },
}
export default async function Layout(props: PropsWithChildren) {
  return <WiderContainer>{props.children}</WiderContainer>
}
