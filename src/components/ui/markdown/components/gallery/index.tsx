// import React, {
//   useCallback,
//   useContext,
//   useEffect,
//   useMemo,
//   useRef,
//   useState,
// } from 'react'
// import { useInView } from 'react-intersection-observer'
// import clsx from 'clsx'
// import throttle from 'lodash-es/throttle'
// import type { FC, UIEventHandler } from 'react'
// import type { MImageType } from '../../utils/image'

// // import { ImageSizeMetaContext } from '~/components/ui/Image/context'
// // import { calculateDimensions } from '~/components/ui/Image/utils/calc-image'
// import { useStateToRef } from '~/hooks/common/use-state-ref'

// import { ZoomedImage } from '../../../image'
// import styles from './index.module.css'

// const IMAGE_CONTAINER_MARGIN_INSET = 60
// const CHILD_GAP = 15
// const AUTOPLAY_DURATION = 5000

// interface GalleryProps {
//   images: MImageType[]
// }

// export const Gallery: FC<GalleryProps> = (props) => {
//   const { images } = props
//   const imageMeta = useContext(ImageSizeMetaContext)
//   const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null)
//   const containerWidth = useMemo(
//     () => containerRef?.clientWidth || 0,
//     [containerRef?.clientWidth],
//   )

//   const [, setUpdated] = useState({})
//   const memoedChildContainerWidthRef = useRef(0)

//   useEffect(() => {
//     if (!containerRef) {
//       return
//     }

//     const ob = new ResizeObserver(() => {
//       setUpdated({})
//       calChild(containerRef)
//     })
//     function calChild(containerRef: HTMLDivElement) {
//       const $child = containerRef.children.item(0)
//       if ($child) {
//         memoedChildContainerWidthRef.current = $child.clientWidth
//       }
//     }

//     calChild(containerRef)

//     ob.observe(containerRef)
//     return () => {
//       ob.disconnect()
//     }
//   }, [containerRef])

//   const childStyle = useRef({
//     width: `calc(100% - ${IMAGE_CONTAINER_MARGIN_INSET}px)`,
//     marginRight: `${CHILD_GAP}px`,
//   }).current

//   const [currentIndex, setCurrentIndex] = useState(0)

//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   const handleOnScroll: UIEventHandler<HTMLDivElement> = useCallback(
//     throttle<UIEventHandler<HTMLDivElement>>((e) => {
//       const $ = e.target as HTMLDivElement

//       const index = Math.floor(
//         ($.scrollLeft + IMAGE_CONTAINER_MARGIN_INSET + 15) /
//           memoedChildContainerWidthRef.current,
//       )
//       setCurrentIndex(index)
//     }, 60),
//     [],
//   )
//   const handleScrollTo = useCallback(
//     (i: number) => {
//       if (!containerRef) {
//         return
//       }

//       containerRef.scrollTo({
//         left: memoedChildContainerWidthRef.current * i,
//         behavior: 'smooth',
//       })
//     },
//     [containerRef],
//   )

//   const autoplayTimerRef = useRef(null as any)

//   const currentIndexRef = useStateToRef(currentIndex)
//   const totalImageLengthRef = useStateToRef(images.length)

//   // 向后翻页状态
//   const isForward = useRef(true)

//   const autoplayRef = useRef(true)
//   const handleCancelAutoplay = useCallback(() => {
//     if (!autoplayRef.current) {
//       return
//     }

//     autoplayRef.current = false
//     clearInterval(autoplayTimerRef.current)
//   }, [])

//   const { ref } = useInView({
//     initialInView: false,
//     triggerOnce: images.length < 2,
//     onChange(inView) {
//       if (totalImageLengthRef.current < 2 || !autoplayRef.current) {
//         return
//       }
//       if (inView) {
//         autoplayTimerRef.current = setInterval(() => {
//           if (
//             currentIndexRef.current + 1 > totalImageLengthRef.current - 1 &&
//             isForward.current
//           ) {
//             isForward.current = false
//           }
//           if (currentIndexRef.current - 1 < 0 && !isForward.current) {
//             isForward.current = true
//           }

//           const index = currentIndexRef.current + (isForward.current ? 1 : -1)
//           handleScrollTo(index)
//         }, AUTOPLAY_DURATION)
//       } else {
//         autoplayTimerRef.current = clearInterval(autoplayTimerRef.current)
//       }
//     },
//   })

//   useEffect(() => {
//     return () => {
//       clearInterval(autoplayTimerRef.current)
//     }
//   }, [])

//   return (
//     <div
//       className={clsx('w-full', 'relative', styles['root'])}
//       ref={ref}
//       onWheel={handleCancelAutoplay}
//       onTouchStart={handleCancelAutoplay}
//     >
//       <div
//         className={clsx(
//           'w-full overflow-auto whitespace-nowrap',
//           styles['container'],
//         )}
//         ref={setContainerRef}
//         onScroll={handleOnScroll}
//       >
//         {images.map((image) => {
//           const info = imageMeta.get(image.url)

//           const maxWidth = containerWidth - IMAGE_CONTAINER_MARGIN_INSET
//           const { height, width } = calculateDimensions(
//             info?.width || 0,
//             info?.height || 0,
//             {
//               width: maxWidth,

//               height: 600,
//             },
//           )
//           const alt = image.name
//           const title = image.footnote
//           const imageCaption =
//             title ||
//             (['!', '¡'].some((ch) => ch == alt?.[0]) ? alt?.slice(1) : '') ||
//             ''
//           return (
//             <div
//               style={childStyle}
//               className={clsx(styles['child'], 'inline-block')}
//               key={`${image.url}-${image.name || ''}`}
//             >
//               <ZoomedImage
//                 accentColor={info?.accent}
//                 getParentElWidth={maxWidth}
//                 src={image.url}
//                 alt={imageCaption}
//                 height={height || 350}
//                 width={width || maxWidth}
//               />
//             </div>
//           )
//         })}
//       </div>

//       <div className={clsx(styles['indicator'], 'space-x-2')}>
//         {Array.from({
//           length: images.length,
//         }).map((_, i) => {
//           return (
//             <div
//               className={clsx(
//                 'bg-dark-50 h-[6px] w-[6px] cursor-pointer rounded-full opacity-50 transition-opacity duration-200 ease-in-out',
//                 currentIndex == i && '!opacity-100',
//               )}
//               key={i}
//               onClick={handleScrollTo.bind(null, i)}
//             />
//           )
//         })}
//       </div>
//     </div>
//   )
// }
// TODO: 重构
export const Gallery = () => null 