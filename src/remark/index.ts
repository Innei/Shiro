import { createElement, Fragment } from 'react'
import rehypeReact from 'rehype-react'
import { toc } from 'mdast-util-toc'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'
import type { Result as TocResult } from 'mdast-util-toc'
import type { ReactNode } from 'react'

import { rehypeWrapCode } from './rehype-wrap-code'

interface ParserResult {
  jsx: ReactNode
  toc: TocItem[]
}

export interface TocItem {
  depth: number
  title: string
  url: string
  index: number
}

export const parseMarkdown = (markdownText: string): ParserResult => {
  const result: ParserResult = {
    jsx: null,
    toc: [] as TocItem[],
  }
  const pipeline = unified()
    .use(remarkParse)
    .use(() => (tree) => {
      const tocResult = toc(tree, { tight: true, ordered: true })
      // TODO
      const titles = parseTocTree(tocResult.map)

      result.toc = titles.map((title, index) => {
        return {
          title,
          url: `#${title}`,
          // TODO
          depth: 1,
          index,
        }
      })
    })
    .use(remarkGfm, {
      singleTilde: false,
    })
    .use(rehypeAutolinkHeadings, {
      properties: {
        className: ['springtide-anchor'],
        ariaHidden: true,
        tabIndex: -1,
      },
      content(node) {
        return [
          {
            type: 'element',
            tagName: 'span',
            properties: {
              className: ['icon-[mingcute--link-line]'],
            },
            children: [],
          },
        ]
      },
    })
    .use(rehypeSlug)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeWrapCode)
    .use(rehypeReact, {
      createElement,
      Fragment,
      components: {} as any,
    })

  result.jsx = pipeline.processSync(markdownText).result as ReactNode

  return result
}

function parseTocTree(items: TocResult['map']) {
  return (
    items?.children?.reduce((acc: string[], item) => {
      item.children.forEach((child) => {
        if (child.type === 'paragraph' && (child.children[0] as any).url) {
          acc.push((child.children[0] as any).url.slice(1))
        } else if (child.type === 'list') {
          acc.push(...parseTocTree(child))
        }
      })
      return acc
    }, []) || []
  )
}
