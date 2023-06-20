/* eslint-disable react-hooks/rules-of-hooks */
import React, { memo, useMemo, useRef } from 'react'
import { clsx } from 'clsx'
import { compiler } from 'markdown-to-jsx'
import type { MarkdownToJSX } from 'markdown-to-jsx'
import type { FC, PropsWithChildren } from 'react'

import { useElementSize } from '~/providers/article/article-element-provider'

import { Gallery } from '../gallery'
import { FixedZoomedImage } from '../image'
import styles from './markdown.module.css'
import { CommentAtRule } from './parsers/comment-at'
import { ContainerRule } from './parsers/container'
import { InsertRule } from './parsers/ins'
import { KateXRule } from './parsers/katex'
import { MarkRule } from './parsers/mark'
import { MentionRule } from './parsers/mention'
import { SpoilderRule } from './parsers/spoiler'
import { MParagraph, MTableBody, MTableHead, MTableRow } from './renderers'
import { MDetails } from './renderers/collapse'
import { MFootNote } from './renderers/footnotes'

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
          // FIXME: footer tag in raw html will renders not as expected, but footer tag in this markdown lib will wrapper as linkReferer footnotes
          footer: MFootNote,
          details: MDetails,
          img: MarkdownImage,

          // for custom react component
          // LinkCard,
          Gallery,
          ...overrides,
        },

        extendsRules: {
          gfmTask: {
            react(node, _, state) {
              return (
                <label
                  className="mr-2 inline-flex items-center"
                  key={state?.key}
                >
                  <input type="checkbox" checked={node.completed} readOnly />
                </label>
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
          spoilder: SpoilderRule,
          mention: MentionRule,
          commentAt: CommentAtRule,
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
      overrides,
      extendsRules,
      renderers,
      additionalParserRules,
      rest,
    ])

    return (
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
    )
  })

const MarkdownImage = (props: any) => {
  const nextProps = {
    ...props,
  }
  nextProps.alt = props.alt?.replace(/^[¡!]/, '')
  const { w } = useElementSize()
  return <FixedZoomedImage {...nextProps} containerWidth={w} />
}
