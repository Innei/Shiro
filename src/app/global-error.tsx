'use client'

import { useEffect } from 'react'

// TODO next.js not implement for now
export default ({ error, reset }: any) => {
  useEffect(() => {
    console.log(error, reset)
  }, [error])
  return (
    <html>
      <body>
        <div>Something went wrong</div>
      </body>
    </html>
  )
}
