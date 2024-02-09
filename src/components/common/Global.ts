'use client'

import React, { useLayoutEffect } from 'react'
import ReactDOM from 'react-dom'

import * as Button from '~/components/ui/button'

export const Global = () => {
  useLayoutEffect(() => {
    Object.assign(window, {
      React,
      ReactDOM,
      ShiroComponents: { ...Button },
    })
  }, [])
  return null
}
