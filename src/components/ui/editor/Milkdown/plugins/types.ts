import type { NodeViewConstructor } from '@milkdown/prose/view'
import type { ReactNodeViewUserOptions } from '@prosemirror-adapter/react'

export interface PluginCtx {
  nodeViewFactory: (options: ReactNodeViewUserOptions) => NodeViewConstructor
}
