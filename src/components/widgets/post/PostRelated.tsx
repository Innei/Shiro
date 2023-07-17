'use client'

import { useCurrentPostDataSelector } from '~/providers/post/CurrentPostDataProvider'

import { PeekLink } from '../peek/PeekLink'

export const PostRelated = () => {
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
        <span>
          阅读此文章之前，你可能需要首先阅读以下的文章才能更好的理解上下文。
        </span>
      </h3>
      <ul className="list-inside list-disc">
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
