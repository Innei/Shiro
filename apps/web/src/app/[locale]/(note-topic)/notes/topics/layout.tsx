import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import type { PropsWithChildren } from 'react'

import { NormalContainer } from '~/components/layout/container/Normal'

export const generateMetadata = async (
  props: NextPageParams<{ locale: string }>,
): Promise<Metadata> => {
  const { locale } = await props.params
  const t = await getTranslations({
    namespace: 'common',
    locale,
  })
  return {
    title: t('page_title_topics'),
  }
}

export default async function Layout(props: PropsWithChildren) {
  return <NormalContainer>{props.children}</NormalContainer>
}
