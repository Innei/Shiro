import clsx from 'clsx'
import { AnimatePresence, m } from 'motion/react'
import { useEffect, useRef, useState } from 'react'

import { useIsMobile } from '~/atoms/hooks'
import { MotionButtonBase } from '~/components/ui/button'
import { DividerVertical } from '~/components/ui/divider'
import { useModalStack } from '~/components/ui/modal'
import { DOMCustomEvents } from '~/constants/event'
import { useIsClient } from '~/hooks/common/use-is-client'
import { stopPropagation } from '~/lib/dom'
import { toast } from '~/lib/toast'

import { useIsInBanCopyContext } from './BanCopyWrapper'
import { CommentModal } from './CommentModal'

export const WithArticleSelectionAction: Component<{
  refId: string
  title: string
  canComment: boolean
}> = ({ refId, title, children, canComment }) => {
  const isMobile = useIsMobile()
  const [pos, setPos] = useState({
    x: 0,
    y: 0,
  })
  const [show, setShow] = useState(false)
  const [selectedText, setSelectedText] = useState('')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent): void => {
      if (window.getSelection()?.toString().length === 0) {
        setShow(false)
        return
      }
      if (ref.current?.contains(e.target as Node)) return
      setShow(false)
    }
    document.addEventListener('mousedown', handler)
    document.addEventListener('mouseup', handler)
    return () => {
      document.removeEventListener('mousedown', handler)
      document.removeEventListener('mouseup', handler)
    }
  }, [])

  const isClient = useIsClient()
  const { present } = useModalStack()

  useEffect(() => {
    // wait for toc listener to be registered
    setTimeout(() => {
      document.dispatchEvent(new CustomEvent(DOMCustomEvents.RefreshToc))
    }, 1000)
  }, [])

  const canCopy = !useIsInBanCopyContext()

  const actionCanActivated = canCopy || canComment

  if (isMobile || !isClient) return children
  if (!actionCanActivated) return children
  return (
    <div
      className="relative"
      ref={ref}
      onMouseUp={(e) => {
        const $ = ref.current
        if (!$) return

        const selection = window.getSelection()
        if (!selection) return
        const selectedText = selection.toString()
        if (selectedText.length === 0) return
        const { top, left } = $.getBoundingClientRect()
        setShow(true)
        setSelectedText(selectedText)
        setPos({
          x: e.clientX - left + 10,
          y: e.clientY - top + 10,
        })
      }}
    >
      {children}

      <AnimatePresence>
        {show && (
          <m.div
            className={clsx(
              'absolute z-10 rounded-lg bg-gradient-to-b from-zinc-50/50 to-white/90 p-1 text-sm shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5',
              'backdrop-blur-sm dark:from-zinc-900/50 dark:to-zinc-800/90 dark:ring-white/10 dark:hover:ring-white/20',
              'whitespace-nowrap [&_button]:whitespace-nowrap',
            )}
            style={{
              left: pos.x,
              top: pos.y - 40,
            }}
            initial={{ y: 10, opacity: 0.8, scale: 0.1 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{
              scale: 0,
              opacity: 0,
            }}
          >
            {canCopy && (
              <>
                <MotionButtonBase
                  data-event="selection-comment"
                  className="rounded-md px-2 py-1 hover:bg-slate-100/80 dark:hover:bg-zinc-900/90"
                  onMouseUp={stopPropagation}
                  onClick={() => {
                    navigator.clipboard.writeText(selectedText)
                    setShow(false)
                    toast.success('已复制到剪贴板')
                  }}
                >
                  复制
                </MotionButtonBase>
                <DividerVertical className="mx-1" />
              </>
            )}
            {canComment && (
              <MotionButtonBase
                data-event="selection-comment"
                className="rounded-md px-2 py-1 hover:bg-slate-100/80 dark:hover:bg-zinc-900/90"
                onClick={() => {
                  present({
                    title: '评论',

                    content: (rest) => (
                      <CommentModal
                        refId={refId}
                        title={title}
                        initialValue={`> ${selectedText
                          ?.split('\n')
                          .join('')}\n\n`}
                        {...rest}
                      />
                    ),
                  })
                }}
              >
                引用评论
              </MotionButtonBase>
            )}
          </m.div>
        )}
      </AnimatePresence>
    </div>
  )
}
