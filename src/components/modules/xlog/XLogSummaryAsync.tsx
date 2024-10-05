'use client'

import { Suspense } from 'react'

import { clsxm } from '~/lib/helper'
import { queryClient } from '~/providers/root/react-query-provider'

import { AutoResizeHeight } from '../shared/AutoResizeHeight'

const fetchData = async (cid: string) => {
  if (!cid) {
    return null
  }

  return queryClient.fetchQuery({
    queryKey: ['xlog', 'summary', cid],
    staleTime: 6000,
    gcTime: 6000,
    queryFn: async () => {
      const lang =
        'navigator' in globalThis ? navigator.language.split('-')[0] : 'zh'
      return fetch(`/api/xlog/summary?cid=${cid}&lang=${lang}`, {
        next: {
          revalidate: 60 * 10,
        },
      })
        .then((res) => res.json())
        .catch(() => null)
    },
  })
}

export const XLogSummaryAsync = async (
  props: ComponentType<{
    cid: string
  }>,
) => {
  const { cid } = props
  if (!cid) return null

  return (
    <div
      data-hide-print
      className={clsxm(
        `space-y-2 rounded-xl border border-slate-200 p-4 dark:border-neutral-800`,
        props.className,
      )}
    >
      <div className="flex items-center">
        <i className="i-mingcute-sparkles-line mr-2 text-lg" />
        AI 生成的摘要
      </div>

      <AutoResizeHeight>
        <Suspense fallback={LoadingSkeleton}>
          <RealDataRender cid={cid} />
        </Suspense>
      </AutoResizeHeight>
      <p className="mt-3 border-slate-200 text-right text-sm dark:border-slate-800">
        (此服务由{' '}
        <a href="https://xlog.app" target="_blank" rel="noreferrer">
          xLog
        </a>{' '}
        驱动)
      </p>
    </div>
  )
}

const RealDataRender = async ({ cid }: { cid: string }) => {
  const data = await fetchData(cid)
  if (!data) return null

  return (
    <p className="!m-0 text-sm leading-loose text-base-content/85">
      {data?.data}
    </p>
  )
}

const LoadingSkeleton = (
  <div className="space-y-2">
    <span className="block h-5 w-full animate-pulse rounded-xl bg-zinc-200 dark:bg-neutral-800" />
    <span className="block h-5 w-full animate-pulse rounded-xl bg-zinc-200 dark:bg-neutral-800" />
    <span className="block h-5 w-full animate-pulse rounded-xl bg-zinc-200 dark:bg-neutral-800" />
  </div>
)
