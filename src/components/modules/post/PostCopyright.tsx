'use client'

import dayjs from 'dayjs'
import type { FC } from 'react'

import { Divider } from '~/components/ui/divider'
import { toast } from '~/lib/toast'
import { useCurrentPostDataSelector } from '~/providers/post/CurrentPostDataProvider'
import { useAggregationSelector } from '~/providers/root/aggregation-data-provider'

export const PostCopyright: FC = () => {
  const name = useAggregationSelector((data) => data.user.name)

  const webUrl = useAggregationSelector((data) => data.url.webUrl)
  const data = useCurrentPostDataSelector(
    (data) => {
      if (!webUrl) return null
      if (!data) return null
      return {
        title: data.title,
        link: `${webUrl}/posts/${data.category.slug}/${data.slug}`,
        date: data.modified,
      }
    },
    [webUrl],
  )
  if (!data) return null
  const { title, link, date } = data
  return (
    <section
      className="mt-4 text-sm leading-loose text-gray-600 dark:text-neutral-400"
      id="copyright"
    >
      <p>文章标题：{title}</p>
      <p>文章作者：{name}</p>
      <p>
        文章链接：<span>{link}</span>{' '}
        <a
          onClick={() => {
            navigator.clipboard.writeText(link)
            toast.success('已复制文章链接')
          }}
          data-hide-print
          className="cursor-pointer select-none"
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
          商业转载请联系站长获得授权，非商业转载请注明本文出处及文章链接，您可以自由地在任何媒体以任何形式复制和分发作品，也可以修改和创作，但是分发衍生作品时必须采用相同的许可协议。
          <br />
          本文采用
          <a
            className="shiro-link--underline"
            href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh"
          >
            知识共享署名 - 非商业性使用 - 相同方式共享 4.0 国际许可协议
          </a>
          进行许可。
        </p>
      </div>
    </section>
  )
}
