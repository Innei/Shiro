import { useEffect, useState } from 'react'
import { createContextState } from 'foxact/create-context-state'

import { clsxm } from '~/utils/helper'

const [
  ArticleElementContextProviderInternal,
  useArticleElement,
  useSetArticleElement,
] = createContextState<HTMLDivElement | null>(undefined as any)

const ArticleElementContextProvider: Component = ({ children, className }) => {
  return (
    <ArticleElementContextProviderInternal>
      <Content className={className}>{children}</Content>
    </ArticleElementContextProviderInternal>
  )
}

const Content: Component = ({ children, className }) => {
  const [contentRef, setContentRef] = useState<HTMLDivElement | null>(null)
  const setter = useSetArticleElement()
  useEffect(() => {
    setter(contentRef)
  }, [contentRef, setter])
  return (
    <div className={clsxm('relative', className)} ref={setContentRef}>
      {children}
    </div>
  )
}

export {
  ArticleElementContextProvider,
  useSetArticleElement,
  useArticleElement,
}
