'use client'

import React from 'react'
import ReactDOM from 'react-dom'
import { useIsomorphicLayoutEffect } from 'foxact/use-isomorphic-layout-effect'

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
