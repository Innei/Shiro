'use client'

import Link from 'next/link'

import { Divider } from '~/components/ui/divider'
import { useCurrentPostDataSelector } from '~/providers/post/CurrentPostDataProvider'

export const PostRelated = () => {
  const related = useCurrentPostDataSelector((s) => s?.related)
  if (!related) {
    return null
  }

  if (!related.length) {
    return null
  }
  return (
    <div data-hide-print className="my-5">
      <Divider className="w-46 ml-auto mr-auto" />
      <h3 className="text-lg font-medium">
        <span>相关文章</span>
      </h3>
      <ul className="list-inside list-disc">
        {related.map((post) => {
          return (
            <li key={post.id}>
              <Link
                href={`/posts/${post.category.slug}/${post.slug}`}
                className="underline-current underline-dashed leading-10 underline"
              >
                {post.title}
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
