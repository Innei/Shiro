import * as React from 'react'
import { createContext } from 'react'

const LabelPropsContext = createContext<{
  className?: string
}>({})

export const useLabelPropsContext = () => React.use(LabelPropsContext)

export const LabelProvider: React.FC<
  React.ContextType<typeof LabelPropsContext> & React.PropsWithChildren
> = ({ children, ...props }) => (
  <LabelPropsContext value={props}>{children}</LabelPropsContext>
)
