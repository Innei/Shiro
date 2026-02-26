import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import type { PropsWithChildren } from 'react'

export const generateMetadata = async (
  props: NextPageParams<{ locale: string }>,
): Promise<Metadata> => {
  const { locale } = await props.params
  const t = await getTranslations({
    namespace: 'common',
    locale,
  })
  return {
    title: t('page_title_project_detail'),
  }
}
export default function Page(props: PropsWithChildren) {
  return props.children
}
