'use client'

import { useInView } from 'react-intersection-observer'

import { Loading } from '~/components/ui/loading'

export const LoadMoreIndicator: Component<{
  onClick: () => void
}> = ({ onClick, children }) => {
  const { ref } = useInView({
    rootMargin: '1px',
    onChange(inView) {
      if (inView) onClick()
    },
  })
  return <div ref={ref}>{children ?? <Loading />}</div>
}
