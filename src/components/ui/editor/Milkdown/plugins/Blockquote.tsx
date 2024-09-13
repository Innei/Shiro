import type { MilkdownPlugin } from '@milkdown/ctx'
import { blockquoteSchema } from '@milkdown/preset-commonmark'
import { $view } from '@milkdown/utils'
import { useNodeViewContext } from '@prosemirror-adapter/react'

import type { PluginCtx } from './types'

const Blockquote = () => {
  const { contentRef } = useNodeViewContext()

  return (
    <blockquote className="my-4 rounded !bg-accent/10 p-0.5" ref={contentRef} />
  )
}

export const BlockquotePlugin: (pluginCtx: PluginCtx) => MilkdownPlugin[] = ({
  nodeViewFactory,
}) => [
  $view(blockquoteSchema.node, () =>
    nodeViewFactory({
      component: Blockquote,
    }),
  ),
]
