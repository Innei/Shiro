'use client'

import { load } from 'js-yaml'
import { m } from 'motion/react'
import { useTranslations } from 'next-intl'
import { memo, useCallback, useMemo, useState } from 'react'

import { LazyLoad } from '~/components/common/Lazyload'
import { CommentModal } from '~/components/modules/shared/CommentModal'
import { ImageLoadStatus } from '~/components/ui/image/ZoomedImage'
import { useModalStack } from '~/components/ui/modal'
import { MAIN_CONTENT_ID } from '~/constants/dom-id'
import { clsxm } from '~/lib/helper'
import { useCurrentPageDataSelector } from '~/providers/page/CurrentPageDataProvider'

const ImagePlaceholder = () => (
  <div className="mb-4 flex h-64 animate-pulse items-center justify-center overflow-hidden rounded-lg bg-zinc-100 p-4" />
)

interface Equipment {
  name: string
  custom?: string
  opinion?: string
  details?: string
  posts?: string
  image?: string
  deprecated?: boolean
}

interface EquipmentClass {
  title: string
  desc?: string
  list: Equipment[]
}

export const EquipmentPage = memo(() => {
  const t = useTranslations('common')
  const tPost = useTranslations('post')
  const text = useCurrentPageDataSelector((data) => data?.text)
  const modified = useCurrentPageDataSelector((data) => data?.modified)

  const equipmentData = useMemo(() => {
    if (!text) return null
    try {
      return load(text) as EquipmentClass[]
    } catch {
      return null
    }
  }, [text])

  if (!equipmentData || !Array.isArray(equipmentData)) {
    return null
  }

  return (
    <div id={MAIN_CONTENT_ID} className="space-y-12">
      {equipmentData.map((category, categoryIndex) => (
        <section key={category.title}>
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: categoryIndex * 0.1 }}
            className="mb-6"
          >
            <h2
              id={`${categoryIndex}__${category.title}`}
              data-markdown-heading="true"
              className="group flex items-center text-2xl font-bold text-zinc-800 dark:text-zinc-100"
            >
              {category.title}
            </h2>
            {category.desc && (
              <p className="mt-2 text-zinc-500 dark:text-zinc-400">
                {category.desc}
              </p>
            )}
          </m.div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {category.list.map((item, itemIndex) => (
              <EquipmentCard
                key={item.name}
                item={item}
                index={itemIndex}
                categoryIndex={categoryIndex}
              />
            ))}
          </div>
        </section>
      ))}

      {modified && (
        <p className="text-right text-sm text-zinc-400">
          {t('last_updated')} {new Date(modified).toLocaleDateString()}
        </p>
      )}
    </div>
  )
})

EquipmentPage.displayName = 'EquipmentPage'

const EquipmentCard = memo(
  ({
    item,
    index,
    categoryIndex,
  }: {
    item: Equipment
    index: number
    categoryIndex: number
  }) => {
    const t = useTranslations('common')
    const tPost = useTranslations('post')
    const link = item.details || item.posts
    const { present } = useModalStack()
    const { id: pageId, title: pageTitle } =
      useCurrentPageDataSelector((data) => ({
        id: data?.id,
        title: data?.title,
      })) || {}

    const handleComment = () => {
      present({
        title: t('comment'),
        content: (rest) => (
          <CommentModal
            refId={pageId!}
            title={pageTitle!}
            initialValue={`> ${item.name}\n\n`}
            {...rest}
          />
        ),
      })
    }

    return (
      <m.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: categoryIndex * 0.1 + index * 0.05 }}
        className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white p-4 shadow-xs transition-all duration-300 hover:shadow-lg dark:border-zinc-700 dark:bg-zinc-800/50"
      >
        {item.image && (
          <EquipmentImage
            src={item.image}
            alt={item.name}
            deprecated={item.deprecated}
          />
        )}

        <div className="flex-1 space-y-2">
          <h3
            className={clsxm(
              'font-semibold text-zinc-800 dark:text-zinc-100',
              item.deprecated && 'line-through',
            )}
          >
            {item.name}
          </h3>

          {item.custom && (
            <p
              className={clsxm(
                'text-sm text-zinc-500 dark:text-zinc-400',
                item.deprecated && 'line-through',
              )}
            >
              {item.custom}
            </p>
          )}

          {item.opinion && (
            <p
              className={clsxm(
                'line-clamp-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300',
                item.deprecated && 'line-through',
              )}
            >
              {item.opinion}
            </p>
          )}
        </div>

        <div className="mt-3 flex items-center gap-2">
          {link && (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit items-center rounded-lg bg-accent/10 px-3 py-1.5 text-sm text-zinc-500 no-underline transition-all duration-300 hover:text-accent sm:bg-transparent sm:text-transparent sm:hover:bg-accent/10 sm:hover:text-accent"
            >
              {link.includes('/posts/')
                ? tPost('view_article')
                : tPost('details')}
            </a>
          )}
          <button
            onClick={handleComment}
            className="ml-auto inline-flex items-center rounded-lg bg-accent/10 p-2 text-zinc-500 transition-all duration-300 hover:text-accent sm:bg-transparent sm:text-transparent sm:hover:bg-accent/10 sm:hover:text-accent"
            title={t('comment')}
          >
            <i className="i-mingcute-chat-3-line text-lg" />
          </button>
        </div>
      </m.div>
    )
  },
)

EquipmentCard.displayName = 'EquipmentCard'

const EquipmentImage = memo(
  ({
    src,
    alt,
    deprecated,
  }: {
    src: string
    alt: string
    deprecated?: boolean
  }) => {
    const t = useTranslations('common')
    const [status, setStatus] = useState(ImageLoadStatus.Loading)

    const handleLoad = useCallback(() => setStatus(ImageLoadStatus.Loaded), [])
    const handleError = useCallback(() => setStatus(ImageLoadStatus.Error), [])

    return (
      <LazyLoad placeholder={<ImagePlaceholder />} triggerOnce offset={100}>
        <div className="group/image relative mb-4 flex h-64 items-center justify-center overflow-hidden rounded-lg bg-zinc-100 p-4">
          {status === ImageLoadStatus.Loading && (
            <div className="absolute inset-0 animate-pulse bg-zinc-100" />
          )}
          {status === ImageLoadStatus.Error && (
            <div className="flex flex-col items-center gap-2 text-zinc-400">
              <i className="i-mingcute-image-line text-3xl" />
              <span className="text-sm">{t('loading_failed')}</span>
            </div>
          )}
          <img
            src={src}
            alt={alt}
            onLoad={handleLoad}
            onError={handleError}
            className={clsxm(
              'size-auto max-h-64 max-w-full transition-all duration-300',
              status === ImageLoadStatus.Loaded
                ? 'opacity-100 group-hover/image:scale-105'
                : 'opacity-0 absolute',
            )}
          />
          {deprecated && <div className="absolute inset-0 bg-zinc-500/40" />}
        </div>
      </LazyLoad>
    )
  },
)

EquipmentImage.displayName = 'EquipmentImage'
