import { createElement, Fragment } from 'react'
import rehypeReact from 'rehype-react'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'
import type { ReactNode } from 'react'

import { rehypeWrapCode } from './rehype-wrap-code'

interface ParserResult {
  jsx: ReactNode
}

export const parseMarkdown = (markdownText: string): ParserResult => {
  const result: ParserResult = {
    jsx: null,
  }
  const pipeline = unified()
    .use(remarkParse)
    .use(remarkGfm, {
      singleTilde: false,
    })
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeSlug)
    // .use(() => (tree) => {
    //   visit(tree, 'element', (node) => {
    //     console.log(node)
    //   })
    // })
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

    .use(rehypeWrapCode)
    .use(rehypeReact, {
      createElement,
      Fragment,
      components: {} as any,
    })

  result.jsx = pipeline.processSync(markdownText).result as ReactNode

  return result
}
