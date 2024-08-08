import { atom, useAtomValue, useSetAtom } from 'jotai'
import { useEffect } from 'react'

import { useIsMobile } from '~/atoms/hooks'
import { jotaiStore } from '~/lib/store'
import { usePageScrollLocationSelector } from '~/providers/root/page-scroll-info-provider'

const headerMetaTitleAtom = atom('')
const headerMetaDescriptionAtom = atom('')
const headerMetaSlugAtom = atom('')
const headerShouldShowBgAtom = atom(true)

export const useHeaderShouldShowBg = () => useAtomValue(headerShouldShowBgAtom)
export const useSetHeaderShouldShowBg = () => useSetAtom(headerShouldShowBgAtom)
export const useMenuOpacity = () => {
  const headerOpacity = useHeaderBgOpacity()

  return 1 - headerOpacity
}

export const useMenuVisibility = () => useMenuOpacity() > 0

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

const headerMetaShouldShowAtom = atom((get) => {
  const title = get(headerMetaTitleAtom)
  const description = get(headerMetaDescriptionAtom)

  return title !== '' && description !== ''
})
export const useHeaderMetaShouldShow = () => {
  const v = useMenuVisibility()

  return useAtomValue(headerMetaShouldShowAtom) && !v
}
export const useSetHeaderMetaInfo = () => {
  useEffect(
    () => () => {
      jotaiStore.set(headerMetaTitleAtom, '')
      jotaiStore.set(headerMetaDescriptionAtom, '')
      jotaiStore.set(headerMetaSlugAtom, '')
    },
    [],
  )
  return ({
    title,
    description,
    slug,
  }: {
    title: string
    description: string
    slug?: string
  }) => {
    jotaiStore.set(headerMetaTitleAtom, title)
    jotaiStore.set(headerMetaDescriptionAtom, description)
    !!slug && jotaiStore.set(headerMetaSlugAtom, slug)
  }
}

export const useHeaderMetaInfo = () => ({
  title: useAtomValue(headerMetaTitleAtom),
  description: useAtomValue(headerMetaDescriptionAtom),
  slug: useAtomValue(headerMetaSlugAtom),
})

const headerHasMetaInfoAtom = atom((get) => {
  const title = get(headerMetaTitleAtom)
  const description = get(headerMetaDescriptionAtom)

  return title !== '' && description !== ''
})
export const useHeaderHasMetaInfo = () => useAtomValue(headerHasMetaInfoAtom)
