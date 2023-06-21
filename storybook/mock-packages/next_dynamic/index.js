import React, { createElement, Suspense, useEffect, useState } from 'react'

export const dynamic = (loader) => {
  const Component = React.lazy(loader)
  return () => {
    const [NextComponent, setNextComponent] = useState(() => () => null)

    useEffect(() => {
      console.log(Component)
    }, [])
    return createElement(Suspense, null, [createElement(NextComponent, null)])
  }
}

// async () => null
// lazy(() => import('./MyComponent'))
export default dynamic
