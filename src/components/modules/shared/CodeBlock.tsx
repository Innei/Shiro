import { ReactComponentRender } from '~/components/ui/react-component-render'
import { lazy, Suspense, useMemo, useState } from 'react'
import { useIsomorphicLayoutEffect } from 'foxact/use-isomorphic-layout-effect'
import dynamic from 'next/dynamic'
import type { ReactNode } from 'react'

import { ExcalidrawLoading } from '~/components/ui/excalidraw/ExcalidrawLoading'

import { BlockLoading } from './BlockLoading'

const ExcalidrawLazy = ({ data }: any) => {
  const [Excalidraw, setComponent] = useState(null as ReactNode)

  useIsomorphicLayoutEffect(() => {
    const Component = lazy(() =>
      import('~/components/ui/excalidraw').then((mod) => ({
        default: mod.Excalidraw,
      })),
    )

    setComponent(<Component key={data} data={data} />)
  }, [data])

  return (
    <Suspense fallback={<ExcalidrawLoading />}>
      {Excalidraw ?? <ExcalidrawLoading />}
    </Suspense>
  )
}
export const CodeBlockRender = (props: {
  lang: string | undefined
  content: string
}) => {
  const Content = useMemo(() => {
    switch (props.lang) {
      case 'mermaid': {
        const Mermaid = dynamic(() =>
          import('./Mermaid').then((mod) => mod.Mermaid),
        )
        return <Mermaid {...props} />
      }
      case 'excalidraw': {
        return <ExcalidrawLazy data={props.content} />
      }
      case 'component': {
        return <ReactComponentRender dls={props.content} />
      }
      default: {
        const HighLighter = dynamic(() =>
          import('~/components/ui/code-highlighter/CodeHighlighter').then(
            (mod) => mod.HighLighter,
          ),
        )
        return <HighLighter {...props} />
      }
    }
  }, [props])

  return (
    <Suspense fallback={<BlockLoading>CodeBlock Loading...</BlockLoading>}>
      {Content}
    </Suspense>
  )
}
