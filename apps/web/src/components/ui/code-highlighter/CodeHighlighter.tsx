import { useTranslations } from 'next-intl'
import type * as React from 'react'
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

import type { ShikiProps } from './shiki/Shiki'
import { ShikiHighLighter } from './shiki/Shiki'
import { ShikiHighLighterWrapper } from './shiki/ShikiWrapper'

interface Props {
  lang: string | undefined
  content: string
  startLineNumber?: number
}

/**
 * Style Fallback for Shiki render error
 */
export const PrismHighLighter: FC<Props> = (props) => {
  const { lang: language, content: value } = props

  const ref = useRef<HTMLElement>(null)
  useLoadHighlighter(ref)
  return (
    <ShikiHighLighterWrapper content={props.content} lang={props.lang}>
      <pre className="bg-transparent! font-mono!">
        <code
          className={`language-${language ?? 'markup'} block! bg-transparent! px-5! font-[inherit]! text-[14px]! leading-[24px]!`}
          ref={ref}
        >
          {value}
        </code>
      </pre>
    </ShikiHighLighterWrapper>
  )
}
export const HighLighterPrismCdn: FC<Props> = (props) => {
  const t = useTranslations('common')
  const { lang: language, content: value, startLineNumber = 1 } = props

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(value)
    toast.success(t('copy_to_clipboard'))
  }, [value, t])

  const ref = useRef<HTMLElement>(null)
  useLoadHighlighter(ref)
  return (
    <div
      className="group relative flex w-full flex-col overflow-auto"
      onCopy={stopPropagation}
    >
      <span
        className="absolute right-4 z-[1] translate-x-[-0.5em] translate-y-[0.5em] text-[0.8em] opacity-70"
        aria-hidden
      >
        {language?.toUpperCase()}
      </span>

      <pre
        className="line-numbers bg-transparent!"
        data-start={startLineNumber}
      >
        <code
          className={`language-${language ?? 'markup'} block! bg-transparent! font-mono! text-[14px]! font-medium!`}
          ref={ref}
        >
          {value}
        </code>
      </pre>

      <div
        className="invisible absolute right-[2em] top-[3em] cursor-pointer select-none text-[0.6em] font-semibold uppercase opacity-0 transition-[opacity,visibility] duration-300 ease-in-out after:absolute after:inset-x-[3px] after:bottom-[-3px] after:h-px after:bg-current after:content-[''] hover:opacity-100! group-hover:visible group-hover:opacity-40"
        onClick={handleCopy}
        aria-hidden
      >
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
    if (ref.current && window.Prism) {
      window.Prism.highlightElement(ref.current)
    }
  }, [content, lang])
  return (
    <pre
      onCopy={stopPropagation}
      className={clsxm('bg-transparent!', className)}
      style={style}
      data-start="1"
    >
      <code
        className={`language-${lang ?? 'markup'} bg-transparent!`}
        ref={ref}
      >
        {content}
      </code>
    </pre>
  )
}

const useLoadHighlighter = (ref: React.RefObject<HTMLElement | null>) => {
  const prevThemeCSS = useRef<ReturnType<typeof loadStyleSheet>>(undefined)
  const isPrintMode = useIsPrintMode()
  const isDark = useIsDark()

  useInsertionEffect(() => {
    const css = loadStyleSheet(
      `https://cdnjs.cloudflare.com/ajax/libs/prism-themes/1.9.0/prism-one-${
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
      'https://cdnjs.cloudflare.com/ajax/libs/prism/1.30.0/plugins/line-numbers/prism-line-numbers.min.css',
    )

    loadScript(
      'https://cdnjs.cloudflare.com/ajax/libs/prism/1.30.0/components/prism-core.min.js',
    )
      .then(() =>
        Promise.all([
          loadScript(
            'https://cdnjs.cloudflare.com/ajax/libs/prism/1.30.0/plugins/autoloader/prism-autoloader.min.js',
          ),
          loadScript(
            'https://cdnjs.cloudflare.com/ajax/libs/prism/1.30.0/plugins/line-numbers/prism-line-numbers.min.js',
          ),
        ]),
      )
      .then(() => {
        if (ref.current && window.Prism) {
          requestAnimationFrame(() => {
            if (ref.current && window.Prism) {
              window.Prism.highlightElement(ref.current)

              requestAnimationFrame(() => {
                if (ref.current && window.Prism) {
                  window.Prism.highlightElement(ref.current)
                }
              })
            }
          })
        } else if (window.Prism) {
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
