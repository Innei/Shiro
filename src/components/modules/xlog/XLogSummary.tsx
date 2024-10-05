'use client'

import { useQuery } from '@tanstack/react-query'
import type { FC, ReactNode } from 'react'

import { AutoResizeHeight } from '~/components/modules/shared/AutoResizeHeight'
import { clsxm } from '~/lib/helper'

export interface XLogSummaryProps {
  cid: string
  className?: string
}

export const XLogSummary: FC<XLogSummaryProps> = (props) => {
  const { cid } = props
  const { data, isLoading, error } = useQuery({
    queryKey: [`getSummary`, cid],
    queryFn: async ({ queryKey }) => {
      const [, cid] = queryKey
      const data = await fetch(`/api/xlog/summary?cid=${cid}`, {
        next: {
          revalidate: 60 * 10,
        },
      }).then((res) => res.json())
      if (!data) throw new Error('请求错误')
      if (!data.summary) throw new Error('内容暂时无法获取')
      return data
    },
    enabled: !!cid,
    staleTime: 1000 * 60 * 60 * 24 * 7,
    retryDelay: 5000,
  })

  let Inner: ReactNode = (
    <div
      className={clsxm(
        `space-y-2 rounded-xl border border-slate-200 p-4 dark:border-neutral-800`,
        props.className,
      )}
    >
      <div className="flex items-center">
        <i className="i-mingcute-sparkles-line mr-2 text-lg" />
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
            data?.summary
          )}
        </div>
        {isLoading && (
          <p className="mt-3 border-slate-200 text-right text-sm dark:border-slate-800 ">
            (此服务由{' '}
            <a href="https://xlog.app" target="_blank" rel="noreferrer">
              xLog
            </a>{' '}
            驱动)
          </p>
        )}
      </AutoResizeHeight>
    </div>
  )

  if (!cid || error) {
    Inner = null
  }

  return (
    <AutoResizeHeight duration={0.2} className="mt-4 print:hidden">
      {Inner}
    </AutoResizeHeight>
  )
}
