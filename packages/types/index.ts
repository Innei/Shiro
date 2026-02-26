import type { createPortal } from 'react-dom'

import type { MotionButtonBase, StyledButton } from '~/components/ui/button'
import type { Input, TextArea } from '~/components/ui/input'
import type { useModalStack as useModalStackHookType } from '~/components/ui/modal'

declare const GlobalComponentMap: {
  Button: typeof StyledButton
  MotionButtonBase: typeof MotionButtonBase
  Input: typeof Input
  TextArea: typeof TextArea
}

type GlobalComponents = typeof GlobalComponentMap

declare const window: any

const prefix = 'shiro'
export const getGlobalComponent = (name: keyof GlobalComponents) =>
  window[prefix][name] as GlobalComponents[keyof GlobalComponents]

export const useModalStack: typeof useModalStackHookType = ((...args: any[]) =>
  window[prefix].useModalStack(...args)) as any

export const dangerouslyCreatePortal = window[prefix]
  .dangerouslyCreatePortal as typeof createPortal
