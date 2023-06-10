import { u } from 'unist-builder'
import { visit } from 'unist-util-visit'
import type { Root } from 'rehype-raw'
import type { Plugin } from 'unified'

export const rehypeWrapCode: Plugin<Array<void>, Root> = () => {
  return (tree) => {
    visit(tree, { type: 'element', tagName: 'pre' }, (node, index, parent) => {
      if (
        parent &&
        typeof index === 'number' &&
        // @ts-ignore
        node?.properties?.className?.[0] !== 'mermaid'
      ) {
        const wrapper = u('element', {
          tagName: 'div',
          properties: {
            className: 'code-wrapper',
          },
          children: [
            u('element', {
              tagName: 'button',
              properties: {
                type: 'button',
                className: 'copy-button',
              },
              children: [
                u('element', {
                  tagName: 'span',
                  properties: {
                    className: 'icon-[mingcute--copy-2-line]',
                  },
                  children: [],
                }),
                u('element', {
                  tagName: 'span',
                  properties: {},
                  children: [u('text', 'Copy')],
                }),
              ],
            }),
            node,
          ],
        })
        parent.children[index] = wrapper
      }
    })
  }
}
