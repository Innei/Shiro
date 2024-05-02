'use client'

import { useEffect } from 'react'
import type { Blog, ItemList, WithContext } from 'schema-dts'

import { registerPushWorker } from '~/lib/push-worker'
import { useAggregationSelector } from '~/providers/root/aggregation-data-provider'

import { useHomeQueryData } from './query'

export default function Home() {
  useEffect(() => {
    registerPushWorker()
  }, [])
  const config = useAggregationSelector((state) => {
    return {
      user: state.user,
      seo: state.seo,
      url: state.url,
    }
  })
  const ldJson: WithContext<Blog> = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: config?.seo.title,
    url: config?.url.webUrl,
    description: config?.seo.description,
    author: {
      '@type': 'Person',
      name: config?.user.name,
      url: config?.url.webUrl,
    },
    publisher: {
      '@type': 'Person',
      name: config?.user.name,
      url: config?.url.webUrl,
    },
    image: {
      '@type': 'ImageObject',
      url: `${config?.url.webUrl}/og`,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': config?.url.webUrl,
    },
    keywords: config?.seo.keywords,
  }
  const { notes, posts } = useHomeQueryData()
  const listLdJson: WithContext<ItemList> = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: [...notes, ...posts]
      .sort((a, b) => {
        return new Date(b.created).getTime() - new Date(a.created).getTime()
      })
      .map((article, index) => {
        return {
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'BlogPosting',
            author: {
              '@type': 'Person',
              name: config?.user.name,
              url: config?.url.webUrl,
            },
            headline: article.title,
            image: article.meta?.cover || [],
            name: article.title,
            url:
              'nid' in article
                ? `${config?.url.webUrl}/notes/${article.nid}`
                : `${config?.url.webUrl}/posts/${article.category.slug}/${article.slug}`,
            datePublished: article.created,
          },
        }
      }),
  }
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(ldJson),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(listLdJson),
        }}
      />
    </>
  )
}
