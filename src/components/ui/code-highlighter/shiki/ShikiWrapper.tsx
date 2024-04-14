import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react'
import clsx from 'clsx'
import type { PropsWithChildren } from 'react'

import { getViewport } from '~/atoms/hooks'
import { AutoResizeHeight } from '~/components/modules/shared/AutoResizeHeight'
import { useMaskScrollArea } from '~/hooks/shared/use-mask-scrollarea'
import { stopPropagation } from '~/lib/dom'
import { clsxm } from '~/lib/helper'
import { toast } from '~/lib/toast'

import { MotionButtonBase } from '../../button'
import styles from './Shiki.module.css'
import { parseFilenameFromAttrs } from './utils'

interface Props {
  lang: string | undefined
  content: string

  attrs?: string
  renderedHTML?: string
}

export const ShikiHighLighterWrapper = forwardRef<
  HTMLDivElement,
  PropsWithChildren<Props>
>((props, ref) => {
  const { lang: language, content: value, attrs } = props

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(value)
    toast.success('已复制到剪贴板')
  }, [value])

  const [codeBlockRef, setCodeBlockRef] = useState<HTMLDivElement | null>(null)

  useImperativeHandle(ref, () => codeBlockRef!)

  const [isCollapsed, setIsCollapsed] = useState(true)
  const [isOverflow, setIsOverflow] = useState(false)
  useEffect(() => {
    const $el = codeBlockRef

    if (!$el) return

    const windowHeight = getViewport().h
    const halfWindowHeight = windowHeight / 2
    const $elScrollHeight = $el.scrollHeight
    if ($elScrollHeight >= halfWindowHeight) {
      setIsOverflow(true)

      const $hightlighted = $el.querySelector('.highlighted')
      if ($hightlighted) {
        const lineHeight = parseInt(
          getComputedStyle($hightlighted).height || '0',
          10,
        )
        const $code = $el.querySelector('pre > code')!
        const childIndexInParent = Array.from($code.children).indexOf(
          $hightlighted,
        )

        $el.scrollTop = lineHeight * childIndexInParent - 30
      }
    } else {
      setIsOverflow(false)
    }
  }, [value, codeBlockRef])

  const filename = useMemo(() => {
    return parseFilenameFromAttrs(attrs || '')
  }, [attrs])
  const [, maskClassName] = useMaskScrollArea({
    element: codeBlockRef!,
    size: 'lg',
  })

  const hasHeader = !!filename

  return (
    <div
      className={clsx(styles['code-card'], 'group')}
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
          className="pointer-events-none absolute bottom-3 right-3 z-10 text-sm opacity-60"
        >
          {language.toUpperCase()}
        </div>
      )}
      <div className="bg-accent/5 py-4">
        <MotionButtonBase
          onClick={handleCopy}
          className={clsx(
            'absolute right-2 top-2 z-[1] flex text-xs center',
            'rounded-md border border-accent/5 bg-accent/80 p-1.5 text-white backdrop-blur duration-200',
            'opacity-0 group-hover:opacity-100',
            filename && '!top-12',
          )}
        >
          <i className="icon-[mingcute--copy-2-fill] size-4" />
        </MotionButtonBase>
        <AutoResizeHeight spring className="relative">
          <div
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
                ['mask-both-lg', 'mask-b-lg'].includes(maskClassName)
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
