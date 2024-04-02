import { memo, useCallback, useRef } from 'react'
import type { DetailedHTMLProps, FC, InputHTMLAttributes } from 'react'
import type { FormFieldBaseProps } from './types'

import { AutoResizeHeight } from '~/components/modules/shared/AutoResizeHeight'
import { clsxm } from '~/lib/helper'

import { TextArea } from '../input'
import { useFormConfig } from './FormContext'
import {
  useAddField,
  useCheckFieldStatus,
  useFormErrorMessage,
  useResetFieldStatus,
} from './hooks'

export const FormTextarea: FC<
  Omit<
    DetailedHTMLProps<
      InputHTMLAttributes<HTMLTextAreaElement>,
      HTMLTextAreaElement
    >,
    'name'
  > &
    FormFieldBaseProps<string>
> = memo(({ className, rules, onKeyDown, transform, name, ...rest }) => {
  const { showErrorMessage } = useFormConfig()

  const inputRef = useRef<HTMLTextAreaElement>(null)

  const errorMessage = useFormErrorMessage(name)
  useAddField({
    rules: rules || [],
    transform,
    getEl: () => inputRef.current,
    name,
  })
  const resetFieldStatus = useResetFieldStatus(name)

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (onKeyDown) onKeyDown(e)
      resetFieldStatus()
    },
    [onKeyDown, resetFieldStatus],
  )

  const validateField = useCheckFieldStatus(name)

  return (
    <>
      <TextArea
        name={name}
        ref={inputRef}
        className={clsxm(
          !!errorMessage && 'ring-2 ring-red-400 dark:ring-orange-700',
          'w-full',
          className,
        )}
        type="text"
        onKeyDown={handleKeyDown}
        onBlur={(e) => {
          validateField()
          rest.onBlur?.(e)
        }}
        {...rest}
      />

      {showErrorMessage && (
        <AutoResizeHeight duration={0.2}>
          <p className="text-left text-sm text-red-400 dark:text-orange-700">
            {errorMessage}
          </p>
        </AutoResizeHeight>
      )}
    </>
  )
})

FormTextarea.displayName = 'FormTextarea'
