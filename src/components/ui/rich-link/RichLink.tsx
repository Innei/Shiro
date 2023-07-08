import type { FC } from 'react'

import { Favicon } from './Favicon'

const prefixToUrlMap = {
  GH: 'https://github.com/',
  TW: 'https://twitter.com/',
  TG: 'https://t.me/',
}

export const RichLink: FC<{
  source: string
  name: string
}> = ({ name, source }) => {
  // @ts-ignore
  const urlPrefix = prefixToUrlMap[source]

  if (!urlPrefix) return null

  return (
    <span className="mx-1 inline-flex items-center space-x-1 align-bottom">
      <Favicon source={source} />
      <a
        target="_blank"
        rel="noreferrer nofollow"
        href={`${urlPrefix}${name}`}
        className="underline-offset-2"
      >
        {name}
      </a>
    </span>
  )
}
