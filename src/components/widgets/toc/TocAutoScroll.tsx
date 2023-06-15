import { useEffect } from 'react'

import { useArticleElement } from '~/providers/article/article-element-provider'

export const TocAutoScroll: Component = () => {
  const articleElement = useArticleElement()

  useEffect(() => {
    const hash = escapeSelector(
      decodeURIComponent(window.location.hash.slice(1)),
    )

    if (!articleElement) return

    if (hash) {
      const el = articleElement.querySelector(`#${hash}`)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }
  }, [])

  return null
}

function escapeSelector(selector: string) {
  return selector.replace(/[!"#$%&'()*+,./:;<=>?@[\\\]^`{|}~]/g, '\\$&')
}
