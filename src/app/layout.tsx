import '../styles/index.css'

import type { PropsWithChildren } from 'react'

import { ClerkProvider } from '@clerk/nextjs'

import { init } from './init'
import { InitInClient } from './InitInClient'

init()
export default async function RootLayout({ children }: PropsWithChildren) {
  return (
    <ClerkProvider>
      {children}
      <InitInClient />
    </ClerkProvider>
  )
}
