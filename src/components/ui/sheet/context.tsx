import { createContext, useContext } from 'react'

interface SheetContextValue {
  dismiss(): void
}
export const SheetContext = createContext<SheetContextValue>(null!)

export const useSheetContext = () => useContext(SheetContext)
