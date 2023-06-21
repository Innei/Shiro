import { Mermaid } from '~/components/common/Mermaid'

import { HighLighter } from '../ui/code-highlighter'

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