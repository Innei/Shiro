'use client'

import dayjs from 'dayjs'

import { Banner } from '~/components/ui/banner'
import { RelativeTime } from '~/components/ui/relative-time'
import { useCurrentPostDataSelector } from '~/providers/post/CurrentPostDataProvider'

export const PostOutdate = () => {
  const time = useCurrentPostDataSelector((s) => s?.modified)
  if (!time) {
    return null
  }
  return dayjs().diff(dayjs(time), 'day') > 60 ? (
    <Banner type="warning" className="my-10">
      <span className="leading-[1.8]">
        这篇文章上次修改于 <RelativeTime date={time} />
        ，可能部分内容已经不适用，如有疑问可询问作者。
      </span>
    </Banner>
  ) : null
}
