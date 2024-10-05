'use client'

import { useSayListQuery, useSayModal } from '~/components/modules/say/hooks'
import { SayMasonry } from '~/components/modules/say/SayMasonry'
import { NothingFound } from '~/components/modules/shared/NothingFound'
import { StyledButton } from '~/components/ui/button'
import { FullPageLoading } from '~/components/ui/loading'

export default function Page() {
  const { data, isLoading, status } = useSayListQuery()
  const present = useSayModal()

  if (isLoading || status === 'pending') {
    return <FullPageLoading />
  }

  if (!data || data.pages.length === 0) return <NothingFound />

  return (
    <div className="mx-auto w-full max-w-screen-lg">
      <StyledButton
        onClick={() => present()}
        className="center ml-auto flex duration-200"
      >
        <i className="i-mingcute-add-circle-line" />
        新建
      </StyledButton>

      <main className="mt-10">
        <SayMasonry />
      </main>
    </div>
  )
}
