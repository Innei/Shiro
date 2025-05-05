'use client'

import { useQuery } from '@tanstack/react-query'
import type { FC } from 'react'
import { memo } from 'react'

import { LogosOpenaiIcon } from '~/components/icons/platform/OpenAIIcon'
import { AutoResizeHeight } from '~/components/modules/shared/AutoResizeHeight'
import { Markdown } from '~/components/ui/markdown'
import { clsxm } from '~/lib/helper'
import { apiClient } from '~/lib/request'

export interface AiSummaryProps {
  articleId: string
  hydrateText?: string
  className?: string
}

export const AISummary: FC<AiSummaryProps> = memo((props) => {
  const { articleId, hydrateText } = props

  const { data: response, isLoading } = useQuery({
    queryKey: ['ai-summary', articleId],
    queryFn: async () =>
      apiClient.ai.getSummary({
        articleId,
        lang: navigator.language,
      }),
    retryDelay: 5000,
    enabled: !hydrateText,
  })

  if (hydrateText) {
    return <SummaryContainer isLoading={false} summary={hydrateText} />
  }
  return <SummaryContainer isLoading={isLoading} summary={response?.summary} />
})

const SummaryLoadingSkeleton = (
  <div className="space-y-3">
    <div className="flex items-center space-x-1">
      <span className="inline-block size-2 animate-pulse rounded-full bg-purple-400/70 dark:bg-purple-500/70" />
      <span className="inline-block size-2 animate-pulse rounded-full bg-purple-400/40 delay-150 dark:bg-purple-500/40" />
      <span className="inline-block size-2 animate-pulse rounded-full bg-purple-400/20 delay-300 dark:bg-purple-500/20" />
    </div>
    <span className="block h-4 w-full animate-pulse rounded-md bg-gradient-to-r from-zinc-200 via-purple-100/30 to-zinc-100 dark:from-neutral-800 dark:via-purple-900/30 dark:to-neutral-700" />
    <span className="block h-4 w-11/12 animate-pulse rounded-md bg-gradient-to-r from-zinc-200 via-purple-100/30 to-zinc-100 dark:from-neutral-800 dark:via-purple-900/30 dark:to-neutral-700" />
    <span className="block h-4 w-10/12 animate-pulse rounded-md bg-gradient-to-r from-zinc-200 via-purple-100/30 to-zinc-100 dark:from-neutral-800 dark:via-purple-900/30 dark:to-neutral-700" />
  </div>
)

const SummaryContainer: Component<{
  isLoading: boolean
  summary?: string
}> = (props) => {
  const { className, isLoading, summary } = props

  return (
    <div
      data-hide-print
      className={clsxm(
        `overflow-hidden rounded-xl border border-purple-200/80 bg-gradient-to-b from-white to-purple-50/50 p-4 shadow-sm transition-all dark:border-purple-800/80 dark:from-neutral-900 dark:to-purple-950/30`,
        className,
      )}
    >
      <div className="mb-3 flex items-center">
        <div className="mr-2 flex size-6 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 shadow-sm shadow-purple-200 dark:from-purple-600 dark:to-indigo-600 dark:shadow-purple-900/20">
          <svg
            className="size-4 text-white"
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 24 24"
          >
            <g
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              color="currentColor"
            >
              <path d="M4 16.5a3 3 0 0 0 3 3a2.5 2.5 0 0 0 5 0a2.5 2.5 0 1 0 5 0a3 3 0 0 0 2.567-4.553a3.001 3.001 0 0 0 0-5.893A3 3 0 0 0 17 4.5a2.5 2.5 0 1 0-5 0a2.5 2.5 0 0 0-5 0a3 3 0 0 0-2.567 4.553a3.001 3.001 0 0 0 0 5.893A3 3 0 0 0 4 16.5" />
              <path d="m7.5 14.5l1.842-5.526a.694.694 0 0 1 1.316 0L12.5 14.5m3-6v6m-7-2h3" />
            </g>
          </svg>
        </div>
        <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-sm font-medium text-transparent dark:from-purple-400 dark:to-indigo-400">
          AI 生成的摘要
        </span>
        {!isLoading && (
          <div className="ml-auto flex items-center text-xs text-slate-400 dark:text-neutral-500">
            <span className="mr-1.5 size-1.5 animate-pulse rounded-full bg-purple-400 dark:bg-purple-500" />
            <span>此内容由 AI 生成</span>
          </div>
        )}
      </div>

      <AutoResizeHeight spring>
        <div
          className={clsxm(
            '!m-0 text-sm leading-relaxed text-base-content/85',
            isLoading
              ? ''
              : 'border-l-2 border-purple-400/30 dark:border-purple-500/30 pl-3',
          )}
        >
          {isLoading ? (
            SummaryLoadingSkeleton
          ) : (
            <Markdown disableParsingRawHTML removeWrapper>
              {summary || ''}
            </Markdown>
          )}
        </div>
      </AutoResizeHeight>
    </div>
  )
}

export const SummaryLoadingSkeletonContainer: FC<{ className?: string }> = ({
  className,
}) => (
  <div
    data-hide-print
    className={clsxm(
      `overflow-hidden rounded-xl border border-purple-200/80 bg-gradient-to-b from-white to-purple-50/50 p-4 shadow-sm transition-all dark:border-purple-800/80 dark:from-neutral-900 dark:to-purple-950/30`,
      className,
    )}
  >
    <div className="mb-3 flex items-center">
      <div className="mr-2 flex size-6 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 shadow-sm shadow-purple-200 dark:from-purple-600 dark:to-indigo-600 dark:shadow-purple-900/20">
        <LogosOpenaiIcon className="size-4 text-white" />
      </div>
      <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-sm font-medium text-transparent dark:from-purple-400 dark:to-indigo-400">
        AI 生成的摘要
      </span>
    </div>

    <div className="!m-0 text-sm leading-relaxed text-base-content/85">
      {SummaryLoadingSkeleton}
    </div>
  </div>
)
