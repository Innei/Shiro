import { memo, useEffect } from 'react'
import type { DetailedHTMLProps, FC, InputHTMLAttributes } from 'react'
import type { FormFieldBaseProps } from './types'

import { clsxm } from '~/utils/helper'

import { useForm } from './FormContext'

export const FormInput: FC<
  DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> &
    FormFieldBaseProps<string>
> = memo(({ className, rules, ...rest }) => {
  const FormCtx = useForm()
  if (!FormCtx) throw new Error('FormInput must be used inside <FormContext />')
  const { addField, removeField } = FormCtx

  useEffect(() => {
    const name = rest.name
    if (!rules) return
    if (!name) return

    addField(name, {
      rules,
    })

    return () => {
      removeField(name)
    }
  }, [rest.name, rules])

  return (
    <input
      className={clsxm(
        'relative h-12 w-full rounded-lg bg-gray-200/50 px-3 dark:bg-zinc-800/50',
        'ring-accent/80 duration-200 focus:ring-2',
        'appearance-none',
        className,
      )}
      type="text"
      {...rest}
    />
  )
})

FormInput.displayName = 'FormInput'
