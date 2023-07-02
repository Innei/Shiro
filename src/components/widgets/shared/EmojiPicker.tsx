import Picker from '@emoji-mart/react'
import { useQuery } from '@tanstack/react-query'
import { memo, useCallback } from 'react'
import type { FC } from 'react'

import { Loading } from '~/components/ui/loading'

export const EmojiPicker: FC<{
  onEmojiSelect: (emoji: string) => void
}> = memo(({ onEmojiSelect }) => {
  const { data, isLoading } = useQuery({
    queryKey: ['emojidata'],
    queryFn: () =>
      fetch('https://cdn.jsdelivr.net/npm/@emoji-mart/data').then((response) =>
        response.json(),
      ),

    staleTime: Infinity,
  })
  const handleSelect = useCallback((emoji: any) => {
    return onEmojiSelect(emoji.native)
  }, [])
  if (isLoading) return <Loading className="w-[352px]" />

  return <Picker data={data} onEmojiSelect={handleSelect} />
})
EmojiPicker.displayName = 'EmojiPicker'
