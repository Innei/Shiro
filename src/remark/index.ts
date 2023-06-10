import { createElement, Fragment } from 'react'
import rehypeReact from 'rehype-react'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'

import { rehypeWrapCode } from './rehype-wrap-code'

const pipeline = unified()
  .use(remarkParse)
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

export const parseMarkdown = (markdownText: string) => {
  return pipeline.processSync(markdownText)
}
