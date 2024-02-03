import remarkGithubAlerts from 'remark-github-alerts'
import type { MilkdownPlugin } from '@milkdown/ctx'
import type { PluginCtx } from './types'

import { diagram } from '@milkdown/plugin-diagram'
import { $remark } from '@milkdown/utils'

import { BlockquotePlugin } from './Blockquote'
import { CodeBlockPlugin } from './CodeBlock'
import { ExcalidrawPlugins } from './Excalidraw'
import { ImagePlugin } from './Image'
import { MermaidPlugin } from './Mermaid'

export const createPlugins = (pluginCtx: PluginCtx): MilkdownPlugin[] =>
  [
    BlockquotePlugin(pluginCtx),
    CodeBlockPlugin(pluginCtx),
    MermaidPlugin(pluginCtx),
    ImagePlugin(pluginCtx),
    $remark('alerts', () => remarkGithubAlerts),
    diagram,
    ExcalidrawPlugins(pluginCtx),
  ].flat()
