import * as RadixTabs from '@radix-ui/react-tabs'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useState,
} from 'react'
import { useIsomorphicLayoutEffect } from 'foxact/use-isomorphic-layout-effect'
import { m } from 'framer-motion'
import type { FC, PropsWithChildren } from 'react'

import { clsxm } from '~/lib/helper'

const TabActionContext = createContext<{
  addTab: (label: string) => void
}>(null!)
export const Tabs: FC<PropsWithChildren> = ({ children }) => {
  const [tabs, setTabs] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState<string | null>(null)
  const id = useId()

  useEffect(() => {
    if (!tabs.length) return
    if (!activeTab) {
      setActiveTab(tabs[0])
    }
  }, [tabs.length])
  return (
    <TabActionContext.Provider
      value={{
        addTab: useCallback((label) => {
          setTabs((tabs) => [...tabs, label])

          return () => {
            setTabs((tabs) => tabs.filter((tab) => tab !== label))
          }
        }, []),
      }}
    >
      <RadixTabs.Root value={activeTab || ''} onValueChange={setActiveTab}>
        <RadixTabs.List className="flex gap-2">
          {tabs.map((tab) => {
            return (
              <RadixTabs.Trigger
                className={clsxm(
                  'relative flex px-2 py-1 text-sm font-bold focus:outline-none',
                  'text-gray-600 transition-colors duration-300 dark:text-gray-300',
                )}
                key={tab}
                value={tab}
              >
                {tab}

                {activeTab === tab && (
                  <m.div
                    layoutId={`tab${id}`}
                    layout
                    className="absolute inset-x-2 -bottom-1 h-[2px] rounded-md bg-accent"
                  />
                )}
              </RadixTabs.Trigger>
            )
          })}
        </RadixTabs.List>

        {children}
      </RadixTabs.Root>
    </TabActionContext.Provider>
  )
}

export const Tab: FC<{
  label: string
  children: React.ReactNode
}> = ({ label, children }) => {
  const { addTab } = useContext(TabActionContext)
  useIsomorphicLayoutEffect(() => {
    return addTab(label)
  }, [])

  return <RadixTabs.Content value={label}>{children}</RadixTabs.Content>
}
