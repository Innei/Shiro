import { memo, useEffect, useMemo, useState } from 'react'
import { marked } from 'marked'
import type { WriteBaseType } from '~/models/writing'
import type { FC } from 'react'

import { MotionButtonBase, StyledButton } from '~/components/ui/button'
import { Collapse } from '~/components/ui/collapse'
import { Divider } from '~/components/ui/divider'
import { AdvancedInput, AdvancedInputProvider } from '~/components/ui/input'
import { Label, LabelProvider } from '~/components/ui/label'
import { useEventCallback } from '~/hooks/common/use-event-callback'
import { uniqBy } from '~/lib/_'
import { getDominantColor } from '~/lib/image'
import { toast } from '~/lib/toast'

const pickImagesFromMarkdown = (text: string) => {
  const ast = marked.lexer(text)
  const images = new Set<string>()
  function pickImage(node: any) {
    if (node.type === 'image') {
      images.add(node.href)
      return
    }
    if (node.tokens && Array.isArray(node.tokens)) {
      return node.tokens.forEach(pickImage)
    }
  }
  ast.forEach(pickImage)

  return [...images.values()]
}

type ArticleImage = WriteBaseType['images'][number]

export interface ImageDetailSectionProps {
  images: ArticleImage[]
  onChange: (images: ArticleImage[]) => void
  text: string
  extraImages?: string[]

  withDivider?: 'top' | 'bottom' | 'both'
}

export const ImageDetailSection: FC<ImageDetailSectionProps> = (props) => {
  const { images, text, onChange, extraImages, withDivider } = props

  const originImageMap = useMemo(() => {
    const map = new Map<string, ArticleImage>()
    images.forEach((image) => {
      map.set(image.src, image)
    })
    return map
  }, [images])

  const fromText = useMemo(() => {
    return pickImagesFromMarkdown(text).filter((src) => {
      return src.startsWith('http')
    })
  }, [text])

  const hasTopDivider = withDivider === 'top' || withDivider === 'both'
  const hasBottomDivider = withDivider === 'bottom' || withDivider === 'both'

  const nextImages = useMemo<ArticleImage[]>(() => {
    const basedImages: ArticleImage[] = text
      ? uniqBy(
          fromText
            .map((src) => {
              const existImageInfo = originImageMap.get(src)

              return {
                src,
                height: existImageInfo?.height,
                width: existImageInfo?.width,
                type: existImageInfo?.type,
                accent: existImageInfo?.accent,
              } as any
            })
            .concat(images)
            .filter(Boolean),
          (s) => s.src,
        )
      : images
    const srcSet = new Set<string>()

    for (const image of basedImages) {
      image.src && srcSet.add(image.src)
    }
    const nextImages = basedImages.concat()
    if (extraImages) {
      // 需要过滤存在的图片
      extraImages.forEach((src) => {
        if (!srcSet.has(src)) {
          nextImages.push({
            src,
            height: 0,
            width: 0,
            type: '',
            accent: '',
          })
        }
      })
    }

    return nextImages
  }, [extraImages, images, originImageMap, JSON.stringify(fromText)])

  const [loading, setLoading] = useState(false)
  const handleCorrectImageDimensions = useEventCallback(async () => {
    if (loading) return
    setLoading(true)

    const fetchImageTasks = await Promise.allSettled(
      images.map((item) => {
        return new Promise<ArticleImage>((resolve, reject) => {
          const $image = new Image()
          $image.src = item.src
          $image.crossOrigin = 'Anonymous'
          $image.onload = () => {
            resolve({
              width: $image.naturalWidth,
              height: $image.naturalHeight,
              src: item.src,
              type: $image.src.split('.').pop() || '',
              accent: getDominantColor($image),
            })
          }
          $image.onerror = (err) => {
            reject({
              err,
              src: item.src,
            })
          }
        })
      }),
    )

    setLoading(false)

    const nextImageDimensions = [] as ArticleImage[]
    fetchImageTasks.map((task) => {
      if (task.status === 'fulfilled') nextImageDimensions.push(task.value)
      else {
        toast.error(`获取图片信息失败：${task.reason.src}: ${task.reason.err}`)
      }
    })

    onChange(nextImageDimensions)

    setLoading(false)
  })

  const handleOnChange = useEventCallback(
    <T extends keyof ArticleImage>(
      src: string,
      key: T,
      value: ArticleImage[T],
    ) => {
      if (key == 'src' && value === '') {
        onChange(
          nextImages.filter((item) => {
            return item.src !== src
          }),
        )
        return
      }
      onChange(
        nextImages.map((item) => {
          if (item.src === src) {
            return {
              ...item,
              [key]: value,
            }
          }
          return item
        }),
      )
    },
  )

  if (!nextImages.length) return null

  return (
    <>
      {hasTopDivider && <Divider />}
      <div className="relative flex w-full flex-col">
        <div className="flex items-center justify-between space-x-2">
          <div className="inline-block flex-shrink flex-grow">图片信息</div>
          <StyledButton
            className="flex items-center gap-1 self-end"
            onClick={handleCorrectImageDimensions}
            variant="secondary"
            disabled={loading}
          >
            {loading && <i className="loading loading-spinner loading-sm" />}
            刷新图片信息
          </StyledButton>
        </div>
        <div className="my-2 flex flex-col gap-2">
          {nextImages.map((image) => {
            return (
              <Collapse key={image.src} title={image.src} className="mt-4">
                <Item {...image} handleOnChange={handleOnChange} />
              </Collapse>
            )
          })}
        </div>
      </div>
      {hasBottomDivider && <Divider />}
    </>
  )
}

const Item: FC<
  ArticleImage & {
    handleOnChange: <T extends keyof ArticleImage>(
      src: string,
      key: T,
      value: ArticleImage[T],
    ) => void
  }
> = memo(({ handleOnChange, ...image }) => {
  return (
    <div className="my-6 flex flex-col space-y-3">
      <LabelProvider className="mr-4 w-20 font-normal">
        <AdvancedInputProvider labelPlacement="left">
          <AdvancedInput
            label="高度"
            value={image.height?.toString() || ''}
            onChange={(e) => {
              const validValue = parseInt(e.target.value)
              if (Number.isNaN(validValue)) return
              handleOnChange(image.src, 'height', validValue)
            }}
          />
          <AdvancedInput
            label="宽度"
            value={image.width?.toString() || ''}
            onChange={(e) => {
              const validValue = parseInt(e.target.value)
              if (Number.isNaN(validValue)) return
              handleOnChange(image.src, 'width', validValue)
            }}
          />
          <AdvancedInput
            label="类型"
            value={image.type?.toString() || ''}
            onChange={(e) => {
              handleOnChange(image.src, 'type', e.target.value)
            }}
          />
        </AdvancedInputProvider>

        <div className="flex items-center gap-1">
          <Label htmlFor="color-picker">色调</Label>
          <ColorPicker
            accent={image.accent || '#fff'}
            onChange={(hex) => {
              handleOnChange(image.src, 'accent', hex)
            }}
          />
        </div>

        <div className="flex items-center gap-1">
          <Label>操作</Label>

          <div>
            <StyledButton
              className="rounded-r-none border-r-0"
              variant="secondary"
              onClick={() => {
                window.open(image.src)
              }}
            >
              查看
            </StyledButton>
            <StyledButton
              variant="secondary"
              className="rounded-l-none border-l-0 text-red-400"
              onClick={() => {
                handleOnChange(image.src, 'src', '')
              }}
            >
              重置
            </StyledButton>
          </div>
        </div>
      </LabelProvider>
    </div>
  )
})

Item.displayName = 'AccordionItem'

const ColorPicker: FC<{
  accent: string
  onChange: (hex: string) => void
}> = ({ accent, onChange }) => {
  const [currentColor, setCurrentColor] = useState(accent)
  useEffect(() => {
    setCurrentColor(accent)
  }, [accent])

  return (
    <MotionButtonBase
      id="color-picker"
      className="ring-default-200 h-6 w-6 rounded-full bg-current ring"
      style={{
        backgroundColor: currentColor || '',
      }}
    />
  )
  // return (
  //   <FloatPopover
  //     triggerElement={
  //       <MotionButtonBase
  //         id="color-picker"
  //         className="ring-default-200 h-6 w-6 rounded-full bg-current ring"
  //         style={{
  //           backgroundColor: currentColor || '',
  //         }}
  //       />
  //     }
  //   >
  //     <div />
  //     {/* <ColorPickerContent
  //       accent={currentColor || '#fff'}
  //       onChange={useEventCallback((hex) => {
  //         setCurrentColor(hex)
  //       })}
  //       onDestroy={useEventCallback(() => {
  //         onChange(currentColor)
  //       })}
  //     /> */}
  //   </FloatPopover>
  // )
}

// const ColorPickerContent: FC<{
//   accent: string
//   onDestroy: () => void
//   onChange: (hex: string) => void
// }> = ({ accent, onChange, onDestroy }) => {
//   useEffect(() => {
//     return () => {
//       onDestroy()
//     }
//   }, [onDestroy])

//   return (
//     <Colorful
//       color={accent}
//       onChange={({ hex }) => {
//         onChange(hex)
//       }}
//     />
//   )
// }
