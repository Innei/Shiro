import type { LinkCardPlugin, PluginRegistry } from '../types'
// Academic plugins
import { arxivPlugin } from './academic'
// Code plugins
import { leetcodePlugin } from './code'
// GitHub plugins
import {
  githubCommitPlugin,
  githubDiscussionPlugin,
  githubIssuePlugin,
  githubPrPlugin,
  githubRepoPlugin,
} from './github'
// Media plugins
import {
  bangumiPlugin,
  neteaseMusicPlugin,
  qqMusicPlugin,
  tmdbPlugin,
} from './media'
// Self plugins
import { mxSpacePlugin } from './self'

/**
 * All registered plugins - sorted by priority (higher = checked first)
 */
export const plugins: PluginRegistry = [
  // GitHub (highest priority for common URLs)
  githubRepoPlugin,
  githubCommitPlugin,
  githubPrPlugin,
  githubIssuePlugin,
  githubDiscussionPlugin,

  // Academic
  arxivPlugin,

  // Media
  tmdbPlugin,
  bangumiPlugin,
  qqMusicPlugin,
  neteaseMusicPlugin,

  // Code
  leetcodePlugin,

  // Self (lowest priority - catches internal links)
  mxSpacePlugin,
].sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0))

/**
 * Get plugin by name (for explicit source usage)
 */
export function getPluginByName(name: string): LinkCardPlugin | undefined {
  return plugins.find((p) => p.name === name)
}

/**
 * Plugin map for O(1) lookup by name
 */
export const pluginMap = new Map<string, LinkCardPlugin>(
  plugins.map((p) => [p.name, p]),
)

// Re-export individual plugins for direct imports
export {
  arxivPlugin,
  bangumiPlugin,
  githubCommitPlugin,
  githubDiscussionPlugin,
  githubIssuePlugin,
  githubPrPlugin,
  githubRepoPlugin,
  leetcodePlugin,
  mxSpacePlugin,
  neteaseMusicPlugin,
  qqMusicPlugin,
  tmdbPlugin,
}
