import { load } from 'js-yaml'
import type { FC } from 'react'
import { useState } from 'react'

import { StyledButton } from '~/components/ui/button'
import { TextArea } from '~/components/ui/input'
import { DeclarativeModal } from '~/components/ui/modal/stacked/declarative-modal'
import { useDisclosure } from '~/hooks/common/use-disclosure'
import { useEventCallback } from '~/hooks/common/use-event-callback'
import { usePreventComposition } from '~/hooks/common/use-prevent-composition'
import { useUncontrolledInput } from '~/hooks/common/use-uncontrolled-input'

type ParsedValue = {
  title?: string
  text: string
  meta?: Record<string, any>
}
export const ImportMarkdownButton: FC<{
  onParsedValue: (parsedValue: ParsedValue) => void
}> = ({ onParsedValue }) => {
  const [, getValue, ref] = useUncontrolledInput<HTMLTextAreaElement>()
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()
  const handleParseContent = useEventCallback(() => {
    let value = getValue()
    if (!value) return

    const hasHeaderYaml = /^---\n((.|\n)*?)\n---/.exec(value)

    const parsedValue: ParsedValue = {} as any

    if (hasHeaderYaml?.length) {
      const headerYaml = hasHeaderYaml[1]
      const meta: Record<string, any> = load(headerYaml) as any

      parsedValue.meta = meta

      // remove header yaml
      value = value.replace(hasHeaderYaml[0], '')
    }
    // trim value again
    const str = value.trim()
    const lines = str.split('\n')
    // if first line is not empty, start with `#`
    const title = lines[0].startsWith('#')
      ? lines[0].replace(/^#/, '').trim()
      : ''

    if (title) {
      parsedValue.title = title
      lines.shift()
    }

    parsedValue.text = lines.join('\n').trim()

    onParsedValue(parsedValue)

    onClose()
  })

  const [textareaEl, setTextAreaEl] = useState<HTMLTextAreaElement | null>()
  usePreventComposition(textareaEl!)
  return (
    <>
      <StyledButton className="rounded-lg" variant="secondary" onClick={onOpen}>
        导入
      </StyledButton>
      <DeclarativeModal
        modalClassName="z-[999] pointer-events-auto"
        clickOutsideToDismiss={false}
        open={isOpen}
        onOpenChange={onOpenChange}
        title="Import Markdown"
      >
        <TextArea
          ref={(el) => {
            // @ts-expect-error
            ref.current = el
            setTextAreaEl(el)
          }}
          className="h-[calc(70vh-15rem)] max-h-[600px] w-[600px] max-w-full grow resize-none focus-visible:border-accent"
          rounded="md"
        />

        <DeclarativeModal.FooterAction>
          <StyledButton variant="primary" onClick={handleParseContent}>
            好
          </StyledButton>
        </DeclarativeModal.FooterAction>
      </DeclarativeModal>
    </>
  )
}
