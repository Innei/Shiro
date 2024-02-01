import remarkGithubAlerts from 'remark-github-alerts'
import type { MilkdownPlugin } from '@milkdown/ctx'
import type { PluginCtx } from './types'

import { diagram } from '@milkdown/plugin-diagram'
import { $remark } from '@milkdown/utils'

import { BlockquotePlugin } from './Blockquote'
import { CodeBlockPlugin } from './CodeBLock'
import { MermaidPlugin } from './Mermaid'

export const createPlugins = (pluginCtx: PluginCtx) =>
  [
    BlockquotePlugin(pluginCtx),
    CodeBlockPlugin(pluginCtx),
    MermaidPlugin(pluginCtx),
    $remark('alerts', () => remarkGithubAlerts),
    diagram,
  ].flat() as MilkdownPlugin[]
