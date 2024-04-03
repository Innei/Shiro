'use client'

import { useSayListQuery } from '~/components/modules/say/hooks'
import { SayMasonry } from '~/components/modules/say/SayMasonry'
import { NothingFound } from '~/components/modules/shared/NothingFound'
import { FullPageLoading } from '~/components/ui/loading'

export default function Page() {
  const { data, isLoading, status } = useSayListQuery()

  if (isLoading || status === 'pending') {
    return <FullPageLoading />
  }

  if (!data || data.pages.length === 0) return <NothingFound />

  return (
    <div>
      <header className="mb-[80px] flex items-center gap-3 text-3xl">
        <h1 className="text-4xl font-bold">一言</h1>

        <a
          data-event="Say RSS click"
          href="/says/feed"
          target="_blank"
          className="flex size-8 text-[#EE802F] center"
        >
          <i className="icon-[mingcute--rss-fill]" />
        </a>
      </header>

      <main className="mt-10">
        <SayMasonry />
      </main>
    </div>
  )
}
