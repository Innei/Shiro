import { useMemo } from 'react'

import { useFeatureEnabled } from '~/providers/root/app-feature-provider'

import { plugins } from '../plugins'
import type { LinkCardPlugin, UrlMatchResult } from '../types'

export interface PluginMatchResult {
  plugin: LinkCardPlugin
  match: UrlMatchResult
}

/**
 * Hook to find matching plugin for a URL
 * Respects feature gates and priority ordering
 */
export function usePluginMatcher() {
  // Get all feature states upfront
  const tmdbEnabled = useFeatureEnabled('tmdb')

  const featureStates = useMemo(
    () => ({
      tmdb: tmdbEnabled,
    }),
    [tmdbEnabled],
  )

  const matchUrl = useMemo(() => {
    return (url: URL): PluginMatchResult | null => {
      for (const plugin of plugins) {
        // Check feature gate
        if (plugin.featureGate) {
          const { featureKey, mustBeEnabled = true } = plugin.featureGate
          const isEnabled =
            featureStates[featureKey as keyof typeof featureStates]
          if (mustBeEnabled && !isEnabled) continue
          if (!mustBeEnabled && isEnabled) continue
        }

        // Try to match URL
        const match = plugin.matchUrl(url)
        if (match) {
          return { plugin, match }
        }
      }
      return null
    }
  }, [featureStates])

  return { matchUrl, featureStates }
}
