import EmojiPicker$, { EmojiStyle } from 'emoji-picker-react'
import { memo } from 'react'
import type { FC } from 'react'

export const EmojiPicker: FC<{
  onEmojiSelect: (emoji: string) => void
}> = memo(({ onEmojiSelect }) => {
  return (
    <EmojiPicker$
      onEmojiClick={(e) => {
        onEmojiSelect(e.emoji)
      }}
      emojiStyle={EmojiStyle.NATIVE}
    />
  )
})
EmojiPicker.displayName = 'EmojiPicker'
