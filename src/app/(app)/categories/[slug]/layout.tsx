import type { Metadata } from 'next'

import { NormalContainer } from '~/components/layout/container/Normal'

import { getData } from './api'

export const dynamic = 'force-dynamic'
export const generateMetadata = async (
  props: NextPageParams<{
    slug: string
  }>,
) => {
  const params = await props.params
  const data = await getData(params).catch(() => null)

  if (!data) {
    return {}
  }

  return {
    title: `分类 · ${data.name}`,
  } satisfies Metadata
}
export default async function Layout(
  props: NextPageParams<{
    slug: string
  }>,
) {
  return <NormalContainer>{props.children}</NormalContainer>
}
