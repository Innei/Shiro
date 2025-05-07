'use client'

import { createContext } from 'react'

export const PageArticleIdContext = createContext<string | null>(null)

export const PageArticleIdProvider: Component<{
  id: string
}> = ({ children, id }) => {
  return <PageArticleIdContext value={id}>{children}</PageArticleIdContext>
}
