'use client'
import { produce } from 'immer'
import type { PrimitiveAtom } from 'jotai'
import { atom, useAtom } from 'jotai'
import type { Dispatch, FC, PropsWithChildren, SetStateAction } from 'react'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'

import { StyledButton } from '~/components/ui/button'
import { useModalStack } from '~/components/ui/modal'
import { EmitKeyMap } from '~/constants/keys'
import type { WriteEditEvent } from '~/events'
import { useBeforeUnload } from '~/hooks/common/use-before-unload'
import { useForceUpdate } from '~/hooks/common/use-force-update'
import { throttle } from '~/lib/lodash'
import { buildNSKey } from '~/lib/ns'

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
    globalThis.addEventListener(EmitKeyMap.EditDataUpdate, handler)

    return () => {
      globalThis.removeEventListener(EmitKeyMap.EditDataUpdate, handler)
    }
  }, [])
  useBeforeUnload(isFormDirty)

  return (
    <AutoSaverProvider>
      <BaseWritingContext.Provider value={props.atom as any}>
        {props.children}
      </BaseWritingContext.Provider>
    </AutoSaverProvider>
  )
}

const AutoSaverContext = createContext({
  reset(type: 'note' | 'post', id?: string) {},
})

const AutoSaverProvider: FC<PropsWithChildren> = ({ children }) => {
  useEffect(() => {
    const handler = throttle((e: any) => {
      const ev = e as WriteEditEvent

      const dto = ev.data
      const id = dto.id || ('categoryId' in dto ? 'new-post' : 'new-note')
      const nsKey = buildNSKey(`auto-save-${id}`)

      localStorage.setItem(nsKey, JSON.stringify(dto))
    }, 300)
    globalThis.addEventListener(EmitKeyMap.EditDataUpdate, handler)

    return () => {
      globalThis.removeEventListener(EmitKeyMap.EditDataUpdate, handler)
    }
  }, [])

  return (
    <AutoSaverContext.Provider
      value={useMemo(
        () => ({
          reset(type, nsKey?: string) {
            const id = nsKey || (type === 'note' ? 'new-note' : 'new-post')
            nsKey = buildNSKey(`auto-save-${id}`)
            localStorage.removeItem(nsKey)
          },
        }),
        [],
      )}
    >
      {children}
    </AutoSaverContext.Provider>
  )
}

export const useResetAutoSaverData = () => useContext(AutoSaverContext).reset

export const useAutoSaver = <T extends { id: string }>([
  editingData,
  setEditingData,
]: [T, Dispatch<SetStateAction<T>>]) => {
  const { present } = useModalStack()
  const [forceUpdate, forceUpdateKey] = useForceUpdate()

  useEffect(() => {
    const id =
      editingData.id || ('categoryId' in editingData ? 'new-post' : 'new-note')
    const nsKey = buildNSKey(`auto-save-${id}`)

    const autoSavedDataString = localStorage.getItem(nsKey)

    if (!autoSavedDataString) return
    const autoSavedData = JSON.parse(autoSavedDataString)
    if (!autoSavedData) return

    setTimeout(() => {
      present({
        title: '存在为保存的数据，需要恢复吗？',
        content: ({ dismiss }) => (
          <div className="flex justify-end">
            <StyledButton
              onClick={() => {
                dismiss()
                setEditingData(autoSavedData)
                forceUpdate()
                localStorage.removeItem(nsKey)
              }}
            >
              恢复
            </StyledButton>
          </div>
        ),
      })
    }, 100)
  }, [editingData?.id, forceUpdate, present])

  return [forceUpdateKey]
}

export const useBaseWritingContext = () => useContext(BaseWritingContext)

export const useBaseWritingAtom = (key: keyof BaseModelType) => {
  const ctxAtom = useBaseWritingContext()
  return useAtom(
    useMemo(
      () =>
        atom(
          (get) => get(ctxAtom)[key],
          (get, set, newValue) => {
            set(ctxAtom, (prev) =>
              produce(prev, (draft) => {
                ;(draft as any)[key] = newValue
              }),
            )
          },
        ),
      [ctxAtom, key],
    ),
  )
}
