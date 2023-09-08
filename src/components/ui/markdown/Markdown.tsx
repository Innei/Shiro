'use client'

/* eslint-disable react-hooks/rules-of-hooks */
import React, { Fragment, memo, Suspense, useMemo, useRef } from 'react'
import { clsx } from 'clsx'
import { compiler, sanitizeUrl } from 'markdown-to-jsx'
import dynamic from 'next/dynamic'
import Script from 'next/script'
import type { MarkdownToJSX } from 'markdown-to-jsx'
import type { FC, PropsWithChildren } from 'react'

import { MAIN_MARKDOWN_ID } from '~/constants/dom-id'
import { isDev } from '~/lib/env'
import { noopObj } from '~/lib/noop'
import { springScrollToElement } from '~/lib/scroller'

import { Gallery } from '../gallery'
import { LinkCard } from '../link-card'
import { MLink } from '../link/MLink'
import styles from './markdown.module.css'
import { ContainerRule } from './parsers/container'
import { InsertRule } from './parsers/ins'
import { KateXRule } from './parsers/katex'
import { MarkRule } from './parsers/mark'
import { MentionRule } from './parsers/mention'
import { SpoilerRule } from './parsers/spoiler'
import {
  MParagraph,
  MTable,
  MTableBody,
  MTableHead,
  MTableRow,
} from './renderers'
import { MDetails } from './renderers/collapse'
import { MFootNote } from './renderers/footnotes'
import { MHeader } from './renderers/heading'
import { MarkdownImage } from './renderers/image'
import { MTag } from './renderers/tag'

const CodeBlock = dynamic(() => import('~/components/widgets/shared/CodeBlock'))

export interface MdProps {
  value?: string

  style?: React.CSSProperties
  readonly renderers?: { [key: string]: Partial<MarkdownToJSX.Rule> }
  wrapperProps?: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  >
  codeBlockFully?: boolean
  className?: string
  as?: React.ElementType

  allowsScript?: boolean
}

export const Markdown: FC<MdProps & MarkdownToJSX.Options & PropsWithChildren> =
  memo((props) => {
    const {
      value,
      renderers,
      style,
      wrapperProps = {},
      codeBlockFully = false,
      className,
      overrides,
      extendsRules,
      additionalParserRules,
      as: As = 'div',
      allowsScript = false,
      ...rest
    } = props

    const ref = useRef<HTMLDivElement>(null)

    const node = useMemo(() => {
      if (!value && typeof props.children != 'string') return null

      const mdElement = compiler(`${value || props.children}`, {
        wrapper: null,
        // @ts-ignore
        overrides: {
          p: MParagraph,

          thead: MTableHead,
          tr: MTableRow,
          tbody: MTableBody,
          table: MTable,
          // FIXME: footer tag in raw html will renders not as expected, but footer tag in this markdown lib will wrapper as linkReferer footnotes
          footer: MFootNote,
          details: MDetails,
          img: MarkdownImage,
          tag: MTag,

          // for custom react component
          // Tag: MTag,

          LinkCard,
          Gallery,
          script: allowsScript ? Script : undefined,

          ...overrides,
        },

        extendsRules: {
          heading: {
            react(node, output, state) {
              return (
                <MHeader id={node.id} level={node.level} key={state?.key}>
                  {output(node.content, state!)}
                </MHeader>
              )
            },
          },
          gfmTask: {
            react(node, _, state) {
              return (
                <input
                  type="checkbox"
                  key={state?.key}
                  checked={node.completed}
                  readOnly
                />
              )
            },
          },

          link: {
            react(node, output, state) {
              const { target, title } = node
              const realText =
                node.content[0]?.content === node.target
                  ? void 0
                  : node.content[0]?.content

              return (
                <MLink
                  href={sanitizeUrl(target)!}
                  title={title}
                  key={state?.key}
                  text={realText}
                >
                  {output(node.content, state!)}
                </MLink>
              )
            },
          },

          footnoteReference: {
            react(node, output, state) {
              const { footnoteMap, target, content } = node
              const footnote = footnoteMap.get(content)
              const linkCardId = (() => {
                try {
                  const thisUrl = new URL(footnote?.footnote?.replace(': ', ''))
                  const isCurrentHost =
                    thisUrl.hostname === window.location.hostname

                  if (!isCurrentHost && !isDev) {
                    return undefined
                  }
                  const pathname = thisUrl.pathname
                  return pathname.slice(1)
                } catch {
                  return undefined
                }
              })()

              return (
                <Fragment key={state?.key}>
                  <a
                    href={sanitizeUrl(target)!}
                    onClick={(e) => {
                      e.preventDefault()

                      springScrollToElement(
                        document.getElementById(content)!,

                        -window.innerHeight / 2,
                      )
                    }}
                  >
                    <sup key={state?.key}>^{content}</sup>
                  </a>
                  {linkCardId && <LinkCard id={linkCardId} source="mx-space" />}
                </Fragment>
              )
            },
          },
          codeBlock: {
            react(node, output, state) {
              return (
                <CodeBlock
                  key={state?.key}
                  content={node.content}
                  lang={node.lang}
                />
              )
            },
          },

          list: {
            react(node, output, state) {
              const Tag = node.ordered ? 'ol' : 'ul'

              return (
                <Tag key={state?.key} start={node.start}>
                  {node.items.map((item: any, i: number) => {
                    let className = ''
                    if (item[0]?.type == 'gfmTask') {
                      className = 'list-none flex items-center'
                    }

                    return (
                      <li className={className} key={i}>
                        {output(item, state!)}
                      </li>
                    )
                  })}
                </Tag>
              )
            },
          },

          ...extendsRules,
          ...renderers,
        },
        additionalParserRules: {
          spoilder: SpoilerRule,
          mention: MentionRule,

          mark: MarkRule,
          ins: InsertRule,
          kateX: KateXRule,
          container: ContainerRule,

          ...additionalParserRules,
        },
        ...rest,
      })

      return mdElement
    }, [
      value,
      props.children,
      allowsScript,
      overrides,
      extendsRules,
      renderers,
      additionalParserRules,
      rest,
    ])

    return (
      <Suspense>
        <As
          style={style}
          {...wrapperProps}
          ref={ref}
          className={clsx(
            styles['md'],
            codeBlockFully ? styles['code-fully'] : undefined,
            className,
          )}
        >
          {node}
        </As>
      </Suspense>
    )
  })
Markdown.displayName = 'Markdown'

export const MainMarkdown: FC<
  MdProps & MarkdownToJSX.Options & PropsWithChildren
> = (props) => {
  const { wrapperProps = noopObj } = props
  return (
    <Markdown
      as="main"
      {...props}
      wrapperProps={useMemo(
        () => ({
          ...wrapperProps,
          id: MAIN_MARKDOWN_ID,
        }),
        [wrapperProps],
      )}
    />
  )
}
