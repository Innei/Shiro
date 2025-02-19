'use client'

import { useIsomorphicLayoutEffect } from 'foxact/use-isomorphic-layout-effect'
import * as React from 'react'
import { use } from 'react'
import ReactDOM from 'react-dom'

import { MotionButtonBase, StyledButton } from '../ui/button'
import { Input, TextArea } from '../ui/input'
import { useModalStack } from '../ui/modal'
import { ShadowDOMContext } from '../ui/react-component-render/ShadowDOM'

const prefix = 'shiro'

const globalComponentMap = {
  Button: StyledButton,
  MotionButtonBase,
  Input,
  TextArea,
}

export const injectGlobal = () => {
  const ReactDOMModule = Object.assign({}, ReactDOM, {
    createPortal: createShadowPortal,
  })
  Object.assign(window, {
    React,
    ReactDOM: ReactDOMModule,

    react: React,
    reactDom: ReactDOMModule,

    dangerouslyCreatePortal: ReactDOM.createPortal,
    [prefix]: {
      ...globalComponentMap,

      useModalStack,
    },
  })
}
export const Global = () => {
  useIsomorphicLayoutEffect(() => {
    injectGlobal()
  }, [])
  return null
}

function createShadowPortal(children: React.ReactNode, container: HTMLElement) {
  let shadowRoot: ShadowRoot | null

  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const root = use(ShadowDOMContext)
    shadowRoot = root
  } catch {
    return null
  }

  if (!shadowRoot) {
    console.error(
      'No Shadow Root found in the document. Portal creation prevented.',
    )

    return null
  }
  // 在 Shadow Root 内创建一个新的容器
  const shadowContainer = document.createElement('div')
  shadowRoot.append(shadowContainer)

  // 使用新创建的容器进行 Portal 渲染
  return ReactDOM.createPortal(
    children,
    shadowRoot.contains(container) ? container : shadowContainer,
  )
}
