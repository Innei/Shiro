import type { FC } from 'react'

import { GitAlert } from './alert'

export const MBlockQuote: FC<{
  className?: string
  children: React.ReactNode
  alert?: string
}> = ({ className, children, alert }) => {
  if (alert) {
    return <GitAlert type={alert} text={children as string} />
  }
  return <blockquote className={className}>{children}</blockquote>
}
