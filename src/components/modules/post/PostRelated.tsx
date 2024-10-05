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

  if (related.length === 0) {
    return null
  }
  return (
    <div data-hide-print className="prose mb-5 mt-8">
      <h3 className="flex items-center gap-2 text-lg font-medium">
        <i className="i-mingcute-question-line" />
        <span>{infoText}</span>
      </h3>
      <ul className="ml-0 mt-4 list-inside list-disc pl-0 text-base leading-relaxed">
        {related.map((post) => {
          const href = `/posts/${post.category.slug}/${post.slug}`
          return (
            <li key={href}>
              <PeekLink href={href} className="shiro-link--underline">
                {post.title}
              </PeekLink>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
