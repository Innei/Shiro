'use client'

import dayjs from 'dayjs'
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
  return dayjs().diff(dayjs(time), 'day') > 60 ? (
    <Banner type="warning" className="my-10">
      <span className="leading-[1.8]">
        {t('outdated_prefix')}
        <RelativeTime date={time} />
        {t('outdated_suffix')}
      </span>
    </Banner>
  ) : null
}
