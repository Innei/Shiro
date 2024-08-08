import { forwardRef, useCallback, useImperativeHandle, useMemo } from 'react'
import { produce } from 'immer'
import { atom } from 'jotai'
import type {
  DetailedHTMLProps,
  FormHTMLAttributes,
  PropsWithChildren,
} from 'react'
import type { FormContextType } from './FormContext'
import type { Field } from './types'

import { useRefValue } from '~/hooks/common/use-ref-value'
import { jotaiStore } from '~/lib/store'

import { FormConfigContext, FormContext, useForm } from './FormContext'

export const Form = forwardRef<
  FormContextType,
  PropsWithChildren<
    DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> & {
      showErrorMessage?: boolean
    }
  >
>((props, ref) => {
  const { showErrorMessage = true, ...formProps } = props
  const fieldsAtom = useRefValue(() => atom({}))
  const ctxValue: FormContextType = useRefValue(() => ({
    showErrorMessage,
    fields: fieldsAtom,
    getField: (name: string) =>
      (jotaiStore.get(fieldsAtom as any) as any)[name],
    getCurrentValues: () =>
      Object.fromEntries(
        Object.entries(jotaiStore.get(fieldsAtom)).map(([key, value]) => {
          const nextValue = (value as any as Field).getEl()?.value

          return [
            key,
            (value as Field).transform
              ? (value as Field).transform?.(nextValue)
              : nextValue,
          ]
        }),
      ),
    addField: (name: string, field: Field) => {
      jotaiStore.set(fieldsAtom, (p) => ({
        ...p,
        [name]: field,
      }))
    },

    removeField: (name: string) => {
      jotaiStore.set(fieldsAtom, (p) => {
        const pp = { ...p }
        // @ts-expect-error
        delete pp[name]
        return pp
      })
    },
    setValue: (name: string, value: any) => {
      ctxValue.getField(name)?.setValue(value)
    },
  }))

  useImperativeHandle(ref, () => ctxValue, [ctxValue])

  return (
    <FormContext.Provider value={ctxValue}>
      <FormConfigContext.Provider
        value={useMemo(() => ({ showErrorMessage }), [showErrorMessage])}
      >
        <FormInternal {...formProps} />
      </FormConfigContext.Provider>
    </FormContext.Provider>
  )
})
Form.displayName = 'Form'

const FormInternal = (
  props: PropsWithChildren<
    DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>
  >,
) => {
  const { onSubmit, ...rest } = props
  const fieldsAtom = useForm().fields
  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()

      const fields = jotaiStore.get(fieldsAtom)
      for await (const [key, field] of Object.entries(fields)) {
        const $ref = field.getEl()
        if (!$ref) continue
        const { value } = $ref
        const { rules } = field
        for (const [i, rule] of rules.entries()) {
          try {
            const isOk = await rule.validator(value)
            if (!isOk) {
              console.error(
                `Form validation failed, at field \`${key}\`` +
                  `, got value \`${value}\``,
              )
              $ref.focus()
              if (rule.message) {
                jotaiStore.set(fieldsAtom, (prev) =>
                  produce(prev, (draft) => {
                    ;(draft[key] as Field).rules[i].status = 'error'
                  }),
                )
              }
              return
            }
          } catch (e) {
            console.error('validate function throw error', e)
            return
          }
        }
      }

      onSubmit?.(e)
    },
    [onSubmit],
  )
  return (
    <form onSubmit={handleSubmit} {...rest}>
      {props.children}
    </form>
  )
}
