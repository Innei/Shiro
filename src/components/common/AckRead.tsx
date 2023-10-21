'use client'

import type { FC } from 'react'

import { useAckReadCount } from '~/hooks/biz/use-ack-read-count'

export const AckRead: FC<{
  id: string
  type: 'post' | 'note'
}> = (props) => {
  useAckReadCount(props.type, props.id)

  return null
}
