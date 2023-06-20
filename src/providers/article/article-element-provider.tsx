import { memo, useEffect, useRef } from 'react'
import { createContextState } from 'foxact/create-context-state'
import { useIsomorphicLayoutEffect } from 'foxact/use-isomorphic-layout-effect'

import { ProviderComposer } from '~/components/common/ProviderComposer'
import { clsxm } from '~/utils/helper'

const [
  ArticleElementProviderInternal,
  useArticleElement,
  useSetArticleElement,
] = createContextState<HTMLDivElement | null>(undefined as any)

const [ElementSizeProviderInternal, useElementSize, useSetElementSize] =
  createContextState({
    h: 0,
    w: 0,
  })

const [
  ElementPositsionProviderInternal,
  useElementPositsion,
  useSetElementPositsion,
] = createContextState({
  x: 0,
  y: 0,
})

const [
  IsEOArticleElementProviderInternal,
  useIsEOArticleElement,
  useSetIsEOArticleElement,
] = createContextState<boolean>(false)

const Providers = [
  <ArticleElementProviderInternal key="ArticleElementProviderInternal" />,
  <ElementSizeProviderInternal key="ElementSizeProviderInternal" />,
  <ElementPositsionProviderInternal key="ElementPositsionProviderInternal" />,
  <IsEOArticleElementProviderInternal key="IsEOArticleElementProviderInternal" />,
]
const ArticleElementProvider: Component = ({ children, className }) => {
  return (
    <ProviderComposer contexts={Providers}>
      <ArticleElementResizeObserver />
      <Content className={className}>{children}</Content>
    </ProviderComposer>
  )
}
const ArticleElementResizeObserver = () => {
  const setSize = useSetElementSize()
  const setPos = useSetElementPositsion()
  const $article = useArticleElement()
  useIsomorphicLayoutEffect(() => {
    if (!$article) return
    const { height, width, x, y } = $article.getBoundingClientRect()
    setSize({ h: height, w: width })
    setPos({ x, y })

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      const { height, width, x, y } = entry.contentRect
      setSize({ h: height, w: width })
      setPos({ x, y })
    })
    observer.observe($article)
    return () => {
      observer.unobserve($article)
      observer.disconnect()
    }
  }, [$article])

  return null
}

const Content: Component = memo(({ children, className }) => {
  const setElement = useSetArticleElement()

  return (
    <div className={clsxm('relative', className)} ref={setElement}>
      {children}
      <EOADetector />
    </div>
  )
})

Content.displayName = 'ArticleElementProviderContent'

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
  useElementSize,
  useElementPositsion,
}
