import { useIsomorphicLayoutEffect } from 'foxact/use-isomorphic-layout-effect'
import dynamic from 'next/dynamic'
import type { ReactNode } from 'react'
import { lazy, Suspense, useMemo, useState } from 'react'

import { HighLighterPrismCdn } from '~/components/ui/code-highlighter'
import { ShikiHighLighterWrapper } from '~/components/ui/code-highlighter/shiki/ShikiWrapper'
import { parseShouldCollapsedFromAttrs } from '~/components/ui/code-highlighter/shiki/utils'
import { ExcalidrawLoading } from '~/components/ui/excalidraw/ExcalidrawLoading'
import { ReactComponentRender } from '~/components/ui/react-component-render'
import { isClientSide } from '~/lib/env'

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

let shikiImport: ComponentType<any>
let mermaidImport: ComponentType<any>
export const CodeBlockRender = (props: {
  lang: string | undefined
  content: string

  attrs?: string
}) => {
  const Content = useMemo(() => {
    switch (props.lang) {
      case 'mermaid': {
        const Mermaid =
          mermaidImport ??
          dynamic(() => import('./Mermaid').then((mod) => mod.Mermaid))
        if (isClientSide) {
          mermaidImport = Mermaid
        }
        return <Mermaid {...props} />
      }
      case 'excalidraw': {
        return <ExcalidrawLazy data={props.content} />
      }
      case 'component': {
        return (
          <div className="not-prose my-4">
            <ReactComponentRender dls={props.content} />
          </div>
        )
      }
      default: {
        const { lang } = props
        const nextProps = { ...props }
        nextProps.content = formatCode(props.content)
        if (lang) {
          const ShikiHighLighter =
            shikiImport ??
            lazy(() =>
              import('~/components/ui/code-highlighter').then((mod) => ({
                default: mod.ShikiFallback,
              })),
            )
          if (isClientSide) {
            shikiImport = ShikiHighLighter
          }

          const fallback = (
            <ShikiHighLighterWrapper
              {...nextProps}
              shouldCollapsed={parseShouldCollapsedFromAttrs(props.attrs || '')}
            >
              <pre className="bg-transparent px-5">
                <code className="!px-5 !text-base-content">
                  {nextProps.content}
                </code>
              </pre>
            </ShikiHighLighterWrapper>
          )
          if (!isClientSide) return fallback
          return (
            <Suspense fallback={fallback}>
              <ShikiHighLighter {...nextProps} />
            </Suspense>
          )
        }

        return <HighLighterPrismCdn {...nextProps} />
      }
    }
  }, [props])

  return (
    <Suspense fallback={<BlockLoading>CodeBlock Loading...</BlockLoading>}>
      {Content}
    </Suspense>
  )
}

/**
 *  格式化代码：去除多余的缩进。
    多余的缩进：如果所有代码行中，开头都包括 n 个空格，那么开头的空格是多余的
 *
 */
function formatCode(code: string): string {
  const lines = code.split('\n')

  // 计算最小的共同缩进（忽略空行）
  let minIndent = Number.MAX_SAFE_INTEGER
  lines.forEach((line) => {
    if (line.trim().length > 0) {
      // 忽略纯空格行
      const leadingSpaces = line.match(/^ */)?.[0].length
      if (leadingSpaces === undefined) return
      minIndent = Math.min(minIndent, leadingSpaces)
    }
  })

  // 如果所有行都不包含空格或者只有空行，则不做处理
  if (minIndent === Number.MAX_SAFE_INTEGER) return code

  // 移除每行的共同最小缩进
  const formattedLines = lines.map((line) => {
    if (line.trim().length === 0) {
      // 如果是空行，则直接返回，避免移除空行的非空格字符（例如\t）
      return line
    } else {
      return line.slice(Math.max(0, minIndent))
    }
  })

  return formattedLines.join('\n')
}
