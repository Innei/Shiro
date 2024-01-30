import { Suspense, useMemo } from 'react'
import dynamic from 'next/dynamic'

const Mermaid = dynamic(() => import('./Mermaid').then((mod) => mod.Mermaid))
const HighLighter = dynamic(() =>
  import('~/components/ui/code-highlighter/CodeHighlighter').then(
    (mod) => mod.HighLighter,
  ),
)
const Excalidraw = dynamic(() =>
  import('~/components/ui/excalidraw').then((mod) => mod.Excalidraw),
)
export const CodeBlock = (props: {
  lang: string | undefined
  content: string
}) => {
  const Content = useMemo(() => {
    if (props.lang === 'mermaid') {
      return <Mermaid {...props} />
    } else if (props.lang === 'excalidraw') {
      return <Excalidraw data={JSON.parse(props.content)} />
    } else {
      return <HighLighter {...props} />
    }
  }, [props])

  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50px] items-center justify-center rounded-lg bg-slate-100 text-sm dark:bg-neutral-800">
          CodeBlock Loading...
        </div>
      }
    >
      {Content}
    </Suspense>
  )
}
