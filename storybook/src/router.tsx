import { createElement, Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { createHashRouter } from 'react-router-dom'
import type { RouteObject } from 'react-router-dom'

import {
  componentsKeys,
  laziedComponents,
  // mdxName2PromiseMapping,
} from './glob'
// import Debug from './routes/debug'
import { Root } from './routes/root'

const renderFromComponents = componentsKeys.map((key, index) => {
  return {
    path: key,
    name: key,
    Component: () => (
      <ErrorBoundary fallback={<div>Component has some errors.</div>}>
        <Suspense fallback={<div>Loading...</div>}>
          {createElement(laziedComponents[index])}
        </Suspense>
      </ErrorBoundary>
    ),
  }
}) satisfies RouteObject[]

const children = [...renderFromComponents].sort((a, b) => {
  return a.name.localeCompare(b.name)
})

// children.push({
//   path: 'debug',
//   Component: Debug,
//   name: 'debug',
// })
export const routes = createHashRouter([
  {
    path: '/',
    Component: Root,
    children,
  },
])

export const routeKeys = children.map((child) => child.name)
