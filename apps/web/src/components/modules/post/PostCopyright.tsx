'use client'

import { useFormatter, useTranslations } from 'next-intl'
import type { FC } from 'react'

import { Divider } from '~/components/ui/divider'
import { FloatPopover } from '~/components/ui/float-popover'
import { toast } from '~/lib/toast'
import { useCurrentPostDataSelector } from '~/providers/post/CurrentPostDataProvider'
import { useAggregationSelector } from '~/providers/root/aggregation-data-provider'


export const PostCopyright: FC = () => {
  const t = useTranslations('post')
  const tCommon = useTranslations('common')
  const format = useFormatter()
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
      className="mt-4 text-sm leading-loose text-zinc-600 dark:text-neutral-400"
      id="copyright"
    >
      <p>
        {t('copyright_title')}
        {title}
      </p>
      <p>
        {t('copyright_author')}
        {name}
      </p>
      <p>
        {t('copyright_link')}
        <span>{link}</span>{' '}
        <a
          onClick={() => {
            navigator.clipboard.writeText(link)
            toast.success(tCommon('copy_article_link'))
          }}
          data-hide-print
          className="cursor-pointer select-none"
        >
          {t('copyright_copy')}
        </a>
      </p>
      <p>
        {t('copyright_modified')}{' '}
        {date
          ? format.dateTime(new Date(date), {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
            })
          : tCommon('no_modification')}
      </p>
      <Divider />
      <div>
        <p>
          {t('copyright_license_text')}
          <br />
          {t('copyright_license_prefix')}{' '}
          <FloatPopover
            asChild
            mobileAsSheet
            type="tooltip"
            triggerElement={
              <a
                className="shiro-link--underline"
                href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
                target="_blank"
                rel="noreferrer"
              >
                CC BY-NC-SA 4.0 - 非商业性使用 - 相同方式共享 4.0 国际
              </a>
            }
          >
            {t('copyright_license_tooltip')}
          </FloatPopover>
          {t('copyright_license_suffix')}
        </p>
      </div>
    </section>
  )
}
