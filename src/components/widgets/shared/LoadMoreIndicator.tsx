'use client'

import { useInView } from 'react-intersection-observer'
import type { FC } from 'react'

import { Loading } from '~/components/ui/loading'

export const LoadMoreIndicator: FC<{
  onClick: () => void
}> = ({ onClick }) => {
  const { ref } = useInView({
    rootMargin: '1px',
    onChange(inView) {
      if (inView) onClick()
    },
  })
  return (
    <div ref={ref}>
      <Loading />
    </div>
  )
}
