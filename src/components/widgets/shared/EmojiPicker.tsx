import { useQuery } from '@tanstack/react-query'
import { memo, useCallback } from 'react'
import type { FC } from 'react'

import { Loading } from '~/components/ui/loading'

export const EmojiPicker: FC<{
  onEmojiSelect: (emoji: string) => void
}> = memo(({ onEmojiSelect }) => {
  const { data, isLoading } = useQuery({
    queryKey: ['emoji-data'],
    queryFn: () =>
      fetch('https://cdn.jsdelivr.net/npm/@emoji-mart/data', {
        next: {
          revalidate: 60 * 60 * 24 * 7,
        },
      }).then((response) => response.json()),

    staleTime: Number.POSITIVE_INFINITY,
  })
  const handleSelect = useCallback((emoji: any) => {
    return onEmojiSelect(emoji.native)
  }, [])

  const handleDivRef = (divEl: HTMLDivElement) => {
    import('emoji-mart').then(
      (m) =>
        new m.Picker({
          ref: {
            current: divEl,
          },
          data,
          onEmojiSelect: handleSelect,
          maxFrequentRows: 0,
        }),
    )
  }

  if (isLoading)
    return (
      <Loading className="flex h-[435px] w-[352px] rounded-md bg-slate-100 center dark:bg-neutral-800" />
    )

  return (
    <div className="w-[352px]">
      <div ref={handleDivRef} />
    </div>
  )
})
EmojiPicker.displayName = 'EmojiPicker'
