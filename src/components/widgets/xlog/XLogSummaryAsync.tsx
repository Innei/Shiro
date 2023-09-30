'use client'

import { Suspense } from 'react'

import { clsxm } from '~/lib/helper'

import { AutoResizeHeight } from '../shared/AutoResizeHeight'

const fetchData = async (cid: string) => {
  if (!cid) {
    return null
  }

  return fetch(
    `/api/xlog/summary?cid=${cid}&lang=${navigator.language.split('-')[0]}`,
    {
      next: {
        revalidate: 60 * 10,
      },
    },
  )
    .then((res) => res.json())
    .catch(() => null)
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
        <i className="icon-[mingcute--sparkles-line] mr-2 text-lg" />
        AI 生成的摘要
      </div>

      <AutoResizeHeight>
        <Suspense fallback={LoadingSkeleton}>
          <RealDataRender cid={cid} />
        </Suspense>
      </AutoResizeHeight>
      <p className="border-slate-200 text-right text-sm dark:border-slate-800 ">
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
    <p className="text-base-content/85 !m-0 text-sm leading-loose">
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
