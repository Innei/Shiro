import * as React from 'react'
import { createContext } from 'react'

const LabelPropsContext = createContext<{
  className?: string
}>({})

export const useLabelPropsContext = () => React.useContext(LabelPropsContext)

export const LabelProvider: React.FC<
  React.ContextType<typeof LabelPropsContext> & React.PropsWithChildren
> = ({ children, ...props }) => {
  return (
    <LabelPropsContext.Provider value={props}>
      {children}
    </LabelPropsContext.Provider>
  )
}
