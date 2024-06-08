import { useAtomValue } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { useSearchParams } from 'next/navigation'

import { buildNSKey } from '~/lib/ns'
import { useAppConfigSelector } from '~/providers/root/aggregation-data-provider'

type ViewMode = 'loose' | 'compact'
export const postsViewModeAtom = atomWithStorage<ViewMode | null>(
  buildNSKey('posts-view-mode'),
  null,
)

export const usePostViewMode = () => {
  const searchParams = useSearchParams()
  const mode = useAppConfigSelector(
    (c) =>
      (searchParams.get('view_mode') ||
        c.module.posts?.mode ||
        'loose') as ViewMode,
  )!
  const currentViewMode = useAtomValue(postsViewModeAtom)
  const renderedViewMode = currentViewMode || mode

  return renderedViewMode
}
