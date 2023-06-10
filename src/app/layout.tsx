import '../styles/index.css'

import { dehydrate } from '@tanstack/react-query'
import { headers } from 'next/dist/client/components/headers'

import { queries } from '~/queries/definition'
import { getQueryClient } from '~/utils/query-client.server'
import { $axios } from '~/utils/request'

import { Providers } from '../providers/root'
import { Hydrate } from './hydrate'

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const queryClient = getQueryClient()
  const { get } = headers()
  const ua = get('user-agent')
  await queryClient.fetchQuery(queries.aggregation.root())
  $axios.defaults.headers.common['User-Agent'] = ua

  const dehydratedState = dehydrate(queryClient)
  return (
    <html lang="zh-Hans" suppressHydrationWarning>
      <head />

      <body>
        <Providers>
          <Hydrate state={dehydratedState}>{children}</Hydrate>
        </Providers>
      </body>
    </html>
  )
}
