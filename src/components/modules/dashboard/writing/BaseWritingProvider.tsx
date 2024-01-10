import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { produce } from 'immer'
import { atom, useAtom } from 'jotai'
import type { PrimitiveAtom } from 'jotai'
import type { PropsWithChildren } from 'react'

import { EmitKeyMap } from '~/constants/keys'
import { useBeforeUnload } from '~/hooks/common/use-before-unload'

const BaseWritingContext = createContext<PrimitiveAtom<BaseModelType>>(null!)

type BaseModelType = {
  title: string
  slug?: string
  text: string
  categoryId?: string
  subtitle?: string
}

export const BaseWritingProvider = <T extends BaseModelType>(
  props: { atom: PrimitiveAtom<T> } & PropsWithChildren,
) => {
  const [isFormDirty, setIsDirty] = useState(false)
  useEffect(() => {
    const handler = () => {
      setIsDirty(true)
    }
    window.addEventListener(EmitKeyMap.EditDataUpdate, handler)

    return () => {
      window.removeEventListener(EmitKeyMap.EditDataUpdate, handler)
    }
  }, [])
  useBeforeUnload(isFormDirty)

  useBeforeUnload.forceRoute(() => {
    console.log('forceRoute')
  })
  return (
    <BaseWritingContext.Provider value={props.atom as any}>
      {props.children}
    </BaseWritingContext.Provider>
  )
}

export const useBaseWritingContext = () => {
  return useContext(BaseWritingContext)
}

export const useBaseWritingAtom = (key: keyof BaseModelType) => {
  const ctxAtom = useBaseWritingContext()
  return useAtom(
    useMemo(
      () =>
        atom(
          (get) => get(ctxAtom)[key],
          (get, set, newValue) => {
            set(ctxAtom, (prev) => {
              return produce(prev, (draft) => {
                ;(draft as any)[key] = newValue
              })
            })
          },
        ),
      [ctxAtom, key],
    ),
  )
}
