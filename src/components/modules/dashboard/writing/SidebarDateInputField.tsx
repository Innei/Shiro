import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import type { FC } from 'react'

import { Input } from '~/components/ui/input'
import { isValidDate } from '~/lib/datetime'

export const SidebarDateInputField: FC<{
  label?: string
  getSet: [string | undefined, (value: any) => void]
}> = ({ label, getSet }) => {
  const [created, setCreated] = getSet

  const [editingCreated, setEditingCreated] = useState(created)

  const [reset, setReset] = useState(0)
  useEffect(() => {
    if (!created) return
    setEditingCreated(dayjs(created).format('YYYY-MM-DD HH:mm:ss'))
  }, [created, reset])

  const [hasError, setHasError] = useState(false)
  useEffect(() => {
    if (!editingCreated) return
    if (isValidDate(new Date(editingCreated))) {
      setHasError(false)
    } else setHasError(true)
  }, [editingCreated, setCreated])

  return (
    <Input
      value={editingCreated}
      placeholder={created || ' '}
      onBlur={() => {
        if (!hasError) {
          setCreated(editingCreated)
        }
      }}
      onChange={(e) => {
        setEditingCreated(e.target.value)
      }}
    />
  )
}
