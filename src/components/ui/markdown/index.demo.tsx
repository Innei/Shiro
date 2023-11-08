import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ToastContainer } from 'react-toastify'
import { ThemeProvider } from 'next-themes'
import type { DocumentComponent } from 'storybook/typings'

// @ts-expect-error
import customize from './customize.md?raw'
import { Markdown } from './Markdown'

const queryClient = new QueryClient()
export const MarkdownCustomize: DocumentComponent = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <main className="relative m-auto mt-6 max-w-[800px]">
          <Markdown
            extendsRules={{
              codeBlock: {
                react(node, output, state) {
                  return (
                    <pre>
                      <code>{node.content}</code>
                    </pre>
                  )
                },
              },
            }}
            value={customize}
            className="prose"
            as="article"
          />
        </main>

        <ToastContainer />
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
