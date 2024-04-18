import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ToastContainer } from 'react-toastify'
import { ThemeProvider } from 'next-themes'
import type { DocumentComponent } from 'storybook/typings'

import { useRefValue } from '~/hooks/common/use-ref-value'

import { ModalStackProvider } from '../modal'
import demo from './demo.json'
import { Excalidraw } from './Excalidraw'

export const Draw: DocumentComponent = () => {
  return (
    <ThemeProvider>
      {/* <EventProvider key="viewportProvider" /> */}
      <ModalStackProvider>
        <main className="relative m-auto mt-6 max-w-[800px]">
          <QueryClientProvider client={useRefValue(() => new QueryClient())}>
            <Excalidraw data={JSON.stringify(demo)} />
          </QueryClientProvider>
        </main>
      </ModalStackProvider>

      <ToastContainer />
    </ThemeProvider>
  )
}

Draw.meta = {
  title: 'Excalidraw',
}
