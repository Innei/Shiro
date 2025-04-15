import { Excalidraw as Board, exportToBlob } from '@excalidraw/excalidraw'
import type { ExcalidrawElement } from '@excalidraw/excalidraw/element/types'
import type {
  AppState,
  BinaryFiles,
  ExcalidrawImperativeAPI,
} from '@excalidraw/excalidraw/types'
import { useQuery } from '@tanstack/react-query'
import type { Delta } from 'jsondiffpatch'
import { patch } from 'jsondiffpatch'
import * as React from 'react'
import { forwardRef, useImperativeHandle, useMemo, useRef } from 'react'

import { useIsMobile } from '~/atoms/hooks'
import { API_URL } from '~/constants/env'
import { useIsDark } from '~/hooks/common/use-is-dark'
import { stopPropagation } from '~/lib/dom'
import { clsxm, safeJsonParse } from '~/lib/helper'
import { cloneDeep } from '~/lib/lodash'
import { toast } from '~/lib/toast'

import { MotionButtonBase } from '../button'
import { useModalStack } from '../modal'

export interface ExcalidrawProps {
  zenModeEnabled?: boolean
  viewModeEnabled?: boolean
  showExtendButton?: boolean
  onChange?: (
    elements: readonly ExcalidrawElement[],
    appState: AppState,
    files: BinaryFiles,
  ) => void
  className?: string
  onReady?: (api: ExcalidrawImperativeAPI) => void

  ////
  data?: object
  refUrl?: string
  patchDiffDelta?: Delta
}

export interface ExcalidrawRefObject {
  getRefData(): ExcalidrawElement | null | undefined
  getDiffDelta(): Delta | null | undefined
}
export const Excalidraw = forwardRef<
  ExcalidrawRefObject,
  Omit<ExcalidrawProps, 'refUrl' | 'patchDiffDelta' | 'data'> & {
    data: string
  }
>((props, ref) => {
  const { data, ...rest } = props
  const transformedProps: {
    data?: ExcalidrawElement
    refUrl?: string
    patchDiffDelta?: Delta
  } = useMemo(() => {
    if (!data) return {}
    const tryParseJson = safeJsonParse(data)
    if (!tryParseJson) {
      // 1. data 是 string，取第一行判断
      const splittedLines = data.split('\n')
      const firstLine = splittedLines[0]
      const otherLines = splittedLines.slice(1).join('\n')

      const props = {} as any
      // 第一行是地址
      if (firstLine.startsWith('http')) {
        props.refUrl = firstLine
      }
      // 第一行是 ref:file/:filename
      // 命中后端文件
      else if (firstLine.startsWith('ref:')) {
        props.refUrl = `${API_URL}/objects/${firstLine.slice(4)}`
      }

      if (otherLines.trim().length > 0) {
        // 识别为其他行是 delta diff

        props.patchDiffDelta = safeJsonParse(otherLines)
      }

      return props
    } else {
      return {
        data: tryParseJson as ExcalidrawElement,
      }
    }
  }, [data])

  const internalRef = useRef<InternelExcalidrawRefObject>(null)
  useImperativeHandle(ref, () => ({
    getRefData() {
      return internalRef.current?.getRemoteData()
    },
    getDiffDelta() {
      return transformedProps.patchDiffDelta
    },
  }))

  return <ExcalidrawImpl ref={internalRef} {...rest} {...transformedProps} />
})

Excalidraw.displayName = 'Excalidraw'

interface InternelExcalidrawRefObject {
  getRemoteData(): ExcalidrawElement | null | undefined
}

const ExcalidrawImpl = forwardRef<InternelExcalidrawRefObject, ExcalidrawProps>(
  (
    {
      data,

      refUrl,
      patchDiffDelta,
      viewModeEnabled = true,
      zenModeEnabled = true,
      onChange,
      className,
      showExtendButton = true,
      onReady,
    },
    ref,
  ) => {
    const excalidrawAPIRef = React.useRef<ExcalidrawImperativeAPI>()
    const modal = useModalStack()
    const isMobile = useIsMobile()

    const { data: refData, isLoading } = useQuery({
      queryKey: ['excalidraw', refUrl as string],
      queryFn: async ({ queryKey }) => {
        const [_, refUrl] = queryKey
        const res = await fetch(refUrl)
        return await res.json()
      },
      enabled: !!refUrl,
    })

    useImperativeHandle(ref, () => {
      return {
        getRemoteData() {
          return refData
        },
      }
    })

    const finalDataIfRefUrl = useMemo(() => {
      if (!refData) return null

      return patch(cloneDeep(refData), patchDiffDelta)
    }, [refData, refUrl])

    const isDarkMode = useIsDark()

    const finalData = useMemo(() => {
      const finalData = data || finalDataIfRefUrl
      if (!finalData && !isLoading) {
        console.error('Excalidraw: data not exist')
      }
      return finalData as ExcalidrawElement
    }, [data, finalDataIfRefUrl, isLoading])

    return (
      <div
        onKeyDown={stopPropagation}
        onKeyUp={stopPropagation}
        className={clsxm('relative h-[500px] w-full', className)}
      >
        {isLoading && (
          <div className="center absolute inset-0 z-10 flex">
            <div className="loading loading-spinner" />
          </div>
        )}
        <Board
          key={
            refUrl ? `excalidraw-refData-loading-${isLoading}` : 'excalidraw'
          }
          theme={isDarkMode ? 'dark' : 'light'}
          initialData={finalData}
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
            }, 300)

            onReady?.(api)
          }}
        />

        {viewModeEnabled && showExtendButton && (
          <MotionButtonBase
            onClick={() => {
              if (!excalidrawAPIRef.current) {
                toast.error('Excalidraw API not ready')
                return
              }

              const elements = excalidrawAPIRef.current.getSceneElements()
              if (isMobile) {
                const win = window.open()
                const blob = exportToBlob({
                  elements,
                  files: null,
                })
                blob.then((blob: Blob) => {
                  win?.location.replace(URL.createObjectURL(blob))
                })
              } else {
                modal.present({
                  title: 'Preview',
                  content: () => (
                    <ExcalidrawImpl
                      data={data}
                      className="h-full"
                      showExtendButton={false}
                      refUrl={refUrl}
                    />
                  ),
                  clickOutsideToDismiss: true,
                  max: true,
                })
              }
            }}
            className={clsxm(
              'absolute bottom-2 right-2 z-10 box-content flex size-5 rounded-md border p-2 center',
              'border-zinc-200 bg-base-100 text-zinc-600',
              'dark:border-neutral-800 dark:text-zinc-500',
            )}
          >
            <i className="i-mingcute-external-link-line" />
          </MotionButtonBase>
        )}
      </div>
    )
  },
)
ExcalidrawImpl.displayName = 'ExcalidrawImpl'
