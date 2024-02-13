import { useQuery } from '@tanstack/react-query'
import { useEffect, useMemo, useRef } from 'react'
import type { CategoryModel } from '@mx-space/api-client'

import { adminQueries } from '~/queries/definition'

import { useBaseWritingAtom } from '../writing/BaseWritingProvider'

export const SlugInput = () => {
  const webUrl = location.origin

  const [categoryId, setCategoryId] = useBaseWritingAtom('categoryId')

  const [slug, setSlug] = useBaseWritingAtom('slug')
  const { data: categories } = useQuery(adminQueries.post.allCategories())
  const category = categories?.data?.[0]

  const triggerOnceRef = useRef(false)
  useEffect(() => {
    if (triggerOnceRef.current) return
    if (!categoryId && category) {
      triggerOnceRef.current = true
      setCategoryId(category.id)
    }
  }, [category, categoryId, setCategoryId])
  const categoryIdMap: Record<string, CategoryModel> = useMemo(() => {
    if (!categories) return {}
    return categories.data.reduce(
      (acc, category) => ({
        ...acc,
        [category.id]: category,
      }),
      {},
    )
  }, [categories])

  const isLoading = !category
  return (
    <>
      {isLoading || !categoryId ? (
        <div className="h-2 w-[120px] animate-pulse bg-white" />
      ) : (
        <label className="text-base-content">{`${webUrl}/posts/${categoryIdMap?.[categoryId]?.slug}/`}</label>
      )}

      <div className="relative ml-1 inline-flex min-w-[2rem] items-center overflow-hidden rounded-md bg-white py-1 dark:bg-zinc-900 [&_*]:leading-4">
        <input
          className="input input-sm absolute w-full translate-y-[1px] !border-0 bg-transparent !outline-none"
          value={slug}
          onChange={(e) => {
            setSlug(e.target.value)
          }}
        />
        <span className="pointer-events-none whitespace-nowrap text-transparent">
          {slug}
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </span>
      </div>
    </>
  )
}
