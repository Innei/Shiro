import '../styles/index.css'

import type { PropsWithChildren } from 'react'

import { BrowserSupport } from './browser-support'
import { init } from './init'
import { InitInClient } from './InitInClient'

init()
export default async function RootLayout({ children }: PropsWithChildren) {
  return (
    <>
      {children}
      <InitInClient />
      <BrowserSupport />
    </>
  )
}
