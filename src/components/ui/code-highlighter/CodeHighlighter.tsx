import type React from 'react'
import type { FC } from 'react'
import {
  use,
  useCallback,
  useEffect,
  useInsertionEffect,
  useMemo,
  useRef,
} from 'react'

import { useIsPrintMode } from '~/atoms/css-media'
import { useIsDark } from '~/hooks/common/use-is-dark'
import { stopPropagation } from '~/lib/dom'
import { clsxm } from '~/lib/helper'
import { loadScript, loadStyleSheet } from '~/lib/load-script'
import { toast } from '~/lib/toast'

import styles from './CodeHighlighter.module.css'
import type { ShikiProps } from './shiki/Shiki'
import { ShikiHighLighter } from './shiki/Shiki'

declare global {
  interface Window {
    Prism: any
  }
}

interface Props {
  lang: string | undefined
  content: string
}

export const HighLighterPrismCdn: FC<Props> = (props) => {
  const { lang: language, content: value } = props

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(value)
    toast.success('已复制到剪贴板')
  }, [value])

  const ref = useRef<HTMLElement>(null)
  useLoadHighlighter(ref)
  return (
    <div className={styles['code-wrap']} onCopy={stopPropagation}>
      <span className={styles['language-tip']} aria-hidden>
        {language?.toUpperCase()}
      </span>

      <pre className="line-numbers !bg-transparent" data-start="1">
        <code
          className={`language-${language ?? 'markup'} !bg-transparent`}
          ref={ref}
        >
          {value}
        </code>
      </pre>

      <div className={styles['copy-tip']} onClick={handleCopy} aria-hidden>
        Copy
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
      onCopy={stopPropagation}
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

const useLoadHighlighter = (ref: React.RefObject<HTMLElement | null>) => {
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

    loadScript(
      'https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/prism/1.23.0/components/prism-core.min.js',
    )
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
            requestAnimationFrame(() => {
              window.Prism?.highlightAll()
            })
          })
        }
      })
  }, [])
}
let bundledLanguagesKeysSet: Set<string> | null = null
export const ShikiFallback: FC<ShikiProps> = (props) => {
  const { lang } = props
  const shikiSupported = use(
    useMemo(async () => {
      if (!lang) return false

      if (!bundledLanguagesKeysSet) {
        const { bundledLanguages } = await import('shiki/langs')
        bundledLanguagesKeysSet = new Set(Object.keys(bundledLanguages))
      }

      return bundledLanguagesKeysSet.has(lang)
    }, [lang]),
  )
  return (
    <ShikiHighLighter {...props} lang={shikiSupported ? props.lang : 'text'} />
  )
}
