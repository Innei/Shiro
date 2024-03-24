import { createContext, useContext } from 'react'
import { atom } from 'jotai'
import type { Field } from './types'

const initialFields = atom({} as { [key: string]: Field })
export interface FormContextType {
  fields: typeof initialFields
  addField: (name: string, field: Field) => void
  removeField: (name: string) => void
  getField: (name: string) => Field | undefined
  getCurrentValues: () => Record<string, any>
}

export const FormContext = createContext<FormContextType>(null!)

export const FormConfigContext = createContext<{
  showErrorMessage?: boolean
}>(null!)
export const useForm = () => {
  return useContext(FormContext)
}
export const useFormConfig = () => useContext(FormConfigContext)
