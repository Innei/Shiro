import type { FC } from 'react'

import { AdvancedInput } from '~/components/ui/input'

import { useBaseWritingAtom } from './BaseWritingProvider'

export const TitleInput: FC<{
  label?: string
}> = ({ label }) => {
  const [title, setTitle] = useBaseWritingAtom('title')

  return (
    <AdvancedInput
      color="primary"
      labelPlacement="inside"
      label={label || '标题'}
      value={title}
      onChange={(e) => setTitle(e.target.value)}
    />
  )
}
