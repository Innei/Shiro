import { Suspense } from 'react'
import type { DocumentComponent } from 'storybook/typings'

import { ShikiHighLighter as Shiki } from './shiki/Shiki'

export const ShikiHighLighter: DocumentComponent = () => {
  return 'React 18 is not support this component, becuase of the `use` is only support in React 19'
  return (
    <Suspense>
      <Shiki
        content={`import {
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
  import { clsxm } from '~/lib/helper'
  
  import { MotionButtonBase } from '../../button'
  import styles from './Shiki.module.css'
  import { codeHighlighter, parseFilenameFromAttrs } from './utils'
  
  interface Props {
    lang: string | undefined
    content: string
    raw?: string
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
  
    const renderedHtml = useMemo(() => {
      if (!highlighter) return ''
      return codeHighlighter(highlighter, {
        attrs: attrs || '',
        code: value,
        lang: language || '',
      })
    }, [attrs, language, value, highlighter])
  
    const filename = useMemo(() => {
      return parseFilenameFromAttrs(attrs || '')
    }, [attrs])
    const [, maskClassName] = useMaskScrollArea({
      element: codeBlockRef!,
      size: 'lg',
    })
  
    return (
      <div className={clsx(styles['code-card'], 'group')}>
        {!!filename && (
          <div className="flex w-full items-center justify-between rounded-t-xl bg-accent/20 px-4 py-2 text-sm">
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
            className={clsxm(
              'pointer-events-none absolute bottom-2 right-2 text-sm opacity-60',
              isOverflow ? 'right-6' : '',
            )}
          >
            {language.toUpperCase()}
          </div>
        )}
        <div className="bg-accent/10 px-4 py-2">
          <AutoResizeHeight className="relative">
            <MotionButtonBase
              onClick={handleCopy}
              className={clsx(
                'text-xscenter absolute right-1 top-1 z-[1] flex rounded border border-current p-2',
                'dark:bg-primary-300/10 rounded-md border border-black/5 bg-accent/5 p-1.5 text-gray-600 duration-200 hover:text-gray-900 dark:border-white/10 dark:text-gray-400 dark:hover:text-gray-50',
                'opacity-0 group-hover:opacity-60',
              )}
            >
              <i className="i-mingcute-copy-2-fill h-4 w-4" />
            </MotionButtonBase>
            <div
              ref={setCodeBlockRef}
              className={clsxm(
                'relative max-h-[50vh] w-full overflow-auto scrollbar-none',
                !isCollapsed ? '!max-h-[100%]' : isOverflow ? maskClassName : '',
              )}
              dangerouslySetInnerHTML={
                renderedHtml
                  ? {
                      __html: renderedHtml,
                    }
                  : undefined
              }
            >
              {renderedHtml ? undefined : (
                <pre className="bg-transparent">
                  <code>{value}</code>
                </pre>
              )}
            </div>
  
            {isOverflow && isCollapsed && (
              <div className="absolute bottom-0 left-0 right-0 flex justify-center py-2">
                <button
                  onClick={() => setIsCollapsed(false)}
                  aria-hidden
                  className="flex items-center justify-center text-xs"
                >
                  <i className="i-mingcute-arrow-to-down-line" />
                  <span className="ml-2">展开</span>
                </button>
              </div>
            )}
          </AutoResizeHeight>
        </div>
      </div>
    )
  }
  `}
        lang="tsx"
        attrs='filename="ShikiHighLighter.tsx" {3,4}'
      />
    </Suspense>
  )
}
