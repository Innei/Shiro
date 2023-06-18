'use client'

import { createContext, useContext, useState } from 'react'
import type { Dispatch, FC, PropsWithChildren, SetStateAction } from 'react'

// export const [CurrentNoteIdProvider, useCurrentNoteId, useSetCurrentNoteId] =
//   createContextState<undefined | string>(undefined)

const CurrentNoteIdContext = createContext(undefined as undefined | string)

const SetCurrentNoteIdContext = createContext<
  Dispatch<SetStateAction<string | undefined>>
>(() => void 0)

const CurrentNoteIdProvider: FC<
  {
    initialNoteId?: string
  } & PropsWithChildren
> = ({ initialNoteId, children }) => {
  const [currentNoteId, setCurrentNoteId] = useState(initialNoteId)
  return (
    <CurrentNoteIdContext.Provider value={currentNoteId}>
      <SetCurrentNoteIdContext.Provider value={setCurrentNoteId}>
        {children}
      </SetCurrentNoteIdContext.Provider>
    </CurrentNoteIdContext.Provider>
  )
}
const useCurrentNoteId = () => {
  return useContext(CurrentNoteIdContext)
}
const useSetCurrentNoteId = () => {
  return useContext(SetCurrentNoteIdContext)
}

export { useCurrentNoteId, useSetCurrentNoteId, CurrentNoteIdProvider }
