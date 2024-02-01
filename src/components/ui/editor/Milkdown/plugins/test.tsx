import { useNodeViewContext } from '@prosemirror-adapter/react'
import { visit } from 'unist-util-visit'
import type { Root } from 'mdast'
import type { Plugin } from 'unified'

import { $markSchema } from '@milkdown/utils'

interface Options {
  text?: boolean
  inlineCode?: boolean
  link?: boolean
  image?: boolean
  definition?: boolean
  imageReference?: boolean
}

const defaultOptions: Options = {
  text: true,
  inlineCode: false,
  link: true,
  image: true,
  definition: true,
  imageReference: true,
}

function format(value: string) {
  if (!value) return value
  return `${value}formated`
}

export const remarkPangu: Plugin<[], Root> =
  (options = {}) =>
  (tree: Root) => {
    visit(tree, 'text', (node, index, parent) => {
      const value = node.value as string
      console.log('texdt', node.value)
      const matches = value.match(/\|\|(.*?)\|\|/)
      if (matches) {
        console.log('matches', matches)
        const before = value.slice(0, matches.index)

        if (!matches.index) return
        const after = value.slice(matches.index + matches[0].length)
        const strikethrough = {
          type: 'strikethrough',
          children: [{ type: 'text', value: matches[1] }],
        }

        // Replace current node with multiple nodes if necessary
        const nodes = []
        if (before) {
          nodes.push({ type: 'text', value: before })
        }
        nodes.push(strikethrough)
        if (after) {
          nodes.push({ type: 'text', value: after })
        }
        parent.children.splice(index, 1, ...nodes)
      }
    })
  }

export const strikethroughNode = $markSchema('strikethrough', (ctx) => ({
  attrs: {
    marker: {
      default: '|',
    },
  },

  parseMarkdown: {
    match: (node) => {
      return node.type === 'strikethrough'
    },
    runner: (state, node, type) => {
      // console.log('node strikethrough', node)
      // state.addNode(type, { children: node.children })
      state.openMark(type)
      state.next(node.children)
      state.closeMark(type)
    },
  },
  toMarkdown: {
    match: (node) => node.type.name === 'strikethrough',
    runner: (state, node) => {
      state.addNode('strikethrough', undefined, undefined, {
        name: 'strikethrough',
        attributes: {},
      })
    },
  },
}))

export const Strikethrough = (props) => {
  const { contentRef, node, view, setAttrs } = useNodeViewContext()
  console.log('node', node, props)
  // console.log('aaaaa', useNodeViewContext())
  return <del ref={contentRef}>DDDDDDDDDDDDDDDDDDDDDDDDD</del>
}
