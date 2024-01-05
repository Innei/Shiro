import * as LabelPrimitive from '@radix-ui/react-label'
import * as React from 'react'

import { clsxm } from '~/lib/helper'

import { useLabelPropsContext } from './LabelContext'

export const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => {
  const propsCtx = useLabelPropsContext()

  return (
    <LabelPrimitive.Root
      ref={ref}
      className={clsxm(
        'text-foreground-600 text-[1em] font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        className,
        propsCtx.className,
      )}
      {...props}
    />
  )
})
Label.displayName = LabelPrimitive.Root.displayName
