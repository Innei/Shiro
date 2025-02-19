'use client'

import { useIsomorphicLayoutEffect } from 'foxact/use-isomorphic-layout-effect'
import * as React from 'react'
import ReactDOM from 'react-dom'

export const Global = () => {
  useIsomorphicLayoutEffect(() => {
    Object.assign(window, {
      React,
      ReactDOM,
      react: React,
      reactDom: ReactDOM,
    })
  }, [])
  return null
}
