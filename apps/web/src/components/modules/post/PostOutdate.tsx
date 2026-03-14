'use client'

import { differenceInDays } from 'date-fns'
import { useTranslations } from 'next-intl'

import { Banner } from '~/components/ui/banner'
import { RelativeTime } from '~/components/ui/relative-time'
import { useCurrentPostDataSelector } from '~/providers/post/CurrentPostDataProvider'

export const PostOutdate = () => {
  const t = useTranslations('post')
  const time = useCurrentPostDataSelector((s) => s?.modified)
  if (!time) {
    return null
  }
  return differenceInDays(new Date(), new Date(time)) > 60 ? (
    <Banner className="my-10" type="warning">
      <span className="leading-[1.8]">
        {t('outdated_prefix')}
        <RelativeTime date={time} />
        {t('outdated_suffix')}
      </span>
    </Banner>
  ) : null
}
