import { atom, useAtomValue, useSetAtom } from 'jotai'

import { useIsMobile } from '~/atoms/hooks/viewport'
import { usePageScrollLocationSelector } from '~/providers/root/page-scroll-info-provider'

const headerShouldShowBgAtom = atom(true)

export const useHeaderShouldShowBg = () => useAtomValue(headerShouldShowBgAtom)
export const useSetHeaderShouldShowBg = () => useSetAtom(headerShouldShowBgAtom)
export const useMenuOpacity = () => {
  const headerOpacity = useHeaderBgOpacity()

  return 1 - headerOpacity
}

export const useHeaderBgOpacity = () => {
  const threshold = 84 + 63 + 50
  const distance = 50
  const isMobile = useIsMobile()
  const headerShouldShowBg = useHeaderShouldShowBg() || isMobile

  return usePageScrollLocationSelector(
    (y) => {
      if (y < threshold) return 0
      return headerShouldShowBg
        ? y >= distance + threshold
          ? 1
          : Math.floor(((y - threshold) / distance) * 100) / 100
        : 0
    },
    [headerShouldShowBg],
  )
}
