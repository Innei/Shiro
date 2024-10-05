import { useInfiniteQuery } from '@tanstack/react-query'
import { produce } from 'immer'
import type { FC } from 'react'
import { useEffect, useMemo, useRef } from 'react'

import { MotionButtonBase, StyledButton } from '~/components/ui/button'
import { InjectContext, useModalStack } from '~/components/ui/modal'
import { EllipsisHorizontalTextWithTooltip } from '~/components/ui/typography'
import { routeBuilder, Routes } from '~/lib/route-builder'
import type { PostRelated } from '~/models/writing'
import { adminQueries } from '~/queries/definition'

import { SidebarSection } from '../../writing/SidebarBase'
import {
  ModelDataAtomContext,
  usePostModelDataSelector,
  usePostModelSetModelData,
} from '../data-provider'

export const RelatedPostSelector = () => {
  const related = usePostModelDataSelector((state) => state?.related)
  const setter = usePostModelSetModelData()

  const { present } = useModalStack({
    wrapper: InjectContext(ModelDataAtomContext),
  })

  return (
    <SidebarSection
      label="关联阅读"
      actions={
        <StyledButton
          variant="secondary"
          className="absolute right-0"
          onClick={() => {
            present({
              title: '选择关联阅读',
              content: () => <RealtedPostList />,
              clickOutsideToDismiss: false,
            })
          }}
        >
          新增
        </StyledButton>
      }
    >
      <div className="flex flex-col">
        {related.map((item, index) => {
          const href = routeBuilder(Routes.Post, {
            category: item.category.slug,
            slug: item.slug,
          })
          return (
            <MotionButtonBase
              onClick={() => {
                window.open(href, '_blank')
              }}
              key={index}
              className="flex items-center justify-between rounded-md p-2 duration-200 hover:bg-gray-200 dark:bg-neutral-900 dark:hover:bg-zinc-800"
            >
              <EllipsisHorizontalTextWithTooltip className="mr-2 flex-1 font-normal">
                {item.title}
              </EllipsisHorizontalTextWithTooltip>
              <MotionButtonBase
                className="-mr-2 shrink-0 select-none items-center p-2 text-xs text-gray-500 duration-200 hover:text-red-400"
                onClick={(e) => {
                  e.stopPropagation()
                  setter(
                    produce((draft) => {
                      if (!draft.related) return
                      draft.related.splice(index, 1)

                      if (!draft.relatedId) return
                      const idx = draft.relatedId.indexOf(item.id!)
                      if (idx === -1) return
                      draft.relatedId.splice(idx, 1)
                    }),
                  )
                }}
              >
                <i className="i-mingcute-delete-2-line text-base" />
                <span className="sr-only">删除</span>
              </MotionButtonBase>
            </MotionButtonBase>
          )
        })}
      </div>
    </SidebarSection>
  )
}

const RealtedPostList: FC = () => {
  const relatedIds = usePostModelDataSelector((state) => state?.relatedId)

  const currentId = usePostModelDataSelector((state) => state?.id)
  const selection = useMemo(() => new Set(relatedIds), [relatedIds])

  const setter = usePostModelSetModelData()

  // @ts-expect-error
  const { data, fetchNextPage, isLoading, isFetching } = useInfiniteQuery({
    ...adminQueries.post.getRelatedList(),
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasNextPage
        ? lastPage.pagination.currentPage + 1
        : undefined,
    getPreviousPageParam: (firstPage) => firstPage.pagination.currentPage - 1,
    initialPageParam: 1 as number,
  })

  const scrollerRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    const $scroller = scrollerRef.current
    if (!$scroller) return
    $scroller.onscrollend = () => {
      fetchNextPage()
    }

    return () => {
      $scroller.onscrollend = null
    }
  }, [fetchNextPage])

  const postMap = useMemo(() => {
    const map = new Map<string, PostRelated>()

    if (!data) return map

    data.pages.forEach((page) => {
      page.data.forEach((post) => {
        map.set(post.id, post)
      })
    })

    return map
  }, [data])

  return (
    <ul className="h-full overflow-auto lg:max-h-full" ref={scrollerRef}>
      {data?.pages.map((page) =>
        page.data.map((post) => {
          if (post.id === currentId) return
          const labelFor = `related-${post.id}`
          return (
            <li
              className="flex items-center gap-2 px-1 py-3"
              id={post.id}
              key={post.id}
            >
              <input
                id={labelFor}
                type="checkbox"
                className="checkbox-accent checkbox"
                checked={selection.has(post.id)}
                onChange={(e) => {
                  const { checked } = e.target

                  if (checked) {
                    setter(
                      produce((draft) => {
                        if (!draft.relatedId?.includes(post.id)) {
                          draft.relatedId?.push(post.id)
                          draft.related?.push(postMap.get(post.id)!)
                        }
                      }),
                    )
                  } else {
                    setter(
                      produce((draft) => {
                        if (draft.relatedId?.includes(post.id)) {
                          draft.relatedId?.splice(
                            draft.relatedId?.indexOf(post.id),
                            1,
                          )
                          draft.related = draft.related?.filter(
                            (item) => item.id !== post.id,
                          )
                        }
                      }),
                    )
                  }
                }}
              />
              <label
                htmlFor={labelFor}
                className="flex w-[60ch] max-w-full grow items-center"
              >
                <EllipsisHorizontalTextWithTooltip wrapperClassName="flex w-0 flex-grow">
                  {post.title}
                </EllipsisHorizontalTextWithTooltip>
              </label>
            </li>
          )
        }),
      )}

      {isLoading && isFetching && (
        <div className="flex justify-center">
          <div className="loading loading-ring" />
        </div>
      )}
    </ul>
  )
}
