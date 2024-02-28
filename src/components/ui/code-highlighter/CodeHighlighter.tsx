import React, {
  useCallback,
  useEffect,
  useInsertionEffect,
  useRef,
  useState,
} from 'react'
import clsx from 'clsx'
import type { FC } from 'react'

import { useIsPrintMode } from '~/atoms/css-media'
import { getViewport } from '~/atoms/hooks'
import { AutoResizeHeight } from '~/components/modules/shared/AutoResizeHeight'
import { useIsDark } from '~/hooks/common/use-is-dark'
import { clsxm } from '~/lib/helper'
import { loadScript, loadStyleSheet } from '~/lib/load-script'
import { toast } from '~/lib/toast'

import styles from './CodeHighlighter.module.css'

declare global {
  interface Window {
    Prism: any
  }
}

interface Props {
  lang: string | undefined
  content: string
}

export const HighLighter: FC<Props> = (props) => {
  const { lang: language, content: value } = props

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(value)
    toast.success('COPIED!')
  }, [value])

  const ref = useRef<HTMLElement>(null)
  useLoadHighlighter(ref)

  const codeBlockRef = useRef<HTMLPreElement>(null)

  const [isCollapsed, setIsCollapsed] = useState(true)
  const [isOverflow, setIsOverflow] = useState(false)
  useEffect(() => {
    const $el = codeBlockRef.current
    if (!$el) return

    const windowHeight = getViewport().h
    const halfWindowHeight = windowHeight / 2
    const $elScrollHeight = $el.scrollHeight
    if ($elScrollHeight >= halfWindowHeight) {
      setIsOverflow(true)
    } else {
      setIsOverflow(false)
    }
  }, [value])
  return (
    <div className={styles['code-wrap']}>
      <span className={styles['language-tip']} aria-hidden>
        {language?.toUpperCase()}
      </span>

      <AutoResizeHeight className="relative">
        <pre
          ref={codeBlockRef}
          className={clsx(
            'line-numbers max-h-[50vh] !bg-transparent',
            !isCollapsed && '!max-h-[100%]',
          )}
          data-start="1"
        >
          <code
            className={`language-${language ?? 'markup'} !bg-transparent`}
            ref={ref}
          >
            {value}
          </code>
        </pre>

        {isOverflow && isCollapsed && (
          <div className="absolute bottom-0 left-0 right-0 flex justify-center bg-[linear-gradient(180deg,transparent_0%,#fff_81%)] py-2 dark:bg-[linear-gradient(180deg,transparent_0%,oklch(var(--b1)/1)_81%)]">
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

      <div className={styles['copy-tip']} onClick={handleCopy} aria-hidden>
        Copy A
      </div>
    </div>
  )
}

export const BaseCodeHighlighter: Component<
  Props & {
    style: React.CSSProperties
  }
> = ({ content, lang, className, style }) => {
  const ref = useRef<HTMLElement>(null)
  useLoadHighlighter(ref)

  useEffect(() => {
    window.Prism?.highlightElement(ref.current)
  }, [content, lang])
  return (
    <pre
      className={clsxm('!bg-transparent', className)}
      style={style}
      data-start="1"
    >
      <code
        className={`language-${lang ?? 'markup'} !bg-transparent`}
        ref={ref}
      >
        {content}
      </code>
    </pre>
  )
}

const useLoadHighlighter = (ref: React.RefObject<HTMLElement>) => {
  const prevThemeCSS = useRef<ReturnType<typeof loadStyleSheet>>()
  const isPrintMode = useIsPrintMode()
  const isDark = useIsDark()

  useInsertionEffect(() => {
    const css = loadStyleSheet(
      `https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-M/prism-themes/1.9.0/prism-one-${
        isPrintMode ? 'light' : isDark ? 'dark' : 'light'
      }.css`,
    )

    if (prevThemeCSS.current) {
      const $prev = prevThemeCSS.current
      css.$link.onload = () => {
        $prev.remove()
      }
    }

    prevThemeCSS.current = css
  }, [isDark, isPrintMode])
  useInsertionEffect(() => {
    loadStyleSheet(
      'https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/prism/1.23.0/plugins/line-numbers/prism-line-numbers.min.css',
    )

    Promise.all([
      loadScript(
        'https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/prism/1.23.0/components/prism-core.min.js',
      ),
    ])
      .then(() =>
        Promise.all([
          loadScript(
            'https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/prism/1.23.0/plugins/autoloader/prism-autoloader.min.js',
          ),
          loadScript(
            'https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-M/prism/1.23.0/plugins/line-numbers/prism-line-numbers.min.js',
          ),
        ]),
      )
      .then(() => {
        if (ref.current) {
          requestAnimationFrame(() => {
            window.Prism?.highlightElement(ref.current)

            requestAnimationFrame(() => {
              window.Prism?.highlightElement(ref.current)
            })
          })
        } else {
          requestAnimationFrame(() => {
            window.Prism?.highlightAll()
            // highlightAll twice

            requestAnimationFrame(() => {
              window.Prism?.highlightAll()
            })
          })
        }
      })
  }, [])
}
