import React from 'react'
import type { ExcalidrawImperativeAPI } from '@excalidraw/excalidraw/types/types'
import type { FC } from 'react'

import {
  Excalidraw as Board,
  exportToBlob,
  exportToSvg,
} from '@excalidraw/excalidraw'

import { useIsMobile } from '~/atoms'
import { toast } from '~/lib/toast'

import { MotionButtonBase } from '../button'
import { useModalStack } from '../modal'

export const Excalidraw: FC<{
  data: object
}> = ({ data }) => {
  const excalidrawAPIRef = React.useRef<ExcalidrawImperativeAPI>()
  const modal = useModalStack()
  const isMobile = useIsMobile()

  return (
    <div className="relative h-[500px] w-full">
      <Board
        initialData={data}
        zenModeEnabled
        viewModeEnabled
        excalidrawAPI={(api) => {
          excalidrawAPIRef.current = api

          setTimeout(() => {
            api.scrollToContent(undefined, {
              fitToContent: true,
            })
          }, 1000)
        }}
      />

      <MotionButtonBase
        onClick={async () => {
          if (!excalidrawAPIRef.current) {
            toast.error('Excalidraw API not ready')
            return
          }

          const elements = excalidrawAPIRef.current.getSceneElements()
          if (isMobile) {
            const blob = await exportToBlob({
              elements,
              files: null,
            })

            window.open(window.URL.createObjectURL(blob))
          } else {
            const $svg = await exportToSvg({
              elements,
              files: null,
            })

            modal.present({
              title: 'Preview',
              content: () => <SvgPreview svgElement={$svg} />,
            })
          }
        }}
        className="absolute bottom-2 right-2 z-10 box-content flex h-5 w-5 rounded-md border border-zinc-200 p-2 center dark:border-zinc-700"
      >
        <i className="icon-[mingcute--external-link-line]" />
      </MotionButtonBase>
    </div>
  )
}

const SvgPreview: FC<{
  svgElement: SVGSVGElement
}> = ({ svgElement }) => {
  return (
    <div
      className="relative w-full overflow-auto [&>svg]:max-w-full"
      dangerouslySetInnerHTML={{
        __html: svgElement.outerHTML,
      }}
    />
  )
}
