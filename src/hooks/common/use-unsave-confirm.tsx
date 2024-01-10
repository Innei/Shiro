/* eslint-disable prefer-rest-params */
/// useBeforeUnload.ts
import { useCallback, useEffect } from 'react'

import { StyledButton } from '~/components/ui/button'
import { useModalStack } from '~/components/ui/modal'

const _useBeforeUnload = (
  enabled: boolean | (() => boolean) = true,
  message?: string,
) => {
  const handler = useCallback(
    (event: BeforeUnloadEvent) => {
      const finalEnabled = typeof enabled === 'function' ? enabled() : true

      if (!finalEnabled) {
        return
      }

      event.preventDefault()

      if (message) {
        event.returnValue = message
      }

      return message
    },
    [enabled, message],
  )

  useEffect(() => {
    if (!enabled) {
      return
    }

    // on(window, 'beforeunload', handler);
    window.addEventListener('beforeunload', handler)

    return () => window.removeEventListener('beforeunload', handler)
  }, [enabled, handler])
}

declare global {
  interface Window {
    originalPushState: typeof window.history.pushState
    originalReplaceState: typeof window.history.replaceState
  }
}

export const useBeforeUnload = (
  needConfirm = true,
  message = 'Are you sure want to leave this page?',
) => {
  // check when page is about to be reloaded
  _useBeforeUnload(needConfirm, message)

  // // check when page is about to be changed
  useEffect(() => {
    function findClosestAnchor(
      element: HTMLElement | null,
    ): HTMLAnchorElement | null {
      while (element && element.tagName.toLowerCase() !== 'a') {
        element = element.parentElement
      }
      return element as HTMLAnchorElement
    }
    function handleClick(event: MouseEvent) {
      try {
        const target = event.target as HTMLElement
        const anchor = findClosestAnchor(target)
        if (anchor) {
          const isDownloadLink = (anchor as HTMLAnchorElement).download !== ''
          const isNewTab = anchor.target === '_blank'

          const isPageLeaving = !isDownloadLink && !isNewTab

          if (isPageLeaving && needConfirm && !window.confirm(message)) {
            // Cancel the route change
            event.preventDefault()
            event.stopPropagation()
          }
        }
      } catch (err) {
        alert(err)
      }
    }

    // Add the global click event listener
    document.addEventListener('click', handleClick, true)

    // Clean up the global click event listener when the component is unmounted
    return () => {
      document.removeEventListener('click', handleClick, true)
    }
  }, [needConfirm, message])

  const { present } = useModalStack()
  useEffect(() => {
    let originalPushState = globalThis.window.originalPushState
    let originalReplaceState = globalThis.window.originalReplaceState

    if (!originalPushState) {
      originalPushState = window.history.pushState
    }
    if (!originalReplaceState) {
      originalReplaceState = window.history.replaceState
    }

    const factory = (
      original:
        | typeof window.history.pushState
        | typeof window.history.replaceState,
    ) =>
      function () {
        const doAction = () => {
          original.apply(this, arguments as any)
        }
        if (needConfirm) {
          present({
            title: message,
            content: ({ dismiss }) => (
              <div className="flex justify-end gap-3">
                <StyledButton
                  onClick={() => {
                    doAction()
                    dismiss()
                  }}
                >
                  Leave
                </StyledButton>
                <StyledButton
                  variant="secondary"
                  className="rounded-md"
                  onClick={dismiss}
                >
                  Cancel
                </StyledButton>
              </div>
            ),
          })
        } else {
          return doAction()
        }
      }
    window.history.pushState = factory(originalPushState)
    window.history.replaceState = factory(originalReplaceState)

    const handler = (e: any) => {
      if (needConfirm) {
        e.preventDefault()

        present({
          title: message,
          content: ({ dismiss }) => (
            <div className="flex justify-end gap-3">
              <StyledButton
                variant="secondary"
                className="rounded-md"
                onClick={() => {
                  window.history.go(-1)
                  dismiss()
                }}
              >
                Leave
              </StyledButton>
              <StyledButton onClick={dismiss}>Cancel</StyledButton>
            </div>
          ),
        })
      }
    }
    window.addEventListener('popstate', handler)

    return () => {
      window.history.pushState = originalPushState
      window.history.replaceState = originalReplaceState
      window.removeEventListener('popstate', handler)
    }
  }, [message, needConfirm, present])
}
