'use client'

import { useSayListQuery } from '~/components/modules/say/hooks'
import { SayMasonry } from '~/components/modules/say/SayMasonry'
import { NothingFound } from '~/components/modules/shared/NothingFound'
import { FullPageLoading } from '~/components/ui/loading'

export default function Page() {
  const { data, isLoading } = useSayListQuery()

  if (isLoading) {
    return <FullPageLoading />
  }

  if (!data || data.pages.length === 0) return <NothingFound />

  return (
    <div>
      <header className="prose">
        <h1>一言</h1>
      </header>

      <main className="mt-10">
        <SayMasonry />
      </main>
    </div>
  )
}
