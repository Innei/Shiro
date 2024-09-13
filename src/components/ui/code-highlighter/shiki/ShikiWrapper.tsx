import clsx from 'clsx'
import type { Variants } from 'framer-motion'
import { AnimatePresence, m } from 'framer-motion'
import type { PropsWithChildren } from 'react'
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'

import { getViewport } from '~/atoms/hooks'
import { AutoResizeHeight } from '~/components/modules/shared/AutoResizeHeight'
import { useMaskScrollArea } from '~/hooks/shared/use-mask-scrollarea'
import { stopPropagation } from '~/lib/dom'
import { clsxm } from '~/lib/helper'

import { MotionButtonBase } from '../../button'
import styles from './Shiki.module.css'
import { parseFilenameFromAttrs } from './utils'

interface Props {
  lang: string | undefined
  content: string

  attrs?: string
  renderedHTML?: string
}

const copyIconVariants: Variants = {
  initial: {
    opacity: 1,
    scale: 1,
  },
  animate: {
    opacity: 1,
    scale: 1,
  },
  exit: {
    opacity: 0,
    scale: 0,
  },
}
export const ShikiHighLighterWrapper = forwardRef<
  HTMLDivElement,
  PropsWithChildren<
    Props & {
      shouldCollapsed?: boolean
    }
  >
>((props, ref) => {
  const {
    shouldCollapsed = true,
    lang: language,
    content: value,
    attrs,
  } = props

  const [copied, setCopied] = useState(false)
  const copiedTimerRef = useRef<any>()
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(value)
    setCopied(true)

    clearTimeout(copiedTimerRef.current)
    copiedTimerRef.current = setTimeout(() => {
      setCopied(false)
    }, 2000)
  }, [value])

  const [codeBlockRef, setCodeBlockRef] = useState<HTMLDivElement | null>(null)

  useImperativeHandle(ref, () => codeBlockRef!)

  const [isCollapsed, setIsCollapsed] = useState(shouldCollapsed)
  const [isOverflow, setIsOverflow] = useState(false)

  useEffect(() => {
    if (!shouldCollapsed) {
      return
    }
    const $el = codeBlockRef

    if (!$el) return

    const windowHeight = getViewport().h
    const halfWindowHeight = windowHeight / 2
    const $elScrollHeight = $el.scrollHeight

    if ($elScrollHeight >= halfWindowHeight) {
      setIsOverflow(true)

      const $hightlighted = $el.querySelector('.highlighted')
      if ($hightlighted) {
        const lineHeight = Number.parseInt(
          getComputedStyle($hightlighted).height || '0',
          10,
        )
        const $code = $el.querySelector('pre > code')!
        const childIndexInParent = Array.from($code.children).indexOf(
          $hightlighted,
        )

        $el.scrollTop = lineHeight * childIndexInParent - $el.clientHeight / 2
      }
    } else {
      setIsOverflow(false)
    }
  }, [value, codeBlockRef])

  const filename = useMemo(() => parseFilenameFromAttrs(attrs || ''), [attrs])
  const [, maskClassName] = useMaskScrollArea({
    element: codeBlockRef!,
    size: 'lg',
  })

  const hasHeader = !!filename

  return (
    <div
      className={clsx(styles['code-card'], 'shiki-block group')}
      onCopy={stopPropagation}
    >
      {!!filename && (
        <div className="z-10 flex w-full items-center justify-between rounded-t-xl bg-accent/20 px-5 py-2 text-sm">
          <span className="shrink-0 grow truncate">{filename}</span>
          <span className="pointer-events-none shrink-0 grow-0" aria-hidden>
            {language?.toUpperCase()}
          </span>
        </div>
      )}

      {!filename && !!language && (
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-3 right-3 z-[2] text-sm opacity-60"
        >
          {language.toUpperCase()}
        </div>
      )}
      <div className="bg-accent/5 py-4">
        <MotionButtonBase
          onClick={handleCopy}
          className={clsx(
            'absolute right-2 top-2 z-[3] flex text-xs center',
            'rounded-md border border-accent/5 bg-accent/80 p-1.5 text-white backdrop-blur duration-200',
            'opacity-0 group-hover:opacity-100',
            filename && '!top-12',
          )}
        >
          <AnimatePresence mode="wait">
            {copied ? (
              <m.i
                key={'copied'}
                className="icon-[mingcute--check-line] size-4"
                {...copyIconVariants}
              />
            ) : (
              <m.i
                key={'copy'}
                className="icon-[mingcute--copy-2-fill] size-4"
                {...copyIconVariants}
              />
            )}
          </AnimatePresence>
        </MotionButtonBase>
        <AutoResizeHeight spring className="relative">
          <div
            onCopy={stopPropagation}
            ref={setCodeBlockRef}
            className={clsxm(
              'relative max-h-[50vh] w-full overflow-auto',
              !isCollapsed ? '!max-h-full' : isOverflow ? maskClassName : '',
              styles['scroll-container'],
            )}
            style={
              {
                '--sr-margin': !hasHeader
                  ? `${(language?.length || 0) * 14 + 4}px`
                  : '1rem',
              } as any
            }
            dangerouslySetInnerHTML={useMemo(
              () =>
                props.renderedHTML
                  ? ({
                      __html: props.renderedHTML,
                    } as any)
                  : undefined,
              [props.renderedHTML],
            )}
          >
            {props.children}
          </div>

          {isOverflow && isCollapsed && (
            <div
              className={`absolute inset-x-0 bottom-0 flex justify-center py-2 duration-200 ${
                maskClassName.includes('mask-both') ||
                maskClassName.includes('mask-b')
                  ? ''
                  : 'pointer-events-none opacity-0'
              }`}
            >
              <button
                onClick={() => setIsCollapsed(false)}
                aria-hidden
                className="flex items-center justify-center text-xs"
              >
                <i className="icon-[mingcute--arrow-to-down-line]" />
                <span className="ml-2">展开</span>
              </button>
            </div>
          )}
        </AutoResizeHeight>
      </div>
    </div>
  )
})

ShikiHighLighterWrapper.displayName = 'ShikiHighLighterWrapper'
