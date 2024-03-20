import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react'
import clsx from 'clsx'
import { getHighlighterCore } from 'shiki'
import getWasm from 'shiki/wasm'
import type { FC } from 'react'
import type { HighlighterCore } from 'shiki'

import { getViewport } from '~/atoms/hooks'
import { AutoResizeHeight } from '~/components/modules/shared/AutoResizeHeight'
import { useMaskScrollArea } from '~/hooks/shared/use-mask-scrollarea'
import { stopPropagation } from '~/lib/dom'
import { clsxm } from '~/lib/helper'

import { MotionButtonBase } from '../../button'
import styles from './Shiki.module.css'
import { codeHighlighter, parseFilenameFromAttrs } from './utils'

interface Props {
  lang: string | undefined
  content: string

  attrs?: string
}

let highlighterCore: HighlighterCore | null = null

export const ShikiHighLighter: FC<Props> = (props) => {
  const { lang: language, content: value, attrs } = props

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(value)
  }, [value])

  const [highlighter, setHighlighter] = useState(highlighterCore)

  useLayoutEffect(() => {
    if (highlighterCore) {
      return
    }
    ;(async () => {
      const loaded = await getHighlighterCore({
        themes: [
          import('shiki/themes/github-light.mjs'),
          import('shiki/themes/github-dark.mjs'),
        ],
        langs: [
          () => import('shiki/langs/javascript.mjs'),
          () => import('shiki/langs/typescript.mjs'),
          () => import('shiki/langs/css.mjs'),
          () => import('shiki/langs/tsx.mjs'),
          () => import('shiki/langs/jsx.mjs'),
          () => import('shiki/langs/json.mjs'),
          () => import('shiki/langs/sql.mjs'),
          () => import('shiki/langs/rust.mjs'),
          () => import('shiki/langs/go.mjs'),
          () => import('shiki/langs/cpp.mjs'),
          () => import('shiki/langs/c.mjs'),
          () => import('shiki/langs/markdown.mjs'),
          () => import('shiki/langs/vue.mjs'),
          () => import('shiki/langs/html.mjs'),
          () => import('shiki/langs/asm.mjs'),
          () => import('shiki/langs/shell.mjs'),
          () => import('shiki/langs/ps.mjs'),
        ],
        loadWasm: getWasm,
      })
      setHighlighter(loaded)
      highlighterCore = loaded
    })()
  }, [])

  const [codeBlockRef, setCodeBlockRef] = useState<HTMLDivElement | null>(null)

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

      $el.querySelector('.highlighted')?.scrollIntoView({
        block: 'center',
      })
    } else {
      setIsOverflow(false)
    }
  }, [value, codeBlockRef])

  const highlightedHtml = useMemo(() => {
    if (!highlighter) return ''
    return codeHighlighter(highlighter, {
      attrs: attrs || '',
      // code: `${value.split('\n')[0].repeat(10)} // [!code highlight]\n${value}`,
      code: value,
      lang: language ? language.toLowerCase() : '',
    })
  }, [attrs, language, value, highlighter])

  const [renderedHtml, setRenderedHtml] = useState(highlightedHtml)
  useEffect(() => {
    setRenderedHtml(highlightedHtml)
    requestAnimationFrame(() => {
      if (!highlightedHtml) return
      if (!codeBlockRef) return

      const $lines = codeBlockRef.querySelectorAll('.line')
      const maxLineWidth = Math.max(
        ...Array.from($lines).map((el) => {
          return (el as HTMLElement).scrollWidth
        }),
      )
      $lines.forEach((el) => {
        ;(el as HTMLElement).style.width = `${maxLineWidth}px`
      })

      const pre = codeBlockRef.querySelector('pre')
      if (pre) setRenderedHtml(pre.outerHTML)
    })
  }, [codeBlockRef, highlightedHtml])

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
          <span className="shrink-0 flex-grow truncate">{filename}</span>
          <span
            className="pointer-events-none flex-shrink-0 flex-grow-0"
            aria-hidden
          >
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
            'absolute right-2 top-2 z-[1] flex rounded p-2 text-xs center',
            'rounded-md border border-accent/5 bg-accent/80 p-1.5 text-white backdrop-blur duration-200',
            'opacity-0 group-hover:opacity-100',
            filename && '!top-12',
          )}
        >
          <i className="icon-[mingcute--copy-2-fill] h-4 w-4" />
        </MotionButtonBase>
        <AutoResizeHeight spring className="relative">
          <div
            ref={setCodeBlockRef}
            className={clsxm(
              'relative max-h-[50vh] w-full overflow-auto',
              !isCollapsed ? '!max-h-[100%]' : isOverflow ? maskClassName : '',
              styles['scroll-container'],
            )}
            style={
              {
                '--sr-margin': !hasHeader
                  ? `${(language?.length || 0) + 1}em`
                  : '1rem',
              } as any
            }
            dangerouslySetInnerHTML={
              renderedHtml
                ? {
                    __html: renderedHtml,
                  }
                : undefined
            }
          >
            {renderedHtml ? undefined : (
              <pre className="bg-transparent px-5">
                <code className="!px-5">{value}</code>
              </pre>
            )}
          </div>

          {isOverflow && isCollapsed && (
            <div
              className={`absolute bottom-0 left-0 right-0 flex justify-center py-2 duration-200 ${
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
}
