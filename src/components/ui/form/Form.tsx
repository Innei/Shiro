import { useRef } from 'react'
import { atom } from 'jotai'
import type {
  DetailedHTMLProps,
  FormHTMLAttributes,
  PropsWithChildren,
} from 'react'
import type { Field } from './types'

import { jotaiStore } from '~/lib/store'

import { FormContext } from './FormContext'

export const Form = (
  props: PropsWithChildren<
    DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>
  >,
) => {
  const fieldsAtom = useRef(atom({})).current
  return (
    <FormContext.Provider
      value={
        useRef({
          fields: fieldsAtom,

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
        }).current
      }
    >
      <FormInternal {...props} />
    </FormContext.Provider>
  )
}

const FormInternal = (
  props: PropsWithChildren<
    DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>
  >,
) => {
  const { onSubmit, ...rest } = props
  return (
    <form
      onSubmit={(e) => {
        onSubmit?.(e)
      }}
      {...rest}
    >
      {props.children}
    </form>
  )
}
