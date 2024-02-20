/* Copyright 2021, Milkdown by Mirone. */
import { useNodeViewContext } from '@prosemirror-adapter/react'
import { visit } from 'unist-util-visit'
import type { Ctx, MilkdownPlugin } from '@milkdown/ctx'
import type { Node } from '@milkdown/transformer'
import type { $NodeSchema } from '@milkdown/utils'
import type { PluginCtx } from './types'

import { remarkCtx } from '@milkdown/core'
import { wrappingInputRule } from '@milkdown/prose/inputrules'
import {
  $inputRule,
  $nodeAttr,
  $nodeSchema,
  $remark,
  $view,
} from '@milkdown/utils'

import { AlertIcon } from '~/components/ui/markdown/parsers/alert'
import { cloneDeep } from '~/lib/lodash'

/// HTML attributes for alert node.
export const alertAttr = $nodeAttr('alert')

/// Schema for alert node.
export const alertSchema: $NodeSchema<'alert'> = $nodeSchema(
  'alert',
  (ctx) => ({
    content: 'block+',
    group: 'block',
    attrs: {
      type: { default: '' },
      text: { default: '' },
    },
    defining: true,
    parseDOM: [{ tag: 'blockquote' }],
    toDOM: (node) => ['blockquote', ctx.get(alertAttr.key)(node), 0],
    parseMarkdown: {
      match: ({ type }) => type === 'alert',
      runner: (state, node, type) => {
        state
          .openNode(type, (node as any as { value: AlertValue }).value)
          .closeNode()
      },
    },
    toMarkdown: {
      match: (node) => node.type.name === 'alert',
      runner: (state, node) => {
        state
          .openNode('alert', node.attrs as any)

          .closeNode()
      },
    },
  }),
)

export type AlertValue = {
  type: string
  text: string
}
function createAlertDiv(contents: AlertValue) {
  return {
    type: 'alert',
    value: contents,
  }
}

function visitCodeBlock(ast: Node, stringify: (ast: any) => string) {
  return visit(
    ast,
    'blockquote',
    (node: any, index, parent: Node & { children: Node[] }) => {
      if (node.children.length < 1) {
        return node
      }

      const firstChildren = node.children[0]
      if (firstChildren.type !== 'paragraph') {
        return node
      }
      const innerChild = firstChildren.children[0]
      if (!innerChild || innerChild.type !== 'text') {
        return node
      }

      const firstLineOfInnerChildText = innerChild.value.split(
        '\n',
      )[0] as string

      const matched = firstLineOfInnerChildText.match(/^\[!(.*?)\]$/)

      if (!matched) {
        return node
      }

      const transformedTree = cloneDeep(node)
      transformedTree.children[0].children =
        transformedTree.children[0].children.slice(1)

      transformedTree.type = 'root'
      const newNode = createAlertDiv({
        // FIXME: replace all backslashes with empty string,
        text: stringify(transformedTree).replace(/\\/g, '') || '',
        type: (matched[1] as string) || 'NOTE',
      })

      if (parent && index != null) parent.children.splice(index, 1, newNode)

      return node
    },
  )
}

function remarkAlert(ctx: Ctx) {
  function transformer(tree: Node) {
    visitCodeBlock(tree, (val) => ctx.get(remarkCtx).stringify(val))
  }

  return transformer
}

export const remarkAlertPlugin = $remark('remarkAlert', (c) =>
  remarkAlert.bind(null, c),
)

export const wrapInAlertInputRule = [
  $inputRule((ctx) => wrappingInputRule(/^\s*>\[\s$/, alertSchema.type(ctx))),

  $inputRule((ctx) => wrappingInputRule(/^\s*> \[!\s$/, alertSchema.type(ctx))),
  $inputRule((ctx) =>
    wrappingInputRule(
      /^\s*> \[!(?<type>NOTE|IMPORTANT|WARNING)\]\s$/,
      alertSchema.type(ctx),
      (match) => {
        return {
          type: match.groups?.type,
        }
      },
    ),
  ),
]

// TODO text editor for alert

const AlertRender = () => {
  const { contentRef, setAttrs, node, selected } = useNodeViewContext()

  const attrs = node.attrs as AlertValue
  const type = attrs.type

  return (
    <div>
      <blockquote
        className="my-4 flex flex-col rounded !bg-accent/10 p-0.5"
        contentEditable={false}
      >
        <AlertIcon type={type as any} />
        <div>{attrs.text}</div>
      </blockquote>
    </div>
  )
}

export const AlertPlugin: (pluginCtx: PluginCtx) => MilkdownPlugin[] = ({
  nodeViewFactory,
}) => [
  $view(alertSchema.node, () =>
    nodeViewFactory({
      component: AlertRender,
    }),
  ),
  alertSchema as any as MilkdownPlugin,
  alertAttr,
  remarkAlertPlugin as any as MilkdownPlugin,
  ...(wrapInAlertInputRule.flat() as any as MilkdownPlugin[]),
]
