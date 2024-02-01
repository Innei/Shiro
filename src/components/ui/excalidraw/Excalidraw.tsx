import React from 'react'
import type { ExcalidrawElement } from '@excalidraw/excalidraw/types/element/types'
import type {
  AppState,
  BinaryFiles,
  ExcalidrawImperativeAPI,
} from '@excalidraw/excalidraw/types/types'
import type { FC } from 'react'

import {
  Excalidraw as Board,
  exportToBlob,
  exportToSvg,
} from '@excalidraw/excalidraw'

import { useIsMobile } from '~/atoms'
import { useIsDark } from '~/hooks/common/use-is-dark'
import { clsxm } from '~/lib/helper'
import { toast } from '~/lib/toast'

import { MotionButtonBase } from '../button'
import { useModalStack } from '../modal'

export const Excalidraw: FC<{
  data: object

  zenModeEnabled?: boolean
  viewModeEnabled?: boolean
  showExtendButton?: boolean

  onChange?: (
    elements: readonly ExcalidrawElement[],
    appState: AppState,
    files: BinaryFiles,
  ) => void
  className?: string
}> = ({
  data,
  viewModeEnabled = true,
  zenModeEnabled = true,
  onChange,
  className,
  showExtendButton = true,
}) => {
  const excalidrawAPIRef = React.useRef<ExcalidrawImperativeAPI>()
  const modal = useModalStack()
  const isMobile = useIsMobile()

  const isDarkMode = useIsDark()
  return (
    <div className={clsxm('relative h-[500px] w-full', className)}>
      <Board
        theme={isDarkMode ? 'dark' : 'light'}
        initialData={data}
        detectScroll={false}
        zenModeEnabled={zenModeEnabled}
        onChange={onChange}
        viewModeEnabled={viewModeEnabled}
        excalidrawAPI={(api) => {
          excalidrawAPIRef.current = api

          setTimeout(() => {
            api.scrollToContent(undefined, {
              fitToContent: true,
            })
          }, 1000)
        }}
      />

      {viewModeEnabled && showExtendButton && (
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
              const windowRect = {
                w: window.innerWidth,
                h: window.innerHeight,
              }

              const $svg = await exportToSvg({
                elements,
                files: null,
                maxWidthOrHeight: Math.min(
                  windowRect.h * 0.7,
                  windowRect.w * 0.9,
                ),
                appState: { theme: isDarkMode ? 'dark' : 'light' },
                exportPadding: 12,
              })

              modal.present({
                title: 'Preview',
                content: () => <SvgPreview svgElement={$svg} />,
                clickOutsideToDismiss: true,
              })
            }
          }}
          className={clsxm(
            'absolute bottom-2 right-2 z-10 box-content flex h-5 w-5 rounded-md border p-2 center',
            'border-zinc-200 text-zinc-600',
            'dark:border-neutral-800 dark:text-zinc-500',
          )}
        >
          <i className="icon-[mingcute--external-link-line]" />
        </MotionButtonBase>
      )}
    </div>
  )
}

const SvgPreview: FC<{
  svgElement: SVGSVGElement
}> = ({ svgElement }) => {
  return (
    <div
      className="relative w-full overflow-auto [&>svg]:!h-full [&>svg]:!w-full [&>svg]:max-w-full"
      dangerouslySetInnerHTML={{
        __html: svgElement.outerHTML,
      }}
    />
  )
}
