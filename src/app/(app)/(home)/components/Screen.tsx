'use client'

import React, { forwardRef, useRef } from 'react'
import { useInView } from 'framer-motion'
import type { PropsWithChildren } from 'react'

import { isDev } from '~/lib/env'
import { clsxm } from '~/lib/helper'

const debugStyle = {
  outline: '1px solid #0088cc',
}
export const Screen = forwardRef<
  HTMLDivElement,
  PropsWithChildren<{
    className?: string
  }>
>((props, ref) => {
  return (
    <InViewScreen
      ref={ref}
      className={clsxm(
        'h-dvh min-h-[800px] min-w-0 max-w-screen overflow-hidden',
        props.className,
      )}
    >
      {props.children}
    </InViewScreen>
  )
})

export const InViewScreen = forwardRef<
  HTMLDivElement,
  PropsWithChildren<{
    className?: string
  }>
>((props, ref) => {
  const inViewRef = useRef<HTMLSpanElement>(null)
  const inView = useInView(inViewRef, { once: true })

  return (
    <div
      ref={ref}
      style={isDev ? debugStyle : undefined}
      className={clsxm('relative flex flex-col center', props.className)}
    >
      <span ref={inViewRef} />
      {inView && props.children}
    </div>
  )
})

InViewScreen.displayName = 'InViewScreen'
Screen.displayName = 'Screen'
