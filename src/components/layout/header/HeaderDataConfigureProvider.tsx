/* eslint-disable @typescript-eslint/no-non-null-assertion */
'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'

import { useAggregationQuery } from '~/hooks/data/use-aggregation'
import { cloneDeep } from '~/lib/_'

import { headerMenuConfig as baseHeaderMenuConfig } from './config'

const HeaderMenuConfigContext = createContext({
  config: baseHeaderMenuConfig,
})

export const useHeaderConfig = () => useContext(HeaderMenuConfigContext)
export const HeaderDataConfigureProvider: Component = ({ children }) => {
  const { data } = useAggregationQuery()
  const [headerMenuConfig, setHeaderMenuConfig] = useState(baseHeaderMenuConfig)

  useEffect(() => {
    if (!data) return
    const nextMenuConfig = cloneDeep(baseHeaderMenuConfig)
    if (data.pageMeta) {
      const homeIndex = nextMenuConfig.findIndex((item) => item.type === 'Home')
      if (homeIndex !== -1) {
        nextMenuConfig[homeIndex].subMenu = []
        for (const page of data.pageMeta) {
          nextMenuConfig[homeIndex].subMenu!.push({
            path: page.slug,
            title: page.title,
          })
        }
      }
    }

    if (data.categories?.length) {
      const postIndex = nextMenuConfig.findIndex((item) => item.type === 'Post')
      if (postIndex !== -1) {
        nextMenuConfig[postIndex].subMenu = []
        for (const category of data.categories) {
          nextMenuConfig[postIndex].subMenu!.push({
            path: `/categories/${category.slug}`,
            title: category.name,
          })
        }
      }
    }

    setHeaderMenuConfig(nextMenuConfig)
  }, [data])

  return (
    <HeaderMenuConfigContext.Provider
      value={useMemo(() => ({ config: headerMenuConfig }), [headerMenuConfig])}
    >
      {children}
    </HeaderMenuConfigContext.Provider>
  )
}
