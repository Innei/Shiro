import type { FC } from 'react'
import { memo } from 'react'

import { appStaticConfig } from '~/app.static.config'
import { ErrorBoundary } from '~/components/common/ErrorBoundary'
import { clsxm } from '~/lib/helper'

import type { AiSummaryProps } from '../ai/Summary'
import { AISummary } from '../ai/Summary'
import { XLogSummary } from '../xlog'
import { getCidForBaseModel } from '../xlog/utils'

export const SummarySwitcher: FC<
  AiSummaryProps & {
    summary?: string
  }
> = memo((props) => {
  const { enabled, providers } = appStaticConfig.ai.summary
  const { data, summary } = props
  const cid = getCidForBaseModel(data)

  const finalSummary = 'summary' in data ? data.summary : summary
  if (finalSummary && finalSummary.trim().length > 0)
    return <ManualSummary className="my-4" summary={finalSummary} />

  if (!enabled) return null

  let comp: any

  for (const provider of providers) {
    if (comp) break
    switch (provider) {
      case 'xlog': {
        if (cid) comp = <XLogSummary cid={cid} />
        break
      }
      case 'openai': {
        if (!process.env.OPENAI_API_KEY) break
        if (data) comp = <AISummary data={data} />
      }
    }
  }

  if (!comp) return null

  return (
    <ErrorBoundary>
      <div className="my-4">{comp}</div>
    </ErrorBoundary>
  )
})

SummarySwitcher.displayName = 'SummarySwitcher'

const ManualSummary: Component<{
  summary: string
}> = ({ className, summary }) => {
  return (
    <div
      className={clsxm(
        `space-y-2 rounded-xl border border-slate-200 p-4 dark:border-neutral-800`,
        className,
      )}
    >
      <div className="flex items-center">
        <i className="i-mingcute-sparkles-line mr-2 text-lg" />
        摘要
      </div>
      <div className="!m-0 text-sm leading-loose text-base-content/85">
        {summary}
      </div>
    </div>
  )
}
