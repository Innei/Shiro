import dynamic from 'next/dynamic'

const Mermaid = dynamic(() => import('./Mermaid').then((mod) => mod.Mermaid))
const HighLighter = dynamic(() =>
  import('~/components/ui/code-highlighter/CodeHighlighter').then(
    (mod) => mod.HighLighter,
  ),
)
export const CodeBlock = (props: {
  lang: string | undefined
  content: string
}) => {
  if (props.lang === 'mermaid') {
    return <Mermaid {...props} />
  } else {
    return <HighLighter {...props} />
  }
}

export default CodeBlock
