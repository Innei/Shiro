import { createContext, useContext } from 'react'
import type { Atom } from 'jotai'
import type { Field } from './types'

export const FormContext = createContext<{
  fields: Atom<{
    [key: string]: Field
  }>

  addField: (name: string, field: Field) => void
  removeField: (name: string) => void
}>(null!)
export const useForm = () => {
  return useContext(FormContext)
}
