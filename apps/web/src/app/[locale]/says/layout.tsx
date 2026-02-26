import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import type { PropsWithChildren } from 'react'

import { WiderContainer } from '~/components/layout/container/Wider'

export const generateMetadata = async (
  props: NextPageParams<{ locale: string }>,
): Promise<Metadata> => {
  const { locale } = await props.params
  const t = await getTranslations({
    namespace: 'common',
    locale,
  })
  return {
    title: t('page_title_says'),
    alternates: {
      types: {
        'application/rss+xml': [
          {
            url: 'says/feed',
            title: `${t('page_title_says')} - ${t('rss_subscribe')}`,
          },
        ],
      },
    },
  }
}
export default async function Layout(props: PropsWithChildren) {
  return <WiderContainer>{props.children}</WiderContainer>
}
