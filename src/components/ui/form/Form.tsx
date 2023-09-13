import { useCallback, useMemo } from 'react'
import { produce } from 'immer'
import { atom } from 'jotai'
import type {
  DetailedHTMLProps,
  FormHTMLAttributes,
  PropsWithChildren,
} from 'react'
import type { Field } from './types'

import { useRefValue } from '~/hooks/common/use-ref-value'
import { jotaiStore } from '~/lib/store'

import { FormConfigContext, FormContext, useForm } from './FormContext'

export const Form = (
  props: PropsWithChildren<
    DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> & {
      showErrorMessage?: boolean
    }
  >,
) => {
  const { showErrorMessage = true, ...formProps } = props
  const fieldsAtom = useRefValue(() => atom({}))
  return (
    <FormContext.Provider
      value={useRefValue(() => ({
        showErrorMessage,
        fields: fieldsAtom,
        getField: (name: string) => {
          // @ts-expect-error
          return jotaiStore.get(fieldsAtom)[name]
        },
        addField: (name: string, field: Field) => {
          jotaiStore.set(fieldsAtom, (p) => {
            return {
              ...p,
              [name]: field,
            }
          })
        },

        removeField: (name: string) => {
          jotaiStore.set(fieldsAtom, (p) => {
            const pp = { ...p }
            // @ts-expect-error
            delete pp[name]
            return pp
          })
        },
      }))}
    >
      <FormConfigContext.Provider
        value={useMemo(() => ({ showErrorMessage }), [showErrorMessage])}
      >
        <FormInternal {...formProps} />
      </FormConfigContext.Provider>
    </FormContext.Provider>
  )
}

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
        const $ref = field.$ref
        if (!$ref) continue
        const value = $ref.value
        const rules = field.rules
        for (let i = 0; i < rules.length; i++) {
          const rule = rules[i]
          try {
            const isOk = await rule.validator(value)
            if (!isOk) {
              console.error(
                `Form validation failed, at field \`${key}\`` +
                  `, got value \`${value}\``,
              )
              $ref.focus()
              if (rule.message) {
                jotaiStore.set(fieldsAtom, (prev) => {
                  return produce(prev, (draft) => {
                    ;(draft[key] as Field).rules[i].status = 'error'
                  })
                })
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
