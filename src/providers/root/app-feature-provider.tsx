'use client'

import { createContext, useContextSelector } from 'use-context-selector'
import type { FC, PropsWithChildren } from 'react'

const appFeatures = {
  tmdb: false,
}
const AppFeatureContext = createContext(appFeatures)
export const AppFeatureProvider: FC<PropsWithChildren & typeof appFeatures> = ({
  children,
  ...features
}) => {
  return (
    <AppFeatureContext.Provider value={features}>
      {children}
    </AppFeatureContext.Provider>
  )
}

export const useFeatureEnabled = (feature: keyof typeof appFeatures) => {
  return useContextSelector(AppFeatureContext, (ctx) => ctx[feature])
}
