'use client'

import { clsx } from 'clsx'
import type { MarkdownToJSX } from 'markdown-to-jsx'
import { compiler, RuleType, sanitizer } from 'markdown-to-jsx'
import Script from 'next/script'
import type * as React from 'react'
import type { FC, PropsWithChildren } from 'react'
import { Fragment, memo, Suspense, useMemo, useRef } from 'react'

import { ErrorBoundary } from '~/components/common/ErrorBoundary'
import { CodeBlockRender } from '~/components/modules/shared/CodeBlock'
import { FloatPopover } from '~/components/ui/float-popover'
import { MAIN_MARKDOWN_ID } from '~/constants/dom-id'
import { isDev } from '~/lib/env'
import { noopObj } from '~/lib/noop'
import { springScrollToElement } from '~/lib/scroller'

import { Gallery } from '../gallery'
import { MarkdownLink } from '../link/MarkdownLink'
import { LinkCard, LinkCardSource } from '../link-card'
import styles from './markdown.module.css'
import { ContainerRule } from './parsers/container'
import { InsertRule } from './parsers/ins'
import { KateXBlockRule, KateXRule } from './parsers/katex'
import { MentionRule } from './parsers/mention'
import { SpoilerRule } from './parsers/spoiler'
import {
  MParagraph,
  MTable,
  MTableBody,
  MTableHead,
  MTableRow,
  MTableTd,
} from './renderers'
import { MBlockQuote } from './renderers/blockqoute'
import { MDetails } from './renderers/collapse'
import { MFootNote } from './renderers/footnotes'
import { createMarkdownHeadingComponent } from './renderers/heading'
import { MarkdownImage } from './renderers/image'
import { Tab, Tabs } from './renderers/tabs'
import { MTag } from './renderers/tag'
import { Video } from './renderers/video'
import { getFootNoteDomId, getFootNoteRefDomId } from './utils/get-id'
import { redHighlight } from './utils/redHighlight'

export interface MdProps {
  value?: string

  style?: React.CSSProperties
  readonly renderers?: Partial<MarkdownToJSX.PartialRules>
  wrapperProps?: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  >
  codeBlockFully?: boolean
  className?: string
  as?: React.ElementType

  allowsScript?: boolean

  removeWrapper?: boolean
}

const debugValue = isDev
  ? ''
  : //       '```component shadow with-styles\n' +
    //         `import=https://cdn.jsdelivr.net/npm/@innei/react-cdn-components@0.0.33/dist/components/ShadowDOMTest.js
    // name=MDX.ShadowDOMTest
    // height=4 05` +
    //         '\n' +
    //         '```',
    //     ].join('')
    null
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

      as: As = 'div',
      allowsScript = false,
      removeWrapper = false,

      ...rest
    } = props

    const ref = useRef<HTMLDivElement>(null)

    const MHeader = useMemo(() => createMarkdownHeadingComponent(), [])

    const node = useMemo(() => {
      const mdContent = debugValue || value || props.children

      if (!mdContent) return null
      if (typeof mdContent != 'string') return null

      const mdElement = compiler(mdContent, {
        slugify,
        doNotProcessHtmlElements: ['tab', 'style', 'script'] as any[],
        wrapper: null,

        overrides: {
          p: MParagraph,

          thead: MTableHead,
          tr: MTableRow,
          tbody: MTableBody,
          td: MTableTd,
          table: MTable,
          // FIXME: footer tag in raw html will renders not as expected, but footer tag in this markdown lib will wrapper as linkReferer footnotes
          footer: MFootNote,
          details: MDetails,
          img: MarkdownImage,
          tag: MTag,

          Tabs,

          tab: Tab,
          video: Video,

          // for custom react component
          // Tag: MTag,

          LinkCard,
          Gallery,
          script: allowsScript ? Script : undefined!,

          ...overrides,
        },

        overrideRules: {
          [RuleType.heading]: {
            render(node, output, state) {
              return (
                <MHeader id={node.id} level={node.level} key={state?.key}>
                  {output(node.children, state!)}
                </MHeader>
              )
            },
          },
          [RuleType.textMarked]: {
            render(node, output, state) {
              return (
                <mark key={state?.key} className="rounded-md">
                  <span className="px-1">{output(node.children, state!)}</span>
                </mark>
              )
            },
          },
          [RuleType.gfmTask]: {
            render(node, _, state) {
              return (
                <input
                  type="checkbox"
                  key={state?.key}
                  checked={node.completed}
                  readOnly
                  className="!size-[1em]"
                />
              )
            },
          },

          [RuleType.link]: {
            render(node, output, state) {
              const { target, title } = node

              let realText = ''

              for (const child of node.children) {
                if (child.type === RuleType.text) {
                  realText += child.text
                }
              }

              return (
                <MarkdownLink
                  href={sanitizer(target)!}
                  title={title}
                  key={state?.key}
                  text={realText}
                >
                  {output(node.children, state!)}
                </MarkdownLink>
              )
            },
          },

          [RuleType.blockQuote]: {
            render(node, output, state) {
              return (
                <MBlockQuote key={state?.key} alert={node.alert}>
                  {output(node.children, state!)}
                </MBlockQuote>
              )
            },
          },

          [RuleType.footnoteReference]: {
            render(node, output, state) {
              const { footnoteMap, text } = node
              const footnote = footnoteMap.get(text)
              const linkCardId = (() => {
                try {
                  const thisUrl = new URL(
                    footnote?.footnote?.replace(': ', '') ?? '',
                  )
                  const isCurrentHost =
                    thisUrl.hostname === window.location.hostname
                  if (!isCurrentHost && !isDev) {
                    return
                  }
                  const { pathname } = thisUrl
                  return pathname.slice(1)
                } catch {
                  return
                }
              })()

              return (
                <Fragment key={state?.key}>
                  <FloatPopover
                    wrapperClassName="inline"
                    as="span"
                    triggerElement={
                      <a
                        href={`${getFootNoteDomId(text)}`}
                        onClick={(e) => {
                          e.preventDefault()
                          const id = getFootNoteDomId(text)
                          springScrollToElement(
                            document.getElementById(id)!,
                            -window.innerHeight / 2,
                          )
                          redHighlight(id)
                        }}
                      >
                        <sup
                          id={`${getFootNoteRefDomId(text)}`}
                        >{`[^${text}]`}</sup>
                      </a>
                    }
                    type="tooltip"
                  >
                    {footnote?.footnote?.slice(1)}
                  </FloatPopover>
                  {linkCardId && (
                    <LinkCard
                      id={linkCardId}
                      source={LinkCardSource.MixSpace}
                    />
                  )}
                </Fragment>
              )
            },
          },

          [RuleType.codeBlock]: {
            render(node, output, state) {
              return (
                <CodeBlockRender
                  key={state?.key}
                  content={node.text}
                  lang={node.lang}
                  attrs={node?.rawAttrs}
                />
              )
            },
          },
          [RuleType.codeInline]: {
            render(node, output, state) {
              return (
                <code
                  key={state?.key}
                  className="rounded-md bg-zinc-200 px-2 font-mono dark:bg-neutral-800"
                >
                  {node.text}
                </code>
              )
            },
          },

          [RuleType.orderedList]: listRule as any,
          [RuleType.unorderedList]: listRule as any,

          ...renderers,
        },
        extendsRules: {
          spoilder: SpoilerRule,
          mention: MentionRule,

          ins: InsertRule,
          kateX: KateXRule,
          kateXBlock: KateXBlockRule,
          container: ContainerRule,
          ...extendsRules,
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
      rest,
      MHeader,
    ])

    if (removeWrapper) return <Suspense>{node}</Suspense>

    return (
      <ErrorBoundary>
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
      </ErrorBoundary>
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

// not complete, but probably good enough
function slugify(str: string) {
  return (
    str
      .replaceAll(/[ÀÁÂÃÄÅæ]/gi, 'a')
      .replaceAll(/ç/gi, 'c')
      .replaceAll(/ð/gi, 'd')
      .replaceAll(/[ÈÉÊË]/gi, 'e')
      .replaceAll(/[ÏÎÍÌ]/gi, 'i')
      .replaceAll(/Ñ/gi, 'n')
      .replaceAll(/[øœÕÔÓÒ]/gi, 'o')
      .replaceAll(/[ÜÛÚÙ]/gi, 'u')
      .replaceAll(/[ŸÝ]/gi, 'y')
      // remove non-chinese, non-latin, non-number, non-space
      .replaceAll(
        /[^\u4E00-\u9FFF\u3040-\u309F\u30A0-\u30FF\uAC00-\uD7AFa-z0-9- ]/gi,
        '',
      )
      .replaceAll(' ', '-')
      .toLowerCase()
  )
}

const listRule: Partial<
  MarkdownToJSX.Rule<
    MarkdownToJSX.OrderedListNode | MarkdownToJSX.UnorderedListNode
  >
> = {
  render(node, output, state) {
    const Tag = node.ordered ? 'ol' : 'ul'

    return (
      <Tag
        key={state?.key}
        start={node.type === RuleType.orderedList ? node.start : undefined}
      >
        {node.items.map((item: any, i: number) => {
          let className = ''
          if (item[0]?.type === 'gfmTask') {
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
}
