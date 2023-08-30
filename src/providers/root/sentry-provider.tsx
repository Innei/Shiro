// import { useEffect } from 'react'
// import type { PropsWithChildren } from 'react'
//
// import {
//   captureException,
//   captureUnderscoreErrorException,
// } from '@sentry/nextjs'
//
// export const SentryProvider = ({ children }: PropsWithChildren) => {
//   useEffect(() => {
//     window.onerror = function (message, source, lineno, colno, error) {
//       captureException(error)
//     }
//
//     window.addEventListener('unhandledrejection', (event) => {
//       captureUnderscoreErrorException(event.reason)
//     })
//
//     return () => {
//       window.onerror = null
//     }
//   }, [])
//   return children
// }

export {}
