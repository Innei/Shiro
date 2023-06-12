import { useEffect, useRef } from 'react'
import { createContextState } from 'foxact/create-context-state'

import { clsxm } from '~/utils/helper'

const [
  ArticleElementProviderInternal,
  useArticleElement,
  useSetArticleElement,
] = createContextState<HTMLDivElement | null>(undefined as any)

const [
  IsEOArticleElementProviderInternal,
  useIsEOArticleElement,
  useSetIsEOArticleElement,
] = createContextState<boolean>(false)

const ArticleElementProvider: Component = ({ children, className }) => {
  return (
    <ArticleElementProviderInternal>
      <IsEOArticleElementProviderInternal>
        <Content className={className}>{children}</Content>
      </IsEOArticleElementProviderInternal>
    </ArticleElementProviderInternal>
  )
}

const Content: Component = ({ children, className }) => {
  const setter = useSetArticleElement()

  return (
    <div className={clsxm('relative', className)} ref={setter}>
      {children}
      <EOADetector />
    </div>
  )
}

const EOADetector: Component = () => {
  const ref = useRef<HTMLDivElement>(null)
  const setter = useSetIsEOArticleElement()
  useEffect(() => {
    if (!ref.current) return
    const $el = ref.current
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        setter(entry.isIntersecting)
      },
      {
        rootMargin: '0px 0px 10% 0px',
      },
    )

    observer.observe($el)
    return () => {
      observer.unobserve($el)
      observer.disconnect()
    }
  }, [])

  return <div ref={ref} />
}

export {
  ArticleElementProvider,
  useSetArticleElement,
  useArticleElement,
  useIsEOArticleElement,
}
