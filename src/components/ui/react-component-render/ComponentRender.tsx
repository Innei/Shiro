import { Suspense, useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { useIsomorphicLayoutEffect } from 'framer-motion'
import type { FC } from 'react'

import { BlockLoading } from '~/components/modules/shared/BlockLoading'
import { loadScript } from '~/lib/load-script'
import { get } from '~/lib/lodash'

export interface ReactComponentRenderProps {
  dls: string
}
/**
 * define the render dls of the component
 * ```component
 * import=http://127.0.0.1:2333/snippets/js/components.js
 * name=Components.Card
 * ```
 *
 * name will be used to find the component in the import, if in the nested object, use dot to separate
 *
 */
export const ReactComponentRender: FC<ReactComponentRenderProps> = (props) => {
  const { dls } = props
  const [Component, setComponent] = useState({
    component: ComponentBlockLoading,
  })

  useIsomorphicLayoutEffect(() => {
    const props = parseDlsContent(dls)

    loadScript(
      'https://unpkg.com/styled-components/dist/styled-components.min.js',
    )
      .then(() => loadScript(props.import))
      .then(() => {
        const Component = get(window, props.name)
        console.log('Component', Component)
        setComponent({ component: Component })
      })
  }, [dls])

  return (
    <ErrorBoundary FallbackComponent={ComponentBlockError}>
      <Suspense fallback={<ComponentBlockLoading />}>
        <Component.component />
      </Suspense>
    </ErrorBoundary>
  )
}

const ComponentBlockError = () => {
  return (
    <BlockLoading className="bg-red-300 dark:bg-red-700">
      Component Error
    </BlockLoading>
  )
}
const ComponentBlockLoading = () => {
  return <BlockLoading>Component Loading...</BlockLoading>
}

function parseDlsContent(dls: string) {
  const parsedProps = {} as {
    name: string
    import: string
  }
  dls.split('\n').forEach((line) => {
    const [key, value] = line.split('=')
    ;(parsedProps as any)[key] = value
  })

  return parsedProps
}
