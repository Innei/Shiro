'use client'

import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import type { NoteModel, PageModel, PostModel } from '@mx-space/api-client'
import type { ArticleDataType } from '~/types/api'
import type { FC } from 'react'

import { LogosOpenaiIcon } from '~/components/icons/platform/OpenAIIcon'
import { AutoResizeHeight } from '~/components/widgets/shared/AutoResizeHeight'
import { API_URL } from '~/constants/env'
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
    ['ai-summary', data.id, API_URL, data.modified],
    async () => {
      const data = await fetch(
        `/api/ai/summary?data=${encodeURIComponent(
          JSON.stringify(payload),
        )}&lang=${navigator.language}`,
      ).then((res) => res.json())
      if (!data) throw new Error('请求错误')
      return data
    },
    {
      retryDelay: 5000,
    },
  )

  return <SummaryContainer isLoading={isLoading} summary={response?.summary} />
}

const SummaryContainer: Component<{
  isLoading: boolean
  summary?: string
}> = (props) => {
  const { className, isLoading, summary } = props
  return (
    <div
      data-hide-print
      className={clsxm(
        `space-y-2 rounded-xl border border-slate-200 p-4 dark:border-neutral-800`,
        className,
      )}
    >
      <div className="flex items-center">
        <LogosOpenaiIcon className="mr-2" />
        AI 生成的摘要
      </div>

      <AutoResizeHeight duration={0.3}>
        <div className="text-base-content/85 !m-0 text-sm leading-loose">
          {isLoading ? (
            <div className="space-y-2">
              <span className="block h-5 w-full animate-pulse rounded-xl bg-zinc-200 dark:bg-neutral-800" />
              <span className="block h-5 w-full animate-pulse rounded-xl bg-zinc-200 dark:bg-neutral-800" />
              <span className="block h-5 w-full animate-pulse rounded-xl bg-zinc-200 dark:bg-neutral-800" />
            </div>
          ) : (
            summary
          )}
        </div>
      </AutoResizeHeight>
    </div>
  )
}
