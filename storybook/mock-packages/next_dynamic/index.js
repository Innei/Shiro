import React, { lazy, Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

export default function dynamic(dynamicOptions, options) {
  let LazyComponent

  if (typeof dynamicOptions === 'function') {
    LazyComponent = lazy(() => {
      return dynamicOptions().then((mod) => {
        // 如果有默认导出，就使用默认导出
        if (mod.default) return mod

        // 否则，我们假设模块的第一个导出就是我们要的组件
        const exported = Object.values(mod)[0]
        return { default: exported }
      })
    })
  } else {
    LazyComponent = dynamicOptions
  }

  return function (props) {
    React.createElement(
      ErrorBoundary,
      null,
      React.createElement(
        Suspense,
        { fallback: React.createElement('div', null, 'Loading...') },
        React.createElement(LazyComponent, props),
      ),
    )
  }
}
