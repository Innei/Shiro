import type { DocumentComponent } from 'storybook/typings'

import { CodeEditor } from './CodeEditor'

export const CodeEditorDemo: DocumentComponent = () => (
  <div className="h-[300px] overflow-auto border p-4">
    <CodeEditor
      content={Array.from({ length: 100 })
        .fill(null)
        .map(() => `const a = ${Math.random()};\n`)
        .join('')}
      language="javascript"
    />
  </div>
)

CodeEditorDemo.meta = {
  title: 'CodeEditor',
}
