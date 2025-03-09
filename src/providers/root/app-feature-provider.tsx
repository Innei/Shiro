'use client'

import type { FC, PropsWithChildren } from 'react'
import { createContext, useContextSelector } from 'use-context-selector'

const appFeatures = {
  tmdb: false,
}
const AppFeatureContext = createContext(appFeatures)
export const AppFeatureProvider: FC<PropsWithChildren & typeof appFeatures> = ({
  children,
  ...features
}) => (
  <AppFeatureContext value={features}>
    {children}
  </AppFeatureContext>
)

export const useFeatureEnabled = (feature: keyof typeof appFeatures) =>
  useContextSelector(AppFeatureContext, (ctx) => ctx[feature])
