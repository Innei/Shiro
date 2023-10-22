'use client'

import { HydrationBoundary as RQHydrate } from '@tanstack/react-query'
import type { HydrationBoundaryProps } from '@tanstack/react-query'

export function QueryHydrate(props: HydrationBoundaryProps) {
  return <RQHydrate {...props} />
}
