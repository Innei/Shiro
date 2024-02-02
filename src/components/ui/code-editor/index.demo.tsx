import type { DocumentComponent } from 'storybook/typings'

import { CodeEditor } from './CodeEditor'

export const CodeEditorDemo: DocumentComponent = () => {
  return (
    <div className="h-[300px] overflow-auto border p-4">
      <CodeEditor
        content={Array(100)
          .fill(null)
          .map(() => `const a = ${Math.random()};\n`)
          .join('')}
        language="javascript"
      />
    </div>
  )
}

CodeEditorDemo.meta = {
  title: 'CodeEditor',
}
