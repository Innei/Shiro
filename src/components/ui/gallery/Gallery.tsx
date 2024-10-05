'use client'

import clsx from 'clsx'
import type { FC, UIEventHandler } from 'react'
import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { useInView } from 'react-intersection-observer'

import { useStateToRef } from '~/hooks/common/use-state-ref'
import { throttle } from '~/lib/lodash'
import { useMarkdownImageRecord } from '~/providers/article/MarkdownImageRecordProvider'
import { useWrappedElementSize } from '~/providers/shared/WrappedElementProvider'

import { MotionButtonBase } from '../button'
import { FixedZoomedImage } from '../image'
import { MarkdownImage } from '../markdown/renderers/image'
import styles from './Gallery.module.css'

const IMAGE_CONTAINER_MARGIN_INSET = 60
const CHILD_GAP = 15
const AUTOPLAY_DURATION = 5000

interface ImageType {
  name?: string
  url: string
  footnote?: string
}
interface GalleryProps {
  images: ImageType[]
}

export const Gallery: FC<GalleryProps> = (props) => {
  const { images } = props

  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null)

  const [, setUpdated] = useState({})
  const memoedChildContainerWidthRef = useRef(0)

  useEffect(() => {
    if (!containerRef) {
      return
    }

    const ob = new ResizeObserver(() => {
      setUpdated({})
      calChild(containerRef)
    })
    function calChild(containerRef: HTMLDivElement) {
      const $child = containerRef.children.item(0)
      if ($child) {
        memoedChildContainerWidthRef.current = $child.clientWidth
      }
    }

    calChild(containerRef)

    ob.observe(containerRef)
    return () => {
      ob.disconnect()
    }
  }, [containerRef])

  const [currentIndex, setCurrentIndex] = useState(0)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleOnScroll: UIEventHandler<HTMLDivElement> = useCallback(
    throttle<UIEventHandler<HTMLDivElement>>((e) => {
      const $ = e.target as HTMLDivElement

      const index = Math.floor(
        ($.scrollLeft + IMAGE_CONTAINER_MARGIN_INSET + 15) /
          memoedChildContainerWidthRef.current,
      )
      setCurrentIndex(index)
    }, 60),
    [],
  )
  const handleScrollTo = useCallback(
    (i: number) => {
      if (!containerRef) {
        return
      }

      containerRef.scrollTo({
        left: memoedChildContainerWidthRef.current * i,
        behavior: 'smooth',
      })
    },
    [containerRef],
  )

  const autoplayTimerRef = useRef(null as any)

  const currentIndexRef = useStateToRef(currentIndex)
  const totalImageLengthRef = useStateToRef(images.length)

  // 向后翻页状态
  const isForward = useRef(true)

  const autoplayRef = useRef(true)
  const handleCancelAutoplay = useCallback(() => {
    if (!autoplayRef.current) {
      return
    }

    autoplayRef.current = false
    clearInterval(autoplayTimerRef.current)
  }, [])

  const { ref } = useInView({
    initialInView: false,
    triggerOnce: images.length < 2,
    onChange(inView) {
      if (totalImageLengthRef.current < 2 || !autoplayRef.current) {
        return
      }
      if (inView) {
        autoplayTimerRef.current = setInterval(() => {
          if (
            currentIndexRef.current + 1 > totalImageLengthRef.current - 1 &&
            isForward.current
          ) {
            isForward.current = false
          }
          if (currentIndexRef.current - 1 < 0 && !isForward.current) {
            isForward.current = true
          }

          const index = currentIndexRef.current + (isForward.current ? 1 : -1)
          handleScrollTo(index)
        }, AUTOPLAY_DURATION)
      } else {
        autoplayTimerRef.current = clearInterval(autoplayTimerRef.current)
      }
    },
  })

  useEffect(() => {
    return () => {
      clearInterval(autoplayTimerRef.current)
    }
  }, [])

  if (images.length === 0) {
    return null
  }
  if (images.length === 1) {
    const image = images[0]
    return <MarkdownImage src={image.url} alt={image.footnote} />
  }

  return (
    <div
      className={clsx('w-full', 'relative', styles['root'])}
      ref={ref}
      onTouchMove={handleCancelAutoplay}
      onWheel={handleCancelAutoplay}
    >
      <div
        className={clsx(
          'w-full overflow-auto whitespace-nowrap',
          styles['container'],
        )}
        onTouchStart={handleCancelAutoplay}
        onScroll={handleOnScroll}
        ref={setContainerRef}
        onTouchMove={handleCancelAutoplay}
        onWheel={handleCancelAutoplay}
      >
        {images.map((image) => {
          return <GalleryItem key={image.url} image={image} />
        })}
      </div>

      {currentIndex > 0 && (
        <div className="pointer-events-none absolute inset-y-0 left-2 flex items-center [&_*]:duration-200">
          <MotionButtonBase
            onClick={() => {
              if (!containerRef) {
                return
              }
              const index = currentIndex - 1
              handleScrollTo(index)
            }}
            className="border-border center pointer-events-auto flex size-6 rounded-full border bg-base-100 p-1 opacity-80 hover:opacity-100"
          >
            <i className="i-mingcute-left-fill" />
          </MotionButtonBase>
        </div>
      )}
      {currentIndex < images.length - 1 && (
        <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center [&_*]:duration-200">
          <MotionButtonBase
            onClick={() => {
              if (!containerRef) {
                return
              }
              const index = currentIndex + 1
              handleScrollTo(index)
            }}
            className="border-border center pointer-events-auto flex size-6 rounded-full border bg-base-100 p-1 opacity-80 hover:opacity-100"
          >
            <i className="i-mingcute-right-fill" />
          </MotionButtonBase>
        </div>
      )}
      <div className={clsx(styles['indicator'], 'space-x-2')}>
        {Array.from({
          length: images.length,
        }).map((_, i) => {
          return (
            <div
              className={clsx(
                'size-[6px] cursor-pointer rounded-full bg-stone-600 opacity-50 transition-opacity duration-200 ease-in-out',
                currentIndex == i && '!opacity-100',
              )}
              key={i}
              onClick={handleScrollTo.bind(null, i)}
            />
          )
        })}
      </div>
    </div>
  )
}
const childStyle = {
  width: `calc(100% - ${IMAGE_CONTAINER_MARGIN_INSET}px)`,
  marginRight: `${CHILD_GAP}px`,
}

const GalleryItem: FC<{
  image: ImageType
}> = memo(({ image }) => {
  const info = useMarkdownImageRecord(image.url)

  const alt = image.name
  const title = image.footnote
  const imageCaption =
    title ||
    (['!', '¡'].some((ch) => ch == alt?.[0]) ? alt?.slice(1) : '') ||
    ''
  const { w } = useWrappedElementSize()
  return (
    <div
      style={childStyle}
      className={clsx(styles['child'], 'inline-block self-center')}
      key={`${image.url}-${image.name || ''}`}
    >
      <FixedZoomedImage
        accent={info?.accent}
        src={image.url}
        alt={imageCaption}
        containerWidth={w - IMAGE_CONTAINER_MARGIN_INSET}
      />
    </div>
  )
})

GalleryItem.displayName = 'GalleryItem'
