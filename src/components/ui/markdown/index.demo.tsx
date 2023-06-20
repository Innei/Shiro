import { ToastContainer } from 'react-toastify'
import { ThemeProvider } from 'next-themes'
import type { DocumentComponent } from 'storybook/typings'

import { Markdown } from './Markdown'
// @ts-expect-error
import md from './test-text.md?raw'

export const MarkdownDemo1: DocumentComponent = () => {
  return (
    <ThemeProvider>
      <main className="relative m-auto mt-6 max-w-[800px] border border-accent/10">
        <Markdown value={md} className="prose" as="article" />
      </main>

      <ToastContainer />
    </ThemeProvider>
  )
}

MarkdownDemo1.meta = {
  title: 'Markdown',
}
