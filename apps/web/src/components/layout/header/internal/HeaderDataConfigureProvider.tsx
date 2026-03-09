'use client'

import { createContext, use, useEffect, useMemo, useState } from 'react'

import {
  useAggregationSelector,
  useAppConfigSelector,
} from '~/providers/root/aggregation-data-provider'

import type { IHeaderMenu } from '../config'
import {
  getIconByKey,
  headerMenuConfig as baseHeaderMenuConfig,
} from '../config'

const HeaderMenuConfigContext = createContext({
  config: baseHeaderMenuConfig,
})

export const useHeaderConfig = () => use(HeaderMenuConfigContext)

const cloneHeaderMenuConfig = (items: IHeaderMenu[]): IHeaderMenu[] =>
  items.map((item) => ({
    ...item,
    icon: item.icon,
    titleKey: item.titleKey,
    search: item.search ? { ...item.search } : undefined,
    exclude: item.exclude ? [...item.exclude] : undefined,
    subMenu: item.subMenu
      ? cloneHeaderMenuConfig(item.subMenu as IHeaderMenu[])
      : undefined,
  }))

// 从后端配置转换为前端菜单配置
const convertBackendMenuConfig = (items: HeaderMenuItem[]): IHeaderMenu[] => {
  return items.map((item) => ({
    title: item.title,
    titleKey: item.titleKey,
    path: item.path,
    type: item.type,
    icon: getIconByKey(item.icon),
    iconKey: item.icon,
    subMenu: item.subMenu ? convertBackendMenuConfig(item.subMenu) : undefined,
    exclude: item.exclude,
    external: item.external,
    // 为 Post 类型添加特殊处理
    do:
      item.type === 'Post'
        ? () => {
            window.__POST_LIST_ANIMATED__ = true
          }
        : undefined,
  }))
}

export const HeaderDataConfigureProvider: Component = ({ children }) => {
  const pageMeta = useAggregationSelector(
    (aggregationData) => aggregationData.pageMeta,
  )
  const postListViewMode = useAppConfigSelector(
    (appConfig) => appConfig.module?.posts?.mode,
  )

  // 从后端获取 header 配置
  const headerConfigFromBackend = useAggregationSelector(
    (aggregationData) => aggregationData.theme?.header,
  )

  const [headerMenuConfig, setHeaderMenuConfig] = useState(() =>
    cloneHeaderMenuConfig(baseHeaderMenuConfig),
  )

  // 当后端配置或页面元数据变化时更新菜单配置
  useEffect(() => {
    let baseConfig: IHeaderMenu[]

    // 如果后端有配置，使用后端配置
    if (
      headerConfigFromBackend?.menu &&
      headerConfigFromBackend.menu.length > 0
    ) {
      baseConfig = convertBackendMenuConfig(headerConfigFromBackend.menu)
    } else {
      // 否则使用默认配置
      baseConfig = cloneHeaderMenuConfig(baseHeaderMenuConfig)
    }

    // 动态添加页面到首页子菜单
    if (pageMeta) {
      const nextMenuConfig = [...baseConfig]
      const homeIndex = nextMenuConfig.findIndex((item) => item.type === 'Home')
      if (homeIndex !== -1) {
        const homeItem = { ...nextMenuConfig[homeIndex] }
        homeItem.subMenu = [...(homeItem.subMenu || [])]
        for (const page of pageMeta) {
          homeItem.subMenu!.push({
            path: `/${page.slug}`,
            title: page.title,
          })
        }
        nextMenuConfig[homeIndex] = homeItem
      }
      setHeaderMenuConfig(nextMenuConfig)
    } else {
      setHeaderMenuConfig(baseConfig)
    }
  }, [pageMeta, headerConfigFromBackend])

  useEffect(() => {
    setHeaderMenuConfig((config) => {
      const postIndex = config.findIndex((item) => item.type === 'Post')

      if (postIndex === -1 || !postListViewMode) {
        return config
      }

      return config.map((item, index) => {
        if (index !== postIndex) return item
        return {
          ...item,
          search: {
            ...item.search,
            view_mode: postListViewMode,
          },
        }
      })
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
