'use client'

import { createContext, use, useEffect, useMemo, useState } from 'react'

import { cloneDeep } from '~/lib/lodash'
import {
  useAggregationSelector,
  useAppConfigSelector,
} from '~/providers/root/aggregation-data-provider'

import { headerMenuConfig as baseHeaderMenuConfig } from '../config'

const HeaderMenuConfigContext = createContext({
  config: baseHeaderMenuConfig,
})

export const useHeaderConfig = () => use(HeaderMenuConfigContext)
export const HeaderDataConfigureProvider: Component = ({ children }) => {
  const pageMeta = useAggregationSelector(
    (aggregationData) => aggregationData.pageMeta,
  )
  const categories = useAggregationSelector(
    (aggregationData) => aggregationData.categories,
  )
  const postListViewMode = useAppConfigSelector(
    (appConfig) => appConfig.module?.posts?.mode,
  )

  const [headerMenuConfig, setHeaderMenuConfig] = useState(baseHeaderMenuConfig)

  useEffect(() => {
    if (!pageMeta) return
    const nextMenuConfig = cloneDeep(baseHeaderMenuConfig)
    if (pageMeta) {
      const homeIndex = nextMenuConfig.findIndex((item) => item.type === 'Home')
      if (homeIndex !== -1) {
        nextMenuConfig[homeIndex].subMenu = []
        for (const page of pageMeta) {
          nextMenuConfig[homeIndex].subMenu!.push({
            path: `/${page.slug}`,
            title: page.title,
          })
        }
      }
    }

    if (categories?.length) {
      const postIndex = nextMenuConfig.findIndex((item) => item.type === 'Post')
      if (postIndex !== -1) {
        nextMenuConfig[postIndex].subMenu = []
        for (const category of categories) {
          nextMenuConfig[postIndex].subMenu!.push({
            path: `/categories/${category.slug}`,
            title: category.name,
          })
        }
      }
    }

    setHeaderMenuConfig(nextMenuConfig)
  }, [categories, pageMeta])

  useEffect(() => {
    setHeaderMenuConfig((config) => {
      const postIndex = config.findIndex((item) => item.type === 'Post')

      if (postIndex != -1 && postListViewMode) {
        // post.search
        config[postIndex] = {
          ...config[postIndex],
          search: {
            ...config[postIndex].search,
            view_mode: postListViewMode,
          },
        }
      }
      return [...config]
    })
  }, [postListViewMode])

  return (
    <HeaderMenuConfigContext
      value={useMemo(() => ({ config: headerMenuConfig }), [headerMenuConfig])}
    >
      {children}
    </HeaderMenuConfigContext>
  )
}
