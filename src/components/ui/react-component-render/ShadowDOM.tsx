import { useIsomorphicLayoutEffect } from 'foxact/use-isomorphic-layout-effect'
import type { FC, PropsWithChildren, ReactNode } from 'react'
import * as React from 'react'
import { createContext, createElement, memo, useMemo, useState } from 'react'
import root from 'react-shadow'

import { useIsDark } from '~/hooks/common/use-is-dark'

const MemoedDangerousHTMLStyle: FC<
  {
    children: string
  } & React.DetailedHTMLProps<
    React.StyleHTMLAttributes<HTMLStyleElement>,
    HTMLStyleElement
  > &
    Record<string, unknown>
> = memo(({ children, ...rest }) => (
  <style
    {...rest}
    dangerouslySetInnerHTML={useMemo(
      () => ({
        __html: children,
      }),
      [children],
    )}
  />
))

const weakMapElementKey = new WeakMap<
  HTMLStyleElement | HTMLLinkElement,
  string
>()

const generateRandomKey = () => Math.random().toString(36).substring(2, 15)
const cloneStylesElement = (_mutationRecord?: MutationRecord) => {
  const $styles = document.head.querySelectorAll('style').values()
  const reactNodes = [] as ReactNode[]

  for (const $style of $styles) {
    let key = weakMapElementKey.get($style)

    if (!key) {
      key = generateRandomKey()

      weakMapElementKey.set($style, key)
    }

    reactNodes.push(
      createElement(MemoedDangerousHTMLStyle, {
        key,
        children: $style.innerHTML,
      }),
    )

    const styles = getLinkedStaticStyleSheets()

    for (const style of styles) {
      let key = weakMapElementKey.get(style.ref)
      if (!key) {
        key = generateRandomKey()
        weakMapElementKey.set(style.ref, key)
      }

      reactNodes.push(
        createElement(MemoedDangerousHTMLStyle, {
          key,
          children: style.cssText,
          ['data-href']: style.ref.href,
        }),
      )
    }
  }

  return reactNodes
}

export const ShadowDOMContext = createContext<ShadowRoot | null>(null)
export const ShadowDOM: FC<
  PropsWithChildren<
    React.HTMLProps<HTMLElement> & {
      injectHostStyles: boolean
    }
  >
> = (props) => {
  const { injectHostStyles, ...rest } = props

  const [stylesElements, setStylesElements] = useState<ReactNode[]>(() => {
    if (injectHostStyles) {
      return cloneStylesElement()
    }
    return []
  })

  useIsomorphicLayoutEffect(() => {
    if (!injectHostStyles) return
    const mutationObserver = new MutationObserver((e) => {
      const event = e[0]

      setStylesElements(cloneStylesElement(event))
    })
    mutationObserver.observe(document.head, {
      childList: true,
      subtree: true,
    })

    return () => {
      mutationObserver.disconnect()
    }
  }, [injectHostStyles])

  const dark = useIsDark()

  const [ref, setRef] = useState<HTMLElement | null>(null)
  return (
    <root.div {...rest} ref={setRef}>
      <ShadowDOMContext.Provider value={ref?.shadowRoot ?? null}>
        <div id="shadow-html" data-theme={dark ? 'dark' : 'light'}>
          {stylesElements}
          {props.children}
        </div>
      </ShadowDOMContext.Provider>
    </root.div>
  )
}

const cacheCssTextMap = {} as Record<string, string>

function getLinkedStaticStyleSheets() {
  const $links = document.head
    .querySelectorAll('link[rel=stylesheet]')
    .values() as unknown as HTMLLinkElement[]

  const styleSheetMap = new WeakMap<
    Element | ProcessingInstruction,
    CSSStyleSheet
  >()

  const cssArray = [] as { cssText: string; ref: HTMLLinkElement }[]

  for (const sheet of document.styleSheets) {
    if (!sheet.href) continue
    if (!sheet.ownerNode) continue
    styleSheetMap.set(sheet.ownerNode, sheet)
  }

  for (const $link of $links) {
    const sheet = styleSheetMap.get($link)
    if (!sheet) continue
    if (!sheet.href) continue
    const hasCache = cacheCssTextMap[sheet.href]
    if (!hasCache) {
      if (!sheet.href) continue
      try {
        const rules = sheet.cssRules || sheet.rules
        let cssText = ''
        for (const rule of rules) {
          cssText += rule.cssText
        }
        cacheCssTextMap[sheet.href] = cssText
      } catch (err) {
        console.error('Failed to get cssText for', sheet.href, err)
      }
    }

    cssArray.push({
      cssText: cacheCssTextMap[sheet.href],
      ref: $link,
    })
  }

  return cssArray
}
