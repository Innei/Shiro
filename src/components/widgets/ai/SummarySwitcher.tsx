import { memo } from 'react'
import type { FC } from 'react'
import type { AiSummaryProps } from './Summary'

import { appStaticConfig } from '~/app.static.config'
import { ErrorBoundary } from '~/components/common/ErrorBoundary'

import { getCidForBaseModel } from '../xlog/utils'
import { XLogSummary } from '../xlog/XLogSummaryRSC'
import { AISummary } from './Summary'

export const SummarySwitcher: FC<AiSummaryProps> = memo((props) => {
  const { enabled, providers } = appStaticConfig.ai.summary
  const { data } = props
  const cid = getCidForBaseModel(data)

  if (!enabled) return null

  let comp: any

  for (const provider of providers) {
    if (comp) break
    switch (provider) {
      case 'xlog':
        if (cid) comp = <XLogSummary cid={cid} />
        break
      case 'openai':
        if (!process.env.OPENAI_API_KEY) return
        if (data) comp = <AISummary data={data} />
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
