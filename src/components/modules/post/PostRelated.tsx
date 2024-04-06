'use client'

import type { FC } from 'react'

import { useCurrentPostDataSelector } from '~/providers/post/CurrentPostDataProvider'

import { PeekLink } from '../peek/PeekLink'

export const PostRelated: FC<{
  infoText: string
}> = ({ infoText }) => {
  const related = useCurrentPostDataSelector((s) => s?.related)
  if (!related) {
    return null
  }

  if (!related.length) {
    return null
  }
  return (
    <div data-hide-print className="mb-5 mt-8">
      <h3 className="text-lg font-medium">
        <span>{infoText}</span>
      </h3>
      <ul className="list-inside list-disc text-base">
        {related.map((post) => {
          const href = `/posts/${post.category.slug}/${post.slug}`
          return (
            <li key={href}>
              <PeekLink
                href={href}
                className="underline-current underline-dashed leading-10 underline"
              >
                {post.title}
              </PeekLink>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
