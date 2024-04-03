import { useCallback, useEffect } from 'react'
import { produce } from 'immer'
import { useAtomValue, useStore } from 'jotai'
import { selectAtom } from 'jotai/utils'
import type { Field } from './types'

import { useEventCallback } from '~/hooks/common/use-event-callback'

import { useForm } from './FormContext'

const useAssetFormContext = () => {
  const FormCtx = useForm()
  if (!FormCtx) throw new Error('FormInput must be used inside <FormContext />')
  return FormCtx
}
export const useFormErrorMessage = (name: string) => {
  const FormCtx = useAssetFormContext()

  const { fields } = FormCtx

  return useAtomValue(
    selectAtom(
      fields,
      useCallback(
        (atomValue) => {
          if (!name) return
          return atomValue[name]?.rules.find((rule) => rule.status === 'error')
            ?.message
        },
        [name],
      ),
    ),
  )
}

export const useAddField = ({
  rules,
  transform,
  getEl: getRef,
  name,
}: Field & { name: string }) => {
  const FormCtx = useAssetFormContext()

  const { addField, removeField } = FormCtx
  const stableGetEl = useEventCallback(getRef)
  useEffect(() => {
    if (!rules) return
    if (!name) return

    addField(name, {
      rules,
      getEl: stableGetEl,
      transform,
    })

    return () => {
      removeField(name)
    }
  }, [addField, stableGetEl, name, removeField, rules, transform])
}

export const useResetFieldStatus = (name: string) => {
  const jotaiStore = useStore()
  const FormCtx = useAssetFormContext()
  const { fields } = FormCtx
  return useCallback(() => {
    jotaiStore.set(fields, (p) => {
      return produce(p, (draft) => {
        if (!name) return
        draft[name].rules.forEach((rule) => {
          if (rule.status === 'error') rule.status = 'success'
        })
      })
    })
  }, [fields, jotaiStore, name])
}

export const useCheckFieldStatus = (name: string) => {
  const jotaiStore = useStore()
  const FormCtx = useAssetFormContext()
  const { fields } = FormCtx
  return useCallback(() => {
    jotaiStore.set(fields, (p) => {
      return produce(p, (draft) => {
        if (!name) return
        const value = draft[name].getEl()?.value
        if (!value) return
        draft[name].rules.some((rule) => {
          const result = rule.validator(value)
          if (!result) {
            rule.status = 'error'

            return true
          }
        })
      })
    })
  }, [fields, jotaiStore, name])
}
