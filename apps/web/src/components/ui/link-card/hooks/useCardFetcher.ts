import { useCallback, useMemo, useState } from 'react'
import { useInView } from 'react-intersection-observer'

import { useFeatureEnabled } from '~/providers/root/app-feature-provider'

import { pluginMap } from '../plugins'
import type { LinkCardData } from '../types'

export interface UseCardFetcherOptions {
  source: string
  id: string
  fallbackUrl?: string
}

export interface UseCardFetcherResult {
  loading: boolean
  isError: boolean
  cardInfo: LinkCardData | undefined
  fullUrl: string
  isValid: boolean
  ref: (node?: Element | null) => void
}

/**
 * Hook to fetch card data using plugin system
 */
export function useCardFetcher(
  options: UseCardFetcherOptions,
): UseCardFetcherResult {
  const { source, id, fallbackUrl } = options

  const [loading, setLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const [fullUrl] = useState(fallbackUrl || 'javascript:;')
  const [cardInfo, setCardInfo] = useState<LinkCardData>()

  // Get plugin
  const plugin = pluginMap.get(source)

  // Check feature gates - currently only 'tmdb' is gated
  const tmdbEnabled = useFeatureEnabled('tmdb')

  const isEnabled = useMemo(() => {
    if (!plugin) return false
    if (!plugin.featureGate) return true

    const { featureKey, mustBeEnabled = true } = plugin.featureGate

    // Map feature keys to their enabled state
    const featureStates: Record<string, boolean> = {
      tmdb: tmdbEnabled,
    }

    const isFeatureEnabled = featureStates[featureKey] ?? true
    return mustBeEnabled ? isFeatureEnabled : !isFeatureEnabled
  }, [plugin, tmdbEnabled])

  const isValid = useMemo(() => {
    if (!plugin || !isEnabled) return false
    return plugin.isValidId(id)
  }, [plugin, isEnabled, id])

  const fetchInfo = useCallback(async () => {
    if (!plugin || !isValid) return

    setLoading(true)
    setIsError(false)

    try {
      const data = await plugin.fetch(id)
      setCardInfo(data)
    } catch (err) {
      console.error(`[LinkCard] Error fetching ${source} data:`, err)
      setIsError(true)
    } finally {
      setLoading(false)
    }
  }, [plugin, isValid, id, source])

  const { ref } = useInView({
    triggerOnce: true,
    onChange(inView) {
      if (!inView) return
      fetchInfo()
    },
  })

  return {
    loading,
    isError,
    cardInfo,
    fullUrl,
    isValid,
    ref,
  }
}
