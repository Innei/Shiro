import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useIsomorphicLayoutEffect } from 'foxact/use-isomorphic-layout-effect'
import { ThemeProvider } from 'next-themes'
import type { ReactNode } from 'react'
import * as React from 'react'
import { lazy, Suspense, useMemo, useState } from 'react'
import ReactDOM from 'react-dom'
import type { DocumentComponent } from 'storybook/typings'

import { BlockLoading } from '~/components/modules/shared/BlockLoading'
import { Mermaid } from '~/components/modules/shared/Mermaid'
import { ExcalidrawLoading } from '~/components/ui/excalidraw/ExcalidrawLoading'
import { ReactComponentRender } from '~/components/ui/react-component-render/ComponentRender'

import { HighLighterPrismCdn } from '../code-highlighter'
import { Toaster } from '../toast'
// @ts-expect-error
import customize from './customize.md?raw'
import { Markdown } from './Markdown'

const queryClient = new QueryClient()

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
const CodeBlockRender = (props: {
  lang: string | undefined
  content: string

  attrs?: string
}) => {
  const Content = useMemo(() => {
    switch (props.lang) {
      case 'mermaid': {
        return <Mermaid {...props} />
      }
      case 'excalidraw': {
        return <ExcalidrawLazy data={props.content} />
      }
      case 'component': {
        return <ReactComponentRender dls={props.content} />
      }
      default: {
        return <HighLighterPrismCdn {...props} />
      }
    }
  }, [props])

  return (
    <Suspense fallback={<BlockLoading>CodeBlock Loading...</BlockLoading>}>
      {Content}
    </Suspense>
  )
}
declare const window: any
window.React = React
window.ReactDOM = ReactDOM

export const MarkdownCustomize: DocumentComponent = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <main className="relative m-auto mt-6 max-w-[800px]">
          <Markdown
            value={customize}
            extendsRules={{
              codeBlock: {
                react(node, output, state) {
                  return (
                    <CodeBlockRender
                      key={state?.key}
                      content={node.content}
                      lang={node.lang}
                    />
                  )
                },
              },
            }}
            className="prose"
            as="article"
          />
        </main>

        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  )
}

MarkdownCustomize.meta = {
  title: 'Markdown Customize',
}

// export const MarkdownCommon: DocumentComponent = () => {
//   return (
//     <LazyLoad>
//       <ThemeProvider>
//         <main className="relative m-auto mt-6 max-w-[800px] border border-accent/10">
//           <Markdown value={md} className="prose" as="article" />
//         </main>

//         <ToastContainer />
//       </ThemeProvider>
//     </LazyLoad>
//   )
// }

// MarkdownCommon.meta = {
//   title: 'Markdown Common',
// }
