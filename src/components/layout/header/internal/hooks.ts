import { atom, useAtomValue, useSetAtom } from 'jotai'

import { jotaiStore } from '~/lib/store'
import { usePageScrollLocationSelector } from '~/providers/root/page-scroll-info-provider'

const headerMetaTitleAtom = atom('')
const headerMetaDescriptionAtom = atom('')
const headerMetaSlugAtom = atom('')
const headerShouldShowBgAtom = atom(true)

export const useHeaderShouldShowBg = () => useAtomValue(headerShouldShowBgAtom)
export const useSetHeaderShouldShowBg = () => useSetAtom(headerShouldShowBgAtom)
export const useMenuOpacity = () => {
  // const scrollDirection = usePageScrollDirection()
  const headerOpacity = useHeaderBgOpacity()
  // if (scrollDirection === 'up') {
  //   opacity = 1
  // }
  return 1 - headerOpacity
}

export const useMenuVisibility = () => useMenuOpacity() > 0

export const useHeaderBgOpacity = () => {
  const threshold = 50

  const headerShouldShowBg = useHeaderShouldShowBg()

  return usePageScrollLocationSelector(
    (y) =>
      headerShouldShowBg
        ? y >= threshold
          ? 1
          : Math.floor((y / threshold) * 100) / 100
        : 0,
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

export const useHeaderMetaInfo = () => {
  return {
    title: useAtomValue(headerMetaTitleAtom),
    description: useAtomValue(headerMetaDescriptionAtom),
    slug: useAtomValue(headerMetaSlugAtom),
  }
}
