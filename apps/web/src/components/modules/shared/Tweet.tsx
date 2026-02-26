import 'react-tweet/theme.css'

import { Suspense } from 'react'
import { IsolatedTweet } from 'react-tweet'

import { useIsDark } from '~/hooks/common/use-is-dark'

export default function Tweet({ id }: { id: string }) {
  const isDark = useIsDark()

  return (
    <span className="flex justify-center">
      <Suspense>
        <IsolatedTweet id={id} theme={isDark ? 'dark' : 'light'} />
      </Suspense>
    </span>
  )
}
