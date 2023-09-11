import EmojiPicker$, { EmojiStyle, Theme } from 'emoji-picker-react'
import { memo } from 'react'
import type { FC } from 'react'

import { useIsDark } from '~/hooks/common/use-is-dark'

export const EmojiPicker: FC<{
  onEmojiSelect: (emoji: string) => void
}> = memo(({ onEmojiSelect }) => {
  const isDark = useIsDark()
  return (
    <EmojiPicker$
      theme={isDark ? Theme.DARK : Theme.LIGHT}
      onEmojiClick={(e) => {
        onEmojiSelect(e.emoji)
      }}
      emojiStyle={EmojiStyle.NATIVE}
    />
  )
})
EmojiPicker.displayName = 'EmojiPicker'
