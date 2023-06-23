import dayjs from 'dayjs'
import type { FC } from 'react'

import { Divider } from '~/components/ui/divider'
import { useCurrentPostDataSelector } from '~/providers/post/CurrentPostDataProvider'
import { useAggregationSelector } from '~/providers/root/aggregation-data-provider'

export const PostCopyright: FC = () => {
  const name = useAggregationSelector((data) => data.user.name)

  const webUrl = useAggregationSelector((data) => data.url.webUrl)
  const data = useCurrentPostDataSelector(
    (data) => {
      if (!webUrl) return null
      return {
        title: data?.title,
        link: new URL(location.pathname, webUrl).toString(),
        date: data?.modified,
      }
    },
    [webUrl],
  )
  if (!data) return null
  const { title, link, date } = data
  return (
    <section
      className="text-sm leading-loose text-gray-600 dark:text-neutral-400"
      id="copyright"
    >
      <p>文章标题：{title}</p>
      <p>文章作者：{name}</p>
      <p>
        文章链接：<span>{link}</span>{' '}
        <a
          onClick={() => {
            navigator.clipboard.writeText(link)
          }}
          data-hide-print
          className="select-none"
        >
          [复制]
        </a>
      </p>
      <p>
        最后修改时间:{' '}
        {date ? dayjs(date).format('YYYY 年 MM 月 DD 日 H:mm') : '暂没有修改过'}
      </p>
      <Divider />
      <div>
        <p>
          商业转载请联系站长获得授权，非商业转载请注明本文出处及文章链接，未经站长允许不得对文章文字内容进行修改演绎。
          <br />
          本文采用
          <a href="https://creativecommons.org/licenses/by-nc-nd/4.0/">
            创作共用保留署名 - 非商业 - 禁止演绎 4.0 国际许可证
          </a>
        </p>
      </div>
    </section>
  )
}
