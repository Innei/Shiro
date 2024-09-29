'use client'

import { useIsomorphicLayoutEffect } from 'foxact/use-isomorphic-layout-effect'
import React from 'react'
import ReactDOM from 'react-dom'

import { MotionButtonBase, StyledButton } from '../ui/button'
import { Input, TextArea } from '../ui/input'
import { useModalStack } from '../ui/modal'

const prefix = 'shiro'

const globalComponentMap = {
  Button: StyledButton,
  MotionButtonBase,
  Input,
  TextArea,
}

export const Global = () => {
  useIsomorphicLayoutEffect(() => {
    const ReactDOMModule = Object.assign({}, ReactDOM, {
      createPortal: createShadowPortal,
    })
    Object.assign(window, {
      React,
      ReactDOM: ReactDOMModule,

      react: React,
      reactDom: ReactDOMModule,
      [prefix]: {
        ...globalComponentMap,

        useModalStack,
      },
    })
  }, [])
  return null
}

function createShadowPortal(children: React.ReactNode, container: HTMLElement) {
  let targetContainer = container

  while (targetContainer && !targetContainer.shadowRoot) {
    targetContainer = targetContainer.parentNode as HTMLElement
  }

  if (!targetContainer) {
    return ReactDOM.createPortal(children, container)
  }

  return ReactDOM.createPortal(
    children,
    targetContainer.contains(container) ? container : targetContainer,
  )
}
