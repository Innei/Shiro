'use client'

import { useQuery } from '@tanstack/react-query'
import type { FC } from 'react'

import { LogosOpenaiIcon } from '~/components/icons/platform/OpenAIIcon'
import { AutoResizeHeight } from '~/components/modules/shared/AutoResizeHeight'
import { clsxm } from '~/lib/helper'
import { apiClient } from '~/lib/request'

export interface AiSummaryProps {
  articleId: string
  hydrateText?: string
  className?: string
}

export const AISummary: FC<AiSummaryProps> = (props) => {
  const { articleId, hydrateText } = props

  const { data: response, isLoading } = useQuery({
    queryKey: ['ai-summary', articleId],
    queryFn: async () => {
      return apiClient.ai.getSummary({
        articleId,
        lang: navigator.language,
      })
    },
    retryDelay: 5000,
    enabled: !hydrateText,
  })

  if (hydrateText) {
    return <SummaryContainer isLoading={false} summary={hydrateText} />
  }
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
        <div className="!m-0 text-sm leading-loose text-base-content/85">
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
