import { useEffect } from 'react'

import { useWrappedElement } from '~/providers/shared/WrappedElementProvider'

import { escapeSelector } from './escapeSelector'

export const TocAutoScroll: Component = () => {
  const articleElement = useWrappedElement()

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
