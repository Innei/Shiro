import type { MilkdownPlugin } from '@milkdown/ctx'
import { diagram } from '@milkdown/plugin-diagram'

import { AlertPlugin } from './Alert'
import { BlockquotePlugin } from './Blockquote'
import { CodeBlockPlugin } from './CodeBlock'
import { ExcalidrawPlugins } from './Excalidraw'
import { ImagePlugin } from './Image'
import { MermaidPlugin } from './Mermaid'
import type { PluginCtx } from './types'

export const createPlugins = (pluginCtx: PluginCtx): MilkdownPlugin[] =>
  [
    BlockquotePlugin(pluginCtx),
    CodeBlockPlugin(pluginCtx),
    MermaidPlugin(pluginCtx),
    ImagePlugin(pluginCtx),

    diagram,
    ExcalidrawPlugins(pluginCtx),

    AlertPlugin(pluginCtx),
  ].flat()
