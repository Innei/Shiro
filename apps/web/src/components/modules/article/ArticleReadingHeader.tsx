'use client'

import clsx from 'clsx'
import { AnimatePresence, m } from 'motion/react'

import { useIsMobile } from '~/atoms/hooks/viewport'
import { useCurrentPageDataSelector } from '~/providers/page/CurrentPageDataProvider'
import { useCurrentPostDataSelector } from '~/providers/post/CurrentPostDataProvider'
import { usePageScrollLocationSelector } from '~/providers/root/page-scroll-info-provider'

const ArticleReadingHeader = () => {
  const isMobile = useIsMobile()

  // 从 page 或 post 获取数据
  const pageTitle = useCurrentPageDataSelector((data) => data?.title)
  const pageSubtitle = useCurrentPageDataSelector((data) => data?.subtitle)
  const pageSlug = useCurrentPageDataSelector((data) => (data as any)?.slug)

  const postTitle = useCurrentPostDataSelector((data) => data?.title)
  const postSlug = useCurrentPostDataSelector((data) => (data as any)?.slug)
  const postCategory = useCurrentPostDataSelector((data) => data?.category)
  const postTags = useCurrentPostDataSelector((data) => data?.tags)

  // 优先使用 post 数据，其次使用 page 数据
  const title = postTitle || pageTitle
  const slug = postSlug || pageSlug
  const subtitle = pageSubtitle // post 没有 subtitle
  const category = postCategory // page 没有 category
  const tags = postTags // 只有 post 有 tags

  // 使用与原导航栏相同的阈值
  const scrollY = usePageScrollLocationSelector((y) => y)
  const threshold = 84 + 63 + 50 // 与原导航栏完全一致的阈值

  const shouldShow = scrollY > threshold

  // 解析路径 - 根据数据类型构建正确的路径
  const categorySlug = (category as any)?.slug
  const categoryName = (category as any)?.name
  // posts: /posts/{categorySlug}/{slug}, pages: /pages/{slug}
  const pathPrefix = categorySlug ? `/posts/${categorySlug}/` : '/pages/'

  // 没有副标题时，显示分类和标签
  const showCategoryAndTags =
    !subtitle && (categoryName || (tags && tags.length > 0))

  // 移动端或无标题时不显示
  if (isMobile || !title) return null

  return (
    <AnimatePresence>
      {shouldShow && (
        <m.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 30,
          }}
          className="pointer-events-none fixed top-0 left-0 right-0 z-20 w-full"
        >
          <div
            className={clsx(
              'pointer-events-auto',
              // 占据整个顶栏
              'bg-gradient-to-b from-zinc-50/95 to-white/80',
              'dark:from-zinc-900/95 dark:to-zinc-800/80',
              'backdrop-blur-md',
              'border-b border-zinc-200/50 dark:border-zinc-700/50',
              'transition-all duration-300',
              'h-[4.5rem]', // 与原导航栏高度一致
            )}
          >
            <div
              className={clsx(
                'mx-auto h-full w-full max-w-7xl px-4 lg:px-8',
                // 网格布局：头像列(4.5rem) + 标题列(1fr) + 路径列(200px，对齐TOC)
                'grid grid-cols-[4.5rem_1fr_200px] items-center',
              )}
            >
              {/* 第一列：所有者头像 */}
              <div className="flex items-center justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-accent/20 to-accent/5 dark:from-accent/10 dark:to-accent/5">
                  <i className="i-mingcute-user-2-line text-2xl text-zinc-600 dark:text-zinc-400" />
                </div>
              </div>

              {/* 第二列：副标题/分类标签（上）+ 标题（下） */}
              <div className="flex min-w-0 flex-col justify-center px-4">
                {subtitle ? (
                  // 有副标题时：副标题在上，标题在下
                  <>
                    <p
                      className={clsx(
                        'truncate text-base',
                        'text-zinc-500 dark:text-zinc-400',
                      )}
                    >
                      {subtitle}
                    </p>
                    <h2
                      className={clsx(
                        'truncate font-semibold',
                        'text-xl text-zinc-900 dark:text-zinc-100',
                      )}
                    >
                      {title}
                    </h2>
                  </>
                ) : showCategoryAndTags ? (
                  // 没有副标题时：分类/标签在上，标题在下
                  <>
                    <div className="flex items-center gap-2 text-base text-zinc-500 dark:text-zinc-400">
                      {categoryName && (
                        <span className="truncate">{categoryName}</span>
                      )}
                      {tags && tags.length > 0 && (
                        <>
                          {categoryName && <span>·</span>}
                          <span className="truncate">
                            {tags
                              .slice(0, 3)
                              .map((tag: any) => tag.name || tag)
                              .join(', ')}
                            {tags.length > 3 && ` +${tags.length - 3}`}
                          </span>
                        </>
                      )}
                    </div>
                    <h2
                      className={clsx(
                        'truncate font-semibold',
                        'text-xl text-zinc-900 dark:text-zinc-100',
                      )}
                    >
                      {title}
                    </h2>
                  </>
                ) : (
                  // 都没有时只显示标题
                  <h2
                    className={clsx(
                      'truncate font-semibold',
                      'text-xl text-zinc-900 dark:text-zinc-100',
                    )}
                  >
                    {title}
                  </h2>
                )}
              </div>

              {/* 第三列：路径 + slug */}
              <div className="flex items-center justify-end">
                <div
                  className={clsx(
                    'flex flex-col items-end text-right leading-tight',
                    'text-base',
                  )}
                >
                  {/* 上层：路径（非加粗） */}
                  <span className="text-zinc-400 dark:text-zinc-500">
                    {pathPrefix}
                  </span>
                  {/* 下层：当前 slug（加粗） */}
                  <span className="font-semibold text-zinc-600 dark:text-zinc-300">
                    {slug}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  )
}

export { ArticleReadingHeader }
