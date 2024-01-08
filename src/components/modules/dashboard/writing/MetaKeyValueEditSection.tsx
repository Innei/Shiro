import { Label } from '@radix-ui/react-label'
import { useMemo, useRef } from 'react'
import type { FC } from 'react'

import { StyledButton } from '~/components/ui/button'
import { HighLighter } from '~/components/ui/code-highlighter'
import { TextArea } from '~/components/ui/input'
import { useModalStack } from '~/components/ui/modal'
import { useEventCallback } from '~/hooks/common/use-event-callback'
import { toast } from '~/lib/toast'

type KeyValueString = string
interface MetaKeyValueEditSectionProps {
  keyValue: object | KeyValueString
  onChange: (keyValue: object) => void
}

const safeParse = (value: string) => {
  try {
    return JSON.parse(value)
  } catch (e) {
    return {}
  }
}

const TAB_SIZE = 2

export const MetaKeyValueEditSection: FC<MetaKeyValueEditSectionProps> = (
  props,
) => {
  const { keyValue, onChange } = props
  const objectValue = useMemo(
    () => (typeof keyValue === 'string' ? safeParse(keyValue) : keyValue),
    [keyValue],
  )
  const { present } = useModalStack()
  const handlePresentModal = useEventCallback(() => {
    present({
      title: `编辑元信息`,
      clickOutsideToDismiss: false,
      content: ({ dismiss }) => (
        <EditorModal
          value={JSON.stringify(objectValue, null, TAB_SIZE)}
          onChange={onChange}
          dismiss={dismiss}
        />
      ),
    })
  })

  const jsonString = JSON.stringify(objectValue, null, TAB_SIZE)
  return (
    <div className="relative flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <Label>Meta</Label>

        <StyledButton variant="secondary" onClick={handlePresentModal}>
          编辑
        </StyledButton>
      </div>
      <HighLighter key={jsonString} lang="json" content={jsonString} />
    </div>
  )
}

const isValidJSONString = (value: string) => {
  try {
    JSON.parse(value)
    return true
  } catch (e) {
    return false
  }
}

const EditorModal: FC<{
  value: string
  dismiss: () => void
  onChange: (value: object) => void
}> = ({ value, onChange, dismiss }) => {
  const currentEditValueRef = useRef(value)

  const handleSave = () => {
    if (!isValidJSONString(currentEditValueRef.current)) {
      toast.error('JSON 格式错误，请检查后再试')
      return
    }
    onChange(JSON.parse(currentEditValueRef.current) as Record<string, unknown>)

    dismiss()
  }

  return (
    <div className="relative flex w-full flex-grow flex-col lg:w-[600px]">
      <div className="h-[400px] w-full">
        <TextArea
          className="h-full w-full p-0 font-mono"
          defaultValue={value}
          onChange={(e) => {
            currentEditValueRef.current = e.target.value
          }}
        />
      </div>
      <div className="flex flex-shrink-0 justify-end">
        <StyledButton onClick={handleSave}>保存</StyledButton>
      </div>
    </div>
  )
}
