import { memo, useCallback, useEffect, useRef } from 'react'
import { produce } from 'immer'
import { useAtomValue } from 'jotai'
import { selectAtom } from 'jotai/utils'
import type { DetailedHTMLProps, FC, InputHTMLAttributes } from 'react'
import type { FormFieldBaseProps } from './types'

import { AutoResizeHeight } from '~/components/widgets/shared/AutoResizeHeight'
import { jotaiStore } from '~/lib/store'
import { clsxm } from '~/utils/helper'

import { useForm, useFormConfig } from './FormContext'

export const FormInput: FC<
  DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> &
    FormFieldBaseProps<string>
> = memo(({ className, rules, onKeyDown, ...rest }) => {
  const FormCtx = useForm()
  if (!FormCtx) throw new Error('FormInput must be used inside <FormContext />')
  const { showErrorMessage } = useFormConfig()
  const { addField, removeField, fields } = FormCtx
  const inputRef = useRef<HTMLInputElement>(null)

  const errorMessage = useAtomValue(
    selectAtom(
      fields,
      useCallback(
        (atomValue) => {
          if (!rest.name) return
          return atomValue[rest.name]?.rules.find(
            (rule) => rule.status === 'error',
          )?.message
        },
        [rest.name],
      ),
    ),
  )
  useEffect(() => {
    const name = rest.name
    if (!rules) return
    if (!name) return

    addField(name, {
      rules,
      $ref: inputRef.current,
    })

    return () => {
      removeField(name)
    }
  }, [rest.name, rules])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (onKeyDown) onKeyDown(e)
      // const currentField =
      jotaiStore.set(fields, (p) => {
        return produce(p, (draft) => {
          if (!rest.name) return
          draft[rest.name].rules.forEach((rule) => {
            if (rule.status === 'error') rule.status = 'success'
          })
        })
      })
    },
    [fields, onKeyDown, rest.name],
  )

  return (
    <>
      <input
        ref={inputRef}
        className={clsxm(
          'relative h-12 w-full rounded-lg bg-gray-200/50 px-3 dark:bg-zinc-800/50',
          'ring-accent/80 duration-200 focus:ring-2',
          'appearance-none',
          !!errorMessage && 'ring-2 ring-red-400 dark:ring-orange-700',
          className,
        )}
        type="text"
        onKeyDown={handleKeyDown}
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

FormInput.displayName = 'FormInput'
