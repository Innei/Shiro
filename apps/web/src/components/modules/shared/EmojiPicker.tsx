import { EmojiPicker } from '@ferrucc-io/emoji-picker'
import type { FC } from 'react'
import { memo } from 'react'

export const EmojiPickerComponent: FC<{
  onEmojiSelect: (emoji: string) => void
}> = memo(({ onEmojiSelect }) => {
  return (
    <EmojiPicker
      className="w-auto overflow-hidden rounded border-0 bg-base-100 shadow-none md:border-border md:w-[400px] md:shadow"
      emojisPerRow={12}
      emojiSize={28}
      onEmojiSelect={(e) => onEmojiSelect(e)}
    >
      {/* <EmojiPicker.Header>
          <EmojiPicker.Input
            onFocus={stopPropagation}
            onPointerDown={stopPropagation}
            onFocusCapture={stopPropagation}
            onKeyDown={stopPropagation}
            placeholder="Search emoji"
          />
        </EmojiPicker.Header> */}
      <EmojiPicker.Group>
        <EmojiPicker.List />
      </EmojiPicker.Group>
    </EmojiPicker>
  )
})

export { EmojiPickerComponent as EmojiPicker }
