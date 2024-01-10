/// useBeforeUnload.ts
'use client'

import { useEffect, useId } from 'react'
import { useRouter } from 'next/navigation'

let isForceRouting = false
const activeIds: string[] = []
let lastKnownHref: string

export const useBeforeUnload = (isActive = true) => {
  const id = useId()

  // Handle <Link> clicks & onbeforeunload(attemptimg to close/refresh browser)
  useEffect(() => {
    if (!isActive) return
    lastKnownHref = window.location.href

    activeIds.push(id)

    const handleAnchorClick = (e: Event) => {
      const targetUrl = (e.currentTarget as HTMLAnchorElement).href,
        currentUrl = window.location.href

      if (targetUrl !== currentUrl) {
        const res = beforeUnloadFn()
        if (!res) e.preventDefault()
        lastKnownHref = window.location.href
      }
    }

    let anchorElements: HTMLAnchorElement[] = []

    const disconnectAnchors = () => {
      anchorElements.forEach((anchor) => {
        anchor.removeEventListener('click', handleAnchorClick)
      })
    }

    const handleMutation = () => {
      disconnectAnchors()

      anchorElements = Array.from(document.querySelectorAll('a[href]'))
      anchorElements.forEach((anchor) => {
        anchor.addEventListener('click', handleAnchorClick)
      })
    }

    const mutationObserver = new MutationObserver(handleMutation)
    mutationObserver.observe(document.body, { childList: true, subtree: true })
    addEventListener('beforeunload', beforeUnloadFn)

    return () => {
      removeEventListener('beforeunload', beforeUnloadFn)
      disconnectAnchors()
      mutationObserver.disconnect()

      activeIds.splice(activeIds.indexOf(id), 1)
    }
  }, [isActive, id])
}

const beforeUnloadFn = (event?: BeforeUnloadEvent) => {
  if (isForceRouting) return true

  const message = 'Discard unsaved changes?'

  if (event) {
    event.returnValue = message
    return message
  } else {
    return confirm(message)
  }
}

const BeforeUnloadProvider = ({ children }: React.PropsWithChildren) => {
  const router = useRouter()
  useEffect(() => {
    lastKnownHref = window.location.href
  })

  // Hack nextjs13 popstate impl, so it will include route cancellation.
  // This Provider has to be rendered in the layout phase wrapping the page.
  useEffect(() => {
    let nextjsPopStateHandler: (...args: any[]) => void

    function popStateHandler(...args: any[]) {
      useBeforeUnload.ensureSafeNavigation(
        () => {
          nextjsPopStateHandler(...args)
          lastKnownHref = window.location.href
        },
        () => {
          router.replace(lastKnownHref, { scroll: false })
        },
      )
    }

    addEventListener('popstate', popStateHandler)
    const originalAddEventListener = window.addEventListener
    window.addEventListener = (...args: any[]) => {
      if (args[0] === 'popstate') {
        nextjsPopStateHandler = args[1]
        window.addEventListener = originalAddEventListener
      } else {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        originalAddEventListener(...args)
      }
    }

    originalAddEventListener('popstate', (e) => {
      e.preventDefault()
    })

    // window.addEventListener('popstate', () => {
    //   history.pushState(null, '', null)
    // })
    return () => {
      window.addEventListener = originalAddEventListener
      removeEventListener('popstate', popStateHandler)
    }
  }, [])

  return children
}

useBeforeUnload.Provider = BeforeUnloadProvider

useBeforeUnload.forceRoute = async (cb: () => void | Promise<void>) => {
  try {
    isForceRouting = true
    await cb()
  } finally {
    isForceRouting = false
  }
}

useBeforeUnload.ensureSafeNavigation = (
  onPerformRoute: () => void,
  onRouteRejected?: () => void,
) => {
  if (activeIds.length === 0 || beforeUnloadFn()) {
    onPerformRoute()
  } else {
    onRouteRejected?.()
  }
}
