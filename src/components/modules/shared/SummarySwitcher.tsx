import type { FC } from 'react'
import { memo } from 'react'

import { appStaticConfig } from '~/app.static.config'
import { ErrorBoundary } from '~/components/common/ErrorBoundary'
import { clsxm } from '~/lib/helper'

import type { AiSummaryProps } from '../ai/Summary'
import { AISummary } from '../ai/Summary'
import { XLogSummary } from '../xlog'

export const SummarySwitcher: FC<
  AiSummaryProps & {
    summary?: string
    /**
     * xlog cid
     */
    cid?: string

    enabledMixSpaceSummary?: boolean
  }
> = memo((props) => {
  const { enabled } = appStaticConfig.ai.summary
  const { summary, cid, articleId, hydrateText, enabledMixSpaceSummary } = props
  if (summary && summary.trim().length > 0)
    return <ManualSummary className="my-4" summary={summary} />

  if (!enabled) return null

  let comp: any

  switch (true) {
    case enabledMixSpaceSummary: {
      comp = <AISummary articleId={articleId} hydrateText={hydrateText} />
      break
    }
    case !!cid: {
      comp = <XLogSummary cid={cid} />
      break
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
}> = ({ className, summary }) => (
  <div
    className={clsxm(
      `space-y-2 rounded-xl border border-slate-200 p-4 dark:border-neutral-800`,
      className,
    )}
  >
    <div className="flex items-center">
      <i className="icon-[mingcute--sparkles-line] mr-2 text-lg" />
      摘要
    </div>
    <div className="!m-0 text-sm leading-loose text-base-content/85">
      {summary}
    </div>
  </div>
)
