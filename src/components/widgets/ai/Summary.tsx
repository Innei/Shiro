'use client'

import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import type { NoteModel, PageModel, PostModel } from '@mx-space/api-client'
import type { ArticleDataType } from '~/types/api'
import type { FC, ReactNode } from 'react'

import { LogosOpenaiIcon } from '~/components/icons/platform/OpenAIIcon'
import { AutoResizeHeight } from '~/components/widgets/shared/AutoResizeHeight'
import { API_URL } from '~/constants/env'
import { useIsClientTransition } from '~/hooks/common/use-is-client'
import { clsxm } from '~/lib/helper'
import { isNoteModel, isPageModel, isPostModel } from '~/lib/url-builder'

export interface AiSummaryProps {
  data: PostModel | NoteModel | PageModel
  className?: string
}

export const AISummary: FC<AiSummaryProps> = (props) => {
  const { data } = props

  const payload = useMemo(() => {
    let payload: ArticleDataType

    if (isPostModel(data)) {
      payload = {
        category: data.category.slug,
        slug: data.slug,
        type: 'post',
      }
    } else if (isNoteModel(data)) {
      payload = {
        nid: data.nid,
        type: 'note',
      }
    } else if (isPageModel(data)) {
      payload = {
        slug: data.slug,
        type: 'page',
      }
    } else {
      throw new Error('未知类型')
    }

    return payload
  }, [data])
  const { data: response, isLoading } = useQuery<{
    summary: string
    source: string
  }>(
    [`ai-summary`, data.id, API_URL, data.modified],
    async () => {
      const data = await fetch(
        `/api/ai/summary?data=${encodeURIComponent(JSON.stringify(payload))}`,
      ).then((res) => res.json())
      if (!data) throw new Error('请求错误')
      return data
    },
    {
      retryDelay: 5000,
    },
  )
  const isClient = useIsClientTransition()
  if (!isClient) return null

  const Inner: ReactNode = (
    <div
      data-hide-print
      className={clsxm(
        `space-y-2 rounded-xl border border-slate-200 p-4 dark:border-neutral-800`,
        props.className,
      )}
    >
      <div className="flex items-center">
        <LogosOpenaiIcon className="mr-2" />
        AI 生成的摘要
      </div>

      <AutoResizeHeight duration={0.3}>
        <p className="text-base-content/85 !m-0 text-sm leading-loose">
          {isLoading ? (
            <div className="space-y-2">
              <span className="block h-5 w-full animate-pulse rounded-xl bg-zinc-200 dark:bg-neutral-800" />
              <span className="block h-5 w-full animate-pulse rounded-xl bg-zinc-200 dark:bg-neutral-800" />
              <span className="block h-5 w-full animate-pulse rounded-xl bg-zinc-200 dark:bg-neutral-800" />
            </div>
          ) : (
            response?.summary
          )}
        </p>
      </AutoResizeHeight>
    </div>
  )

  return (
    <AutoResizeHeight duration={0.2} className="mt-4">
      {Inner}
    </AutoResizeHeight>
  )
}
