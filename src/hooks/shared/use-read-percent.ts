import { getViewport } from '~/atoms/hooks'
import { usePageScrollLocationSelector } from '~/providers/root/page-scroll-info-provider'
import {
  useWrappedElementPosition,
  useWrappedElementSize,
} from '~/providers/shared/WrappedElementProvider'

export const useReadPercent = () => {
  const { y } = useWrappedElementPosition()
  const { h } = useWrappedElementSize()
  const readPercent = usePageScrollLocationSelector(
    (scrollTop) => {
      const winHeight = getViewport().h
      const deltaHeight = scrollTop >= winHeight ? winHeight : scrollTop

      return (
        Math.floor(
          Math.min(Math.max(0, ((scrollTop - y + deltaHeight) / h) * 100), 100),
        ) || 0
      )
    },
    [y, h],
  )
  return readPercent
}
