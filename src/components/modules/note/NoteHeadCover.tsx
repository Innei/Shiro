'use client'

import { useLayoutEffect, useState } from 'react'
import clsx from 'clsx'

import { AutoResizeHeight } from '~/components/modules/shared/AutoResizeHeight'

function cropImageTo16by9(src: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')!

      const aspectRatio = 838 / 224
      let cropWidth = img.width
      let cropHeight = cropWidth / aspectRatio

      if (cropHeight > img.height) {
        cropHeight = img.height
        cropWidth = cropHeight * aspectRatio
      }

      const left = (img.width - cropWidth) / 2
      const top = (img.height - cropHeight) / 2

      // 设置 canvas 尺寸和绘制裁剪的图像
      canvas.width = cropWidth
      canvas.height = cropHeight
      ctx.drawImage(
        img,
        left,
        top,
        cropWidth,
        cropHeight,
        0,
        0,
        cropWidth,
        cropHeight,
      )

      // 转换 canvas 内容为 blob URL
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob)
          resolve(url)
        } else {
          reject('Blob conversion failed')
        }
      }, 'image/jpeg')
    }
    img.onerror = reject

    // 设置图像源以开始加载
    img.src = src
  })
}
export const NoteHeadCover = ({ image }: { image?: string }) => {
  if (!image) return null

  return <NoteHeadCoverImpl image={image} />
}
const NoteHeadCoverImpl = ({ image }: { image: string }) => {
  const [imageBlob, setImageBlob] = useState<string | null>(null)
  useLayoutEffect(() => {
    let isMounted = true
    cropImageTo16by9(image).then((b) => {
      if (!isMounted) return
      setImageBlob(b)
    })
    return () => {
      isMounted = false
    }
  }, [image])

  return (
    <>
      {!!imageBlob && (
        <div
          data-hide-print
          className={clsx(
            'z-1 absolute inset-x-0',
            imageBlob ? 'h-[224px]' : '0',
            'top-[-6.5rem] md:top-0',
          )}
        >
          <div
            style={{
              backgroundImage: `url(${imageBlob})`,
            }}
            className="cover-mask-b size-full bg-cover bg-center bg-no-repeat"
          />
        </div>
      )}

      <AutoResizeHeight>
        <div
          data-hide-print
          className={clsx(imageBlob ? 'h-[120px]' : 'h-0', 'hidden md:block')}
        />
      </AutoResizeHeight>
    </>
  )
}
