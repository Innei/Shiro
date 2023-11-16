import React, { useCallback, useMemo, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import clsx from 'clsx'
import Link from 'next/link'
import RemoveMarkdown from 'remove-markdown'
import type { FC, ReactNode, SyntheticEvent } from 'react'

import { simpleCamelcaseKeys as camelcaseKeys } from '@mx-space/api-client'

import { LazyLoad } from '~/components/common/Lazyload'
import { usePeek } from '~/components/widgets/peek/usePeek'
import { useIsClientTransition } from '~/hooks/common/use-is-client'
import { preventDefault } from '~/lib/dom'
import { fetchGitHubApi } from '~/lib/github'
import { apiClient } from '~/lib/request'

import { LinkCardSource } from './enums'
import styles from './LinkCard.module.css'

export interface LinkCardProps {
  id: string
  source?: LinkCardSource
  className?: string
}

export const LinkCard = (props: LinkCardProps) => {
  const isClient = useIsClientTransition()

  if (!isClient) return null

  return (
    <LazyLoad placeholder={<LinkCardSkeleton />}>
      <LinkCardImpl {...props} />
    </LazyLoad>
  )
}

const LinkCardImpl: FC<LinkCardProps> = (props) => {
  const { id, source = LinkCardSource.Self, className } = props

  const [loading, setLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const [fullUrl, setFullUrl] = useState('about:blank')
  const [cardInfo, setCardInfo] = useState<{
    title: ReactNode
    desc?: ReactNode
    image?: string
  }>()

  const peek = usePeek()
  const handleCanPeek = useCallback(
    async (e: SyntheticEvent<any>) => {
      const success = peek(fullUrl)
      if (success) preventDefault(e)
    },
    [fullUrl],
  )

  const { isValid, fetchFn } = useMemo(
    () => validTypeAndFetchFunction(source, id),
    [source, id],
  )

  const fetchInfo = useCallback(async () => {
    if (!fetchFn) {
      return
    }
    setLoading(true)

    await fetchFn(id, setCardInfo, setFullUrl).catch((err) => {
      console.log('fetch card info error: ', err)
      setIsError(true)
    })
    setLoading(false)
  }, [fetchFn, id])

  const { ref } = useInView({
    triggerOnce: true,
    onChange(inView) {
      if (!inView) {
        return
      }

      fetchInfo()
    },
  })

  if (!isValid) {
    return null
  }

  const LinkComponent = source === 'self' ? Link : 'a'

  return (
    <LinkComponent
      href={fullUrl}
      target={source !== 'self' ? '_blank' : '_self'}
      ref={ref}
      className={clsx(
        styles['card-grid'],
        (loading || isError) && styles['skeleton'],
        isError && styles['error'],
        className,
      )}
      onClick={handleCanPeek}
    >
      <span className={styles['contents']}>
        <span className={styles['title']}>{cardInfo?.title}</span>
        <span className={styles['desc']}>{cardInfo?.desc}</span>
      </span>
      {(loading || cardInfo?.image) && (
        <span
          className={styles['image']}
          data-image={cardInfo?.image || ''}
          style={{
            backgroundImage: cardInfo?.image
              ? `url(${cardInfo.image})`
              : undefined,
          }}
        />
      )}
    </LinkComponent>
  )
}

const LinkCardSkeleton = () => {
  return (
    <span className={clsx(styles['card-grid'], styles['skeleton'])}>
      <span className={styles['contents']}>
        <span className={styles['title']} />
        <span className={styles['desc']} />
      </span>
      <span className={styles['image']} />
    </span>
  )
}

type FetchFunction = (
  id: string,
  setCardInfo: React.Dispatch<
    React.SetStateAction<
      | {
          title: ReactNode
          desc?: ReactNode
          image?: string | undefined
        }
      | undefined
    >
  >,
  setFullUrl: (url: string) => void,
) => Promise<void>

type FetchObject = {
  isValid: (id: string) => boolean
  fetch: FetchFunction
}

function validTypeAndFetchFunction(source: LinkCardSource, id: string) {
  const fetchDataFunctions = {
    [LinkCardSource.MixSpace]: fetchMxSpaceData,
    [LinkCardSource.GHRepo]: fetchGitHubData,
    [LinkCardSource.GHCommit]: fetchGitHubCommitData,
    [LinkCardSource.GHPr]: fetchGitHubPRData,
    [LinkCardSource.Self]: fetchMxSpaceData,
  } as Record<LinkCardSource, FetchObject>

  const fetchFunction = fetchDataFunctions[source]
  if (!fetchFunction) {
    return { isValid: false, fetchFn: null }
  }

  const isValid = fetchFunction.isValid(id)
  return { isValid, fetchFn: isValid ? fetchFunction.fetch : null }
}

const fetchGitHubData: FetchObject = {
  isValid: (id) => {
    // owner/repo
    const parts = id.split('/')
    return parts.length === 2 && parts[0].length > 0 && parts[1].length > 0
  },
  fetch: async (id, setCardInfo, setFullUrl) => {
    const [owner, repo] = id.split('/')
    try {
      const response = await fetchGitHubApi(
        `https://api.github.com/repos/${owner}/${repo}`,
      )
      const data = camelcaseKeys(response)

      setCardInfo({
        title: data.name,
        desc: data.description,
        image: data.owner.avatarUrl,
      })

      setFullUrl(data.htmlUrl)
    } catch (err) {
      console.error('Error fetching GitHub data:', err)
      throw err
    }
  },
}

const fetchGitHubCommitData: FetchObject = {
  isValid: (id) => {
    // 假设 'gh-commit' 类型的 id 应该是 'username/repo/commit/commitId' 的形式
    const parts = id.split('/')
    return (
      parts.length === 4 &&
      parts.every((part) => part.length > 0) &&
      parts[2] === 'commit'
    )
  },
  fetch: async (id, setCardInfo, setFullUrl) => {
    const [owner, repo, , commitId] = id.split('/')
    try {
      const response = await fetchGitHubApi(
        `https://api.github.com/repos/${owner}/${repo}/commits/${commitId}`,
      )
      const data = camelcaseKeys(response)

      setCardInfo({
        title: (
          <span className="font-normal">
            {data.commit.message.replace(/Signed-off-by:.+/, '')}
          </span>
        ),
        desc: (
          <span className="flex items-center space-x-5 font-mono">
            <span className="text-uk-green-light">+{data.stats.additions}</span>
            <span className="text-uk-red-light">-{data.stats.deletions}</span>

            <span className="text-sm">{data.sha.slice(0, 7)}</span>

            <span className="text-sm opacity-80">
              {owner}/{repo}
            </span>
          </span>
        ),
        image: data.author?.avatarUrl,
      })

      setFullUrl(`https://github.com/${owner}/${repo}/commit/${commitId}`)
    } catch (err) {
      console.error('Error fetching GitHub commit data:', err)
      throw err
    }
  },
}

const fetchGitHubPRData: FetchObject = {
  isValid: (id) => {
    // ${owner}/${repo}/${pr}
    const parts = id.split('/')
    return parts.length === 3 && parts.every((part) => part.length > 0)
  },
  fetch: async (id, setCardInfo, setFullUrl) => {
    const [owner, repo, , prNumber] = id.split('/')
    try {
      const response = await fetchGitHubApi(
        `https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}`,
      )
      const data = camelcaseKeys(response)

      setCardInfo({
        title: `PR: ${data.title}`,
        desc: (
          <span className="flex items-center space-x-5 font-mono">
            <span className="text-uk-green-light">+{data.additions}</span>
            <span className="text-uk-red-light">-{data.deletions}</span>
            <span className="text-sm opacity-80">
              {owner}/{repo}
            </span>
          </span>
        ),
        image: data.user.avatarUrl,
      })

      setFullUrl(data.htmlUrl)
    } catch (err) {
      console.error('Error fetching GitHub PR data:', err)
      throw err
    }
  },
}

const fetchMxSpaceData: FetchObject = {
  isValid: (id) => {
    // 'posts/cate/slug' 或 'notes/nid'
    const [type, ...rest] = id.split('/')
    if (type !== 'posts' && type !== 'notes') {
      return false
    }

    if (type === 'posts') {
      return rest.length === 2
    }
    return rest.length === 1
  },
  fetch: async (id, setCardInfo, setFullUrl) => {
    const [type, ...rest] = id.split('/')
    try {
      let data: {
        title: string
        text: string
        images?: { src: string }[]
        meta?: Record<string, any>
        cover?: string
        summary?: string
      } = { title: '', text: '' }

      if (type === 'posts') {
        const [cate, slug] = rest
        const response = await apiClient.post.getPost(cate, slug)
        data = response
        setFullUrl(`/posts/${cate}/${slug}`)
      } else if (type === 'notes') {
        const [nid] = rest
        const response = await apiClient.note.getNoteById(nid)
        data = response
        setFullUrl(`/notes/${nid}`)
      }

      setCardInfo({
        title: data.title,
        desc: data.summary || `${RemoveMarkdown(data.text).slice(0, 50)}...`,
        image: data.cover || data.meta?.cover || data.images?.[0]?.src,
      })
    } catch (err) {
      console.error('Error fetching self data:', err)
      throw err
    }
  },
}
