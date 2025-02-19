import type { FC, ReactNode } from 'react'
import * as React from 'react'
import { createElement, Fragment } from 'react'

import { GLOB_PATH } from '../config' with { type: 'macro' }
import type { DocumentComponent, DocumentPageMeta } from '../typings'
import { Markdown } from './components/Markdown'

// TODO find project root
const modulesPath2PromiseMapping = import.meta.glob(GLOB_PATH)

// const mdxPath2PromiseMapping = import.meta.glob('../../*/index.demo.mdx', {
//   as: 'raw',
// })

// ============= Handle Components ====================

const componentName2PromiseMapping = Object.keys(
  modulesPath2PromiseMapping,
).reduce((acc, path) => {
  const [, name] = path.match(/\/([^/]+)\/index.demo.(tsx|mdx)$/) || []
  if (!name) {
    return {
      ...acc,
    }
  }
  return {
    ...acc,
    [name]: modulesPath2PromiseMapping[path],
  }
}, {})

export const componentsKeys = Object.keys(componentName2PromiseMapping)

// export const laziedComponents: LazyExoticComponent<any>[] = Object.values(
//   modulesPath2PromiseMapping
// ).map((promise) => React.lazy(promise as any))

export const laziedComponents: FC<any>[] = Object.values(
  modulesPath2PromiseMapping,
).map((promise) => {
  return React.lazy(() =>
    promise().then((module: any) => {
      const keys = Object.keys(module).filter((key) => key !== 'metadata')
      const isOnlyDefault = keys.length === 1 && module.default
      const components = [] as ReactNode[]

      // TODO Type assertion
      if (module.metadata && typeof module.metadata === 'object') {
        const { title, description } = module.metadata as DocumentPageMeta
        components.push(
          <div className="mb-8">
            <h1 className="my-6 text-xl font-bold">{title}</h1>

            {description && <Markdown value={description} />}
          </div>,
        )
      }

      for (const key of keys) {
        const DocumentComponent = module[key] as DocumentComponent<any>

        const { meta = {} } = DocumentComponent
        const { description, title } = meta
        components.unshift(
          <section className="mt-8 space-y-4">
            <h2 className="text-lg font-medium">{title || key}</h2>
            {!!description && <Markdown value={description} />}
            <DocumentComponent />
          </section>,
        )
      }
      return isOnlyDefault
        ? module
        : {
            default: () => createElement(Fragment, null, components),
          }
    }),
  )
})
