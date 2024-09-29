import { useIsomorphicLayoutEffect } from 'framer-motion'
import type { FC } from 'react'
import { createContext, Suspense, useContext, useMemo, useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

import { BlockLoading } from '~/components/modules/shared/BlockLoading'
import { loadScript } from '~/lib/load-script'
import { get } from '~/lib/lodash'

import { ShadowDOM } from './ShadowDOM'

const StyleContext = createContext<React.CSSProperties>({})

export interface ReactComponentRenderProps {
  dls: string

  /**
   * use shadow dom to render the component
   */
  shadow?: boolean

  /**
   * inject host styles into the shadow dom
   */
  injectHostStyles?: boolean
}

/**
 * define the render dls of the component
 * ```component
 * import=http://127.0.0.1:2333/snippets/js/components.js
 * name=Components.Card
 * height=20 // This is optional
 * ```
 *
 * name will be used to find the component in the import, if in the nested object, use dot to separate
 *
 */
export const ReactComponentRender: FC<ReactComponentRenderProps> = (props) => {
  const { dls, shadow, injectHostStyles } = props
  const dlsProps = parseDlsContent(dls)
  const style: React.CSSProperties = useMemo(() => {
    if (!dlsProps.height) return {}
    const isNumberString = /^\d+$/.test(dlsProps.height)
    return {
      height: isNumberString ? `${dlsProps.height}px` : dlsProps.height,
    }
  }, [dlsProps.height])
  return (
    <ErrorBoundary fallback={<ComponentBlockError style={style} />}>
      <StyleContext.Provider value={style}>
        <ReactComponentRenderImpl
          {...dlsProps}
          injectHostStyles={injectHostStyles}
          shadow={shadow}
        />
      </StyleContext.Provider>
    </ErrorBoundary>
  )
}
const ReactComponentRenderImpl: FC<DlsProps> = (dlsProps) => {
  const [Component, setComponent] = useState({
    component: ComponentBlockLoading,
  })

  const style = useContext(StyleContext)
  useIsomorphicLayoutEffect(() => {
    loadScript(dlsProps.import).then(() => {
      const Component =
        get(window, `${dlsProps.name}.default`) || get(window, dlsProps.name)

      setComponent({ component: Component })
    })
  }, [dlsProps])
  const { injectHostStyles = false, shadow = false } = dlsProps
  return (
    <ErrorBoundary fallback={<ComponentBlockError style={style} />}>
      <Suspense fallback={<ComponentBlockLoading style={style} />}>
        <div style={style} className="overflow-hidden">
          {shadow ? (
            <ShadowDOM injectHostStyles={injectHostStyles}>
              <Component.component />
            </ShadowDOM>
          ) : (
            <Component.component />
          )}
        </div>
      </Suspense>
    </ErrorBoundary>
  )
}

const ComponentBlockError: FC<{
  style?: React.CSSProperties
}> = ({ style }) => (
  <BlockLoading style={style} className="bg-red-300 dark:bg-red-700">
    Component Error
  </BlockLoading>
)
const ComponentBlockLoading: FC<{
  style?: React.CSSProperties
}> = ({ style }) => (
  <BlockLoading style={style}>Component Loading...</BlockLoading>
)

type DlsProps = {
  name: string
  import: string
  height?: string
} & Pick<ReactComponentRenderProps, 'injectHostStyles' | 'shadow'>
function parseDlsContent(dls: string) {
  const parsedProps = {} as DlsProps
  dls.split('\n').forEach((line) => {
    const [key, value] = line.split('=')
    ;(parsedProps as any)[key] = value
  })

  return parsedProps
}
